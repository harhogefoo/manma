// レポートを催促するscript

function remaind_report_Function() {
  var FORM_MAM_COLUMN = {
    TIMESTAMP: 0,  // A1 記入日
    MANMA_member: 1,  // B1 担当
    FAMILY_NAME: 2,  // C1 お名前（家庭）
    FAMILY_EMAIL: 3,  // D1 ご連絡先（家庭）
    CAN_FAMILY_ABROAD: 4,  // E1 受け入れ可否
    STUDENT_NAME_1: 5,  // F1 参加学生名（1人目）
    STUDENT_EMAIL_1: 6,  // G1 参加学生の連絡先（1人目）
    STUDENT_NAME_2: 7,  // H1 参加学生名（2人目）
    STUDENT_EMAIL_2: 8,  // I1 参加学生の連絡先（2人目）
    STUDENT_NAME_3: 9,  // J1 参加学生名（3人目）
    STUDENT_EMAIL_3: 10,  // K1 参加学生の連絡先（3人目）
    FAMILY_CONSTRUCTION: 11,  // L1 受け入れ家庭の家族構成
    START_DATE: 12,  // M1 実施日時
    START_TIME: 13,  // N1 実施開始時間
    FINISH_TIME: 14,  // O1 実施終了時間
    MTG_PLACE: 15,  // P1 集合場所
    POSSIBLE_DATE: 16,  // Q1 受け入れ可能な日程
    NULL: 17,  // R1
    MAM_CHECK: 18,  // S1 manmaチェック欄
    IS_EMAIL_SENT: 19,  // T1 sent欄
    MAM_REPLY_CHECK: 20,  // U1 manma　返信確認
    IS_CONFIRM_EMAIL_SENT: 21,  // V1 実施sent欄
    CHECK_PAYMENT_1: 22,  // W1 振り込み確認(1人目)
    CHECK_PAYMENT_2: 23,  // X1 振り込み確認(2人目)
    CHECK_PAYMENT_3: 24,  // Y1 振り込み確認(3人目)
    SELF_INTRO_FAM: 25,  // Z1 プロフィール確認(家庭)
    SELF_INTRO_1: 26,  // AA1 プロフィール確認(1人目)
    SELF_INTRO_2: 27,  // AB1 プロフィール確認(2人目)
    SELF_INTRO_3: 28,  // AC1 プロフィール確認(3人目)
    THANK_YOU_MESE1: 29,  // AD1 お礼メール確認欄(1人目)
    THANK_YOU_MESE2: 30,  // AE1 お礼メール確認欄(1人目)
    THANK_YOU_MESE3: 31,  // AF1 お礼メール確認欄(3人目)
    REPORT_1: 32,  // AG1 レポート提出確認(1人目)
    REPORT_2: 33,  // AH1 レポート提出確認(2人目)
    REPORT_3: 34,  // AI1 レポート提出確認(3人目)
  }

  sent_remind_report_Function("フォームの回答", FORM_MAM_COLUMN);
  //手動の場合を実行

  var MANUAL_MAM_COLUMN = {
    TIMESTAMP: 0,  // A1 記入日
    MANMA_member: 1,  // B1 担当
    FAMILY_NAME: 2,  // C1 お名前（家庭）
    FAMILY_EMAIL: 3,  // D1 ご連絡先（家庭）
    STUDENT_NAME_1: 4,  // E1 参加学生名（1人目）
    STUDENT_EMAIL_1: 5,  // F1 参加学生の連絡先（1人目）
    STUDENT_NAME_2: 6,  // G1 参加学生名（2人目）
    STUDENT_EMAIL_2: 7,  // H1 参加学生の連絡先（2人目）
    STUDENT_NAME_3: 8,  // I1 参加学生名（3人目）
    STUDENT_EMAIL_3: 9,  // J1 参加学生の連絡先（3人目）
    FAMILY_CONSTRUCTION: 10,  // K1 受け入れ家庭の家族構成
    START_DATE: 11,  // L1 実施日時
    START_TIME: 12,  // M1 実施開始時間
    FINISH_TIME: 13,  // N1 実施終了時間
    MTG_PLACE: 14,  // O1 集合場所
    NULL: 15,  // P1
    MAM_CHECK: 16,  // Q1 manmaチェック欄
    IS_EMAIL_SENT: 17,  // R1 sent欄
    MAM_REPLY_CHECK: 18,  // S1 manma　返信確認
    IS_CONFIRM_EMAIL_SENT: 19,  // T1 実施sent欄
    CHECK_PAYMENT_1: 20,  // U1 振り込み確認(1人目)
    CHECK_PAYMENT_2: 21,  // V1 振り込み確認(2人目)
    CHECK_PAYMENT_3: 22,  // W1 振り込み確認(3人目)
    SELF_INTRO_FAM: 23,  // X1 プロフィール確認(家庭)
    SELF_INTRO_1: 24,  // Y1 プロフィール確認(1人目)
    SELF_INTRO_2: 25,  // Z1 プロフィール確認(2人目)
    SELF_INTRO_3: 26,  // AA1 プロフィール確認(3人目)
    THANK_YOU_MESE1: 27,  // AB1 お礼メール確認欄(1人目)
    THANK_YOU_MESE2: 28,  // AC1 お礼メール確認欄(2人目)
    THANK_YOU_MESE3: 29,  // AD1 お礼メール確認欄(3人目)
    REPORT_1: 30,  // AE1 レポート提出確認(1人目)
    REPORT_2: 31,  // AF1 レポート提出確認(2人目)
    REPORT_3: 32,  // AG1 レポート提出確認(3人目)
  }
  sent_remind_report_Function("手動", MANUAL_MAM_COLUMN);
}


