 // 家族留学が実施できる旨を学生に連絡するscript
// updated_at: 20170228
// edited by: shinocchi
function sent_students_date_Function() {
  var MAM_COLUMN = {
    CAN_FAMILY_ABROAD: 1,  // B1: このたびの家族留学のご依頼を受け入れていただけますでしょうか。
    STUDENT_NAME:      2,  // C1: 参加学生名
    STUDENT_EMAIL:     3,  // D1: 参加学生の連絡先
    START_DATE:        7,  // H1: 実施日時
    START_TIME:        8,  // I1: 実施開始時間
    FINISH_TIME:       9,  // J1: 実施終了時間
    MTG_PLACE:        10,  // K1: 集合場所
    MAM_CHECK:        15,  // P1: manmaチェック欄 (登録を確認したら◯をつける．何かしら文字列が入っていればトリガーによってメールが送信される）
    IS_EMAIL_SENT:    16,  // Q1: sent欄 (メールがトリガーによって送信されたら今日の日付が入ります）
  }

  var sheet = SpreadsheetApp.getActive().getSheetByName('フォームの回答') ;
  var startRow = 2;  // 2行目から処理を開始（1行目はヘッダ)
  var lastRow = sheet.getLastRow() - 1 ;
  var lastCol = sheet.getLastColumn();
  var now_date = new Date();
  var year = now_date.getFullYear();
  var month = now_date.getMonth() + 1;
  var day = now_date.getDate();

  var nowdate = Utilities.formatDate(now_date, 'JST', 'yyyy/MM/dd');
  var EMAIL_SENT_DATE = nowdate;

  var dataRange = sheet.getRange(startRow, 1, lastRow, lastCol);
  var data = dataRange.getValues();

  for (var i = 0; i < data.length; ++i) {
    var row = data[i];

    var student_name = row[MAM_COLUMN.STUDENT_NAME];
    var student_mail = row[MAM_COLUMN.STUDENT_EMAIL];
    
    var status =  row[MAM_COLUMN.CAN_FAMILY_ABROAD];
    if (status != "はい") {
      Logger.log(student_name + ": 受け入れ不可のためメールは送信しない");
      continue;
    }
    
    // P1: manmaチェック欄 (登録を確認したら◯をつける．何かしら文字列が入っていればトリガーによってメールが送信される）
    var manma_check_flag = row[MAM_COLUMN.MAM_CHECK];
    if (manma_check_flag == "") {
      Logger.log(student_name + ": チェック欄が空欄のためメールは送信しない")
        continue;
    }

    // Q1: sent欄 (メールが送信されている場合は送信日時が入力されている）
    var sent_flag = row[MAM_COLUMN.IS_EMAIL_SENT];
    if (sent_flag != "") {
      Logger.log(student_name + ": メールが送信された記録があるためメールは送信しない");
      continue;
    }

    // 参加延期，参加不可となった場合に実施日時を空欄にするためメールは送信しない
    var abroad_start_date = row[MAM_COLUMN.START_DATE];
    if (abroad_start_date == "") {
      Logger.log(student_name + ": 実施日時が空欄のためメールは送信しない");
      continue;
    }

    var abroad_start_time = new Date(row[MAM_COLUMN.START_TIME]);
    var abroad_finish_time = new Date(row[MAM_COLUMN.FINISH_TIME]);
    var abroad_place = row[MAM_COLUMN.MTG_PLACE];

    var f_abroad_start_date = Utilities.formatDate(abroad_start_date, 'Asia/Tokyo', 'yyyy/MM/dd');
    var f_abroad_start_time = Utilities.formatDate(abroad_start_time, 'Asia/Tokyo', 'HH:mm');
    var f_abroad_finish_time = Utilities.formatDate(abroad_finish_time, 'Asia/Tokyo', 'HH:mm');

    var title = '【manma】家族留学実施日のお知らせ';
    var body  = student_name + "さま\n\n"
      + "先日は、事前説明会へのご参加ありがとうございました。\n"
      + "家族留学の実施日が確定いたしましたので、ご連絡いたします。\n\n"
      + "【実施概要】\n"
      + "日時："+ f_abroad_start_date + "\n"
      + "集合時間： " + f_abroad_start_time + "\n"
      + "集合場所： " + abroad_place + "\n"
      + "終了予定時間： " + f_abroad_finish_time + "\n\n"
      + "上記の内容で受け入れていただけることになりましたので、ご確認くださいませ。 \n"
      + "参加の可否について、こちらのメールを確認次第すぐにご返信いただきますようお願いいたします。\n\n"
      + "どうぞよろしくお願いいたします。\n\n"
      + "manma";

    GmailApp.sendEmail(student_mail, title, body, { name: 'manma' });
    // Q1: sent欄に送信した日付を入力
    sheet.getRange(startRow + i, MAM_COLUMN.IS_EMAIL_SENT + 1).setValue(EMAIL_SENT_DATE);
    // Make sure the cell is updated right away in case the script is interrupted
    SpreadsheetApp.flush();
  }
}

