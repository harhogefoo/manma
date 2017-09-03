/**
 * 事前面談1日前にリマインド
 * Created by shino on 2017/07/01.
 */
function remind() {
  const COLUMN = {
    NAME: 1, // B1: 氏名
    EMAIL: 2, // C2: メールアドレス
    INTERVIEW_DATE: 7,       // H1: 面談希望日時（場所：JR大塚駅付近）
    IS_REMIND: 12  // M1: リマンドメール送信済み？
  }

  const SHEET_NAME = 'フォームの回答'
  const SUBJECT = '【リマインド】家族留学の事前面談について'
  const MANMA_MAIL = 'info.manma@gmail.com'


  // 情報を取得するシートの決定
  var sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME)
  // 処理位置の決定
  var start_row = 2  // 2行目から処理を開始(1行目はヘッダ)
  var last_row = sheet.getLastRow() - 1
  var last_col = sheet.getLastColumn()
  var data_range = sheet.getRange(start_row, 1, last_row, last_col)
  var data = data_range.getValues()

  for (var i = 0; i < data.length; ++i) {
    var row = data[i]

    var is_remind = row[COLUMN.IS_REMIND]
    // 送信済みであれば何もしない
    if (is_remind != '') {
      continue
    }

    // 2017年7月1日 10:00~ という文字列を 2017/7/1 10:00 に変換する
    var interview_date_str = row[COLUMN.INTERVIEW_DATE]
    var interview_date = dateConverter(interview_date_str)
    interview_date = convertDatetimeToDate(interview_date)

    var is_need_remind = isRemind(interview_date, 3)

    if (!is_need_remind) {
      Logger.log('リマインド対象日ではないのでスルー')
      continue
    }

    // リマインドメール送信
    var name = row[COLUMN.NAME]
    var email = row[COLUMN.EMAIL]
    Logger.log(email)
    var content = getMailContent(name, interview_date_str)
    GmailApp.sendEmail(email, SUBJECT, content, {name: 'manma', cc: MANMA_MAIL});

    sheet.getRange(start_row + i, COLUMN.IS_REMIND + 1).setValue(new Date())

    SpreadsheetApp.flush();
  }
}

// 目的の日付けが、その日付けのX日後と一致すればリマインドが必要
// そうでなければリマインドはしない
function isRemind(target_date, later_days) {
  var one_day_later = getArgsDaysLater(later_days)
  if (target_date.getTime() == one_day_later.getTime()) {
    return true
  }
  return false
}

function getMailContent(name, interview_date) {
  return ""
    + name + " 様\n"
    + "\n"
    + "この度は、家族留学への参加申し込みをいただきありがとうございます。\n"
    + "\n"
    + "下記日程で、面談を実施させていただきます。\n"
    + "内容をご確認の上、ご参加をお待ちしております。\n"
    + "\n"
    + "・面談日時\n"
    + interview_date + " \n"
    + "\n"
    + "・面談場所\n"
    + "▼対面\n"
    + "  RYOZAN PARK 大塚\n"
    + "〒170-0005 東京都豊島区南大塚3-36-7 南大塚T&Tビル５F\n"
    + "※到着されましたら「507」の呼び鈴を鳴らしてください\n"
    + "▼オンライン\n"
    + "  ご記入頂いたSkypeもしくはFacebookをオンラインにしてお待ち下さい\n"
    + "\n"
    + "・持ち物\n"
    + "  参加費、身分証明書（初回参加の方のみ）\n"
    + "\n"
    + "・内容\n"
    + "①事前説明会（初回参加の方のみ）\n"
    + "②マッチング\n"
    + "※面談日から３週間〜２ヶ月の日程で家族留学を調整致します\n"
    + "\n"
    + "・参加費\n"
    + "  面談時に参加費をお支払いいただきます\n"
    + "\n"
    + "日程変更は原則としてお受けできません。\n"
    + "キャンセルをされる場合は、info@manma.co までご連絡の上\n"
    + "改めて下記リンクより面談をお申込みください。\n"
    + "http://manma.co/student/\n"
    + "\n"
    + "ご不明な点がございましたら\n"
    + "info@manma.co（久保）までお気軽にご連絡ください。\n"
    + "\n"
    + "お会いできますことを、楽しみにしております。\n"
}

function test() {
  // 今日から1日後
  var one_day_later = getArgsDaysLater(1)  // 今日から1日後
  Logger.log('今日から1日後: ' + one_day_later)

  var test_data = ['2017年6月30日 10:00~', '2017年7月1日 10:00~', '2017年7月2日 10:00~', '2017年7月3日 10:00~', '2017年7月4日 10:00~']
  for (var i = 0; i < test_data.length; i++) {
    var date = new Date(dateConverter(test_data[i]));
    date = convertDatetimeToDate(date)
    Logger.log('テスト開始: ' + date)
    isRemind(date, one_day_later, 1)
  }
}

/* Utility */
function removeTilde(str) {
  return str.replace(/~/g, '');
}

// yyyy年mm月dd日 を yyyy/mm/dd に変換
function convertFromJPStrDateToCommonDateStr(str) {
  str = str.replace(/年/g, '/')
  str = str.replace(/月/g, '/')
  return str.replace(/日/g, '')
}

// 2017年7月1日 10:00~ の形式の文字列を 2017/7/1 10:00 に変換する
// @return [Date] 変換されたDate型
function dateConverter(date_str) {
  date_str = removeTilde(date_str)
  date_str = convertFromJPStrDateToCommonDateStr(date_str)
  return new Date(date_str)
}

// @param [int] 今日の日付から num_days 日後
// @return [Date] 今日から1日後のDate
function getArgsDaysLater(num_days) {
  var current_time_ms = getCurrentTimeMilliSecond()
  // 今日から1日後
  return new Date(current_time_ms + (60 * 60 * 24 * 1000) * num_days);
}

// @return [long] 今日の日付 0時のms
function getCurrentTimeMilliSecond() {
  // 今日の日付をフォーマットして取得
  var today = new Date();
  var year = today.getFullYear();
  var month = today.getMonth() + 1;
  var day = today.getDate();

  var current_time_ms = new Date(year, month - 1, day).getTime();
  return current_time_ms
}

function convertDatetimeToDate(datetime) {
  var year = datetime.getFullYear();
  var month = datetime.getMonth();
  var day = datetime.getDate();
  var date = new Date(year, month, day)
  return new Date(year, month, day)
}
