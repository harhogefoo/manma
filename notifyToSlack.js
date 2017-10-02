/**
 * messagesシートから、お知らせを生成してslackに投稿する
 * Incoming Webhook を生成し、URLを webhookurl に指定する
 */
function notifyToSlack() {
  const COL = {
    CHANNEL: 0,
    TEXT: 1,
    NAME: 2,
    START: 3,
    END: 4,
    HOUR: 5,
    INTERVAL: 6,
    EXPIRED: 7
  }

  const mSheet = (function() {
    const sheet = SpreadsheetApp.getActive().getSheetByName("お知らせ");
    const startRow = 3 // First row of data to process
    const lastRow = sheet.getLastRow() - 1
    const lastCol = sheet.getLastColumn()
    const dataRange = sheet.getRange(startRow, 1, lastRow, lastCol)
    return {
      values: function() { return dataRange.getValues() }
    }
  })()

  const mDate = (function() {
    return {
      today: function() { return new Date() },
      day: function() { return (new Date()).getDay() }, // 曜日
      date: function() { return (new Date()).getDate() },
      hour: function() { return (new Date()).getHours() },
      todayStr: function() { return Utilities.formatDate(new Date(), "JST", "yyyy/MM/dd") },
      inRange: function(start, end) {
        return start <= mDate.todayStr() && mDate.todayStr() <= end
      },
    }
  })()

  /**
   * 配信対象日かを返す
   */
  const isTargetDay = (function() {
    return {
      exec: function(interval) {
        var isTarget = false;
        var day = mDate.day() // 曜日
        var date = mDate.date() // 日付
        var dayOfWeek = ["日曜", "月曜", "火曜", "水曜", "木曜", "金曜", "土曜"]

        if (interval == "毎日") {
          isTarget = true
        } else if (dayOfWeek[day] == interval) { // 指定曜日か
          isTarget = true
        } else if (interval == "平日" && day > 0 && day < 6) {
          isTarget = true
        } else if (interval === date) { // 毎月のお知らせ
          isTarget = true
        }
        return isTarget;
      }
    }
  })()

  /**
   * スプレッドシートの中身でお知らせ予定のメッセージを取得して返す
   */
  const getMessages = (function() {
    return {
      exec: function() {
        var data = mSheet.values()
        var messages = new Object();
        for (var i = 0; i < data.length; ++i) {
          var row = data[i]
          Logger.log(row)
          var start = '2000/01/01' // 通知開始日
          var end = '2018/01/01' // 通知終了日
          var hour = row[COL.HOUR]; // 通知時刻
          var interval = row[COL.INTERVAL]; // 間隔(daily/weekly/weekday)
          if (row[COL.START] instanceof Date) {
            start = Utilities.formatDate(row[COL.START], "JST", "yyyy/MM/dd");
          }
          if (row[COL.END] instanceof Date) {
            end = Utilities.formatDate(row[COL.END], "JST", "yyyy/MM/dd");
          }
          // 通知範囲外ならcontinue
          if (!mDate.inRange(start, end)) { continue }

          // 配信対象日かをチェック
          if (!isTargetDay.exec(interval)) { continue }

          // 指定時刻、未指定の場合は9時に配信する
          var isNotBlankWithMatch = (hour !== "") && (mDate.hour() === hour)
          var isBlankBut9Hour = (hour === "") && (mDate.hour() === 9)
          if (isNotBlankWithMatch || isBlankBut9Hour) {
            var channel = row[COL.CHANNEL]
            if (channel in messages == false) {
              messages[channel] = [];
            }
            var properties = {name: row[COL.NAME], text: row[COL.TEXT]}
            messages[channel].push(properties)
          }
        }
        return messages
      }
    }
  })()

  /**
   * 指定されたチャネルにメッセージを送信する
   */
  const postToSlack = (function() {
    const webhookurl = "https://hooks.slack.com/services/xxx/xxx";
    const botName = "お知らせbot" // 通知するロボットの名前
    const botIcon = ":chicken:" // 通知するロボットのアイコン
    return {
      exec: function(msg, channel) {
        var jsonData = {
          "channel": channel,
          "username": botName === undefined ? "" : botName,
          "text": msg,
          "icon_emoji": botIcon === undefined ? "" : botIcon
        };
        var payload = JSON.stringify(jsonData);
        var options = {
          "method" : "post",
          "payload" : payload
        };
        UrlFetchApp.fetch(webhookurl, options);
      }
    }
  })()

  var messages = getMessages.exec()
  for (var channel in messages) {
    var msg = "";
    if (channel.charAt(0) != "@") {
      // Direct Message 以外は mention をつける
      msg += "<!channel> 【<https://docs.google.com/spreadsheets/d/xxxx/|お知らせシート>】\n";
    }
    var properties = messages[channel]
    for (var i = 0; i < properties.length; i ++) {
      var prop = properties[i]
      msg += "- " + prop.text + "\n";
    }
    Logger.log("message: " + msg)
    postToSlack.exec(msg, channel);
  }
}