function sent_remind_report_Function(sheets, MAM_COLUMN) {
  var sheet = SpreadsheetApp.getActive().getSheetByName(sheets);
  var startRow = 2;  // First row of data to process
  var lastRow = sheet.getLastRow() - 1;
  var lastCol = sheet.getLastColumn();
  var now_date = new Date();
  var year = now_date.getFullYear();
  var month = now_date.getMonth() + 1;
  var day = now_date.getDate();

  var nowdate = Utilities.formatDate(now_date, 'JST', 'yyyy/MM/dd');
  var dataRange = sheet.getRange(startRow, 1, lastRow, lastCol);

  var data = dataRange.getValues();

  for (var i = 0; i < data.length; ++i) {
    var row = data[i];
    var notify_date = row[MAM_COLUMN.IS_CONFIRM_EMAIL_SENT];

    if (notify_date !== "") {
      //1人目

      var family_abroad_date = new Date(row[MAM_COLUMN.START_DATE]);
      var familyabroad_date = Utilities.formatDate(family_abroad_date, 'JST', 'yyyy/MM/dd')
      var report_flag_1 = row[MAM_COLUMN.REPORT_1];
      var first_alertmail_date = Utilities.formatDate((new Date((family_abroad_date.getTime()) + (60 * 60 * 24 * 1000) * 3)), 'JST', 'yyyy/MM/dd');
      var second_alertmail_date = Utilities.formatDate((new Date((family_abroad_date.getTime()) + (60 * 60 * 24 * 1000) * 5)), 'JST', 'yyyy/MM/dd');
      var last_alertmail_date = Utilities.formatDate((new Date((family_abroad_date.getTime()) + (60 * 60 * 24 * 1000) * 7)), 'JST', 'yyyy/MM/dd');
      var student_name = row[MAM_COLUMN.STUDENT_NAME_1];
      var student_mail = row[MAM_COLUMN.STUDENT_EMAIL_1];

      if (report_flag_1 == "") {
        if (first_alertmail_date == nowdate || second_alertmail_date == nowdate || last_alertmail_date == nowdate) {
          var student_subject = "【manma】参加後レポートの提出のご確認";
          var student_message = student_name + "さま\n\n"
            + "お世話になっております、manmaです。\n\n"
            + "先日ご案内いたしましたフォームへのご記入をよろしくお願いいたします。\n\n"
            + "家族留学は“家族留学の学び”をフォームにご記入いただいたのち、正式に終了とさせていただきますので、下記のフォームよりご記入くださいませ。\n\n"
            + "また、家族留学終了後は、参加者より受け入れてくださったご家族に、お礼のメールをお送りいただきたく思います。\n"
            + "行き違いでのご連絡となっておりましたら申し訳ございません。\n"
            + "▷▷▷ http://goo.gl/forms/YQCfdw4sSQ\n"
            + "何卒よろしくお願いいたします。\n\n"
            + "manma";
          GmailApp.sendEmail(student_mail, student_subject, student_message, {name: 'manma'});

        }
      }
      //2人目
      var student_name_2 = row[MAM_COLUMN.STUDENT_NAME_2];
      var student_mail_2 = row[MAM_COLUMN.STUDENT_EMAIL_2];
      if (student_name_2 != "") {
        var report_flag_2 = row[MAM_COLUMN.REPORT_2];
      }

      if (report_flag_2 == "") {
        if (first_alertmail_date == nowdate || second_alertmail_date == nowdate || last_alertmail_date == nowdate) {
          var student_subject_2 = "【manma】参加後レポートの提出のご確認";
          var student_message_2 = student_name_2 + "さま\n\n"
            + "お世話になっております、manmaです。\n\n"
            + "先日ご案内いたしましたフォームへのご記入をよろしくお願いいたします。\n\n"
            + "家族留学は“家族留学の学び”をフォームにご記入いただいたのち、正式に終了とさせていただきますので、下記のフォームよりご記入くださいませ。\n\n"
            + "また、家族留学終了後は、参加者より受け入れてくださったご家族に、お礼のメールをお送りいただきたく思います。\n"
            + "行き違いでのご連絡となっておりましたら申し訳ございません。\n"
            + "▷▷▷ http://goo.gl/forms/YQCfdw4sSQ\n"
            + "何卒よろしくお願いいたします。\n\n"
            + "manma";
          GmailApp.sendEmail(student_mail_2, student_subject, student_message, {name: 'manma'});

        }
      }
      //3人目
      var student_name_3 = row[MAM_COLUMN.STUDENT_NAME_3];
      var student_mail_3 = row[MAM_COLUMN.STUDENT_EMAIL_3];
      if (student_name_3 != "") {
        var report_flag_3 = row[MAM_COLUMN.REPORT_3];
      }

      if (report_flag_3 == "") {
        if (first_alertmail_date == nowdate || second_alertmail_date == nowdate || last_alertmail_date == nowdate) {
          var student_subject_3 = "【manma】参加後レポートの提出のご確認";
          var student_message_3 = student_name_3 + "さま\n\n"
            + "お世話になっております、manmaです。\n\n"
            + "先日ご案内いたしましたフォームへのご記入をよろしくお願いいたします。\n\n"
            + "家族留学は“家族留学の学び”をフォームにご記入いただいたのち、正式に終了とさせていただきますので、下記のフォームよりご記入くださいませ。\n\n"
            + "また、家族留学終了後は、参加者より受け入れてくださったご家族に、お礼のメールをお送りいただきたく思います。\n"
            + "行き違いでのご連絡となっておりましたら申し訳ございません。\n"
            + "▷▷▷ http://goo.gl/forms/YQCfdw4sSQ\n"
            + "何卒よろしくお願いいたします。\n\n"
            + "manma";
          GmailApp.sendEmail(student_mail_3, student_subject, student_message, {name: 'manma'});

        }
      }
    }
  }
}
