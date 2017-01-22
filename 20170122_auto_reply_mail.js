function submitForm(e) {
  // 自動返信メールの件名
  var title = "【manma：フォームへのご記入ありがとうございます】";

  // 自動返信メールの本文　\nは改行。
  var body
    = "フォームへのご登録ありがとうございました。\n"
    +"下記のとおりフォームを承りました。\n\n"
    + "------------------------------------------------------------\n";

  // 自動返信メールの本文2 本文1と本文2の間に入力内容が入る
  var body2
    = "------------------------------------------------------------\n\n"
    + "確認後、担当の者から３日以内に返信いたします。";

  var itemResponses = e.response.getItemResponses();
  // 登録者の氏名
  var apply_name = '';
  // 登録者のメールアドレス
  var apply_mail = '';
  for (var i = 0; i < itemResponses.length; i++) {
    var itemResponse = itemResponses[i];
    var question = itemResponse.getItem().getTitle();
    var answer = itemResponse.getResponse();

    if (question == 'お名前') {
      apply_name = answer;
    }

    if (question == 'ご連絡先メールアドレス') {
      apply_mail = answer;
    }
    // 本文（body）に、フォームの入力項目を追加
    body += "■" + question + " : " + answer + "\n";
  }

  body = apply_name + " 様 \n\n" + body;
  // 本文1に本文2を追加
  body += body2;

  // 宛名＝address、件名＝title、本文=bodyで、メールを送る
  GmailApp.sendEmail(apply_mail, title, body, { from:'info.manma@gmail.com', name:'manma' });
}
