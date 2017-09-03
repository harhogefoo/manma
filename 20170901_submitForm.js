function submitForm(e) {
  var itemResponses = e.response.getItemResponses();
  // フォームの内容を保持する（manma宛に送信）
  var message = '';

  // 登録者の氏名
  var apply_name = '';

  // 登録者のメールアドレス
  var apply_mail = e.response.getRespondentEmail()
  message += 'メールアドレス: ' + apply_mail + '\n'

  for (var i = 0; i < itemResponses.length; i++) {
    var itemResponse = itemResponses[i];
    var question = itemResponse.getItem().getTitle();
    var answer = itemResponse.getResponse();

    if (question == 'メールアドレス') {
      apply_mail = answer
    } else if (question == 'お名前') {
      apply_name = answer
    }
    message += (i + 1).toString() + '. ' + question + ': ' + answer + '\n';
  }

  // manmaメンバー向けメール設定
  var self_body  = "以下の内容でフォームが送信されました。\n\n" + message;
  var self_subject = "岡山大学における家族留学受け入れ可否アンケートへの回答";

  // 自動送信向けメール設定
  var subject = "【manma】岡山大学における家族留学アンケートへのご回答ありがとうございます";

  // 登録者向け本文
  var body = apply_name + " 様\n"
    + "\n"
    + "この度は、岡山大学における家族留学受け入れ可否アンケートにご協力いただきありがとうございます。\n"
    + "\n"
    + "受け入れを希望される方には、改めてご連絡差し上げます。\n"
    + "\n"
    + "何かご質問等ございましたら\n"
    + "ochi@manma.co（越智）までご連絡ください。\n"
    + "\n"
    + "今後ともmanmaをどうぞ宜しくお願い致します。\n"
    + "\n";

  // manmaメンバー向け
  GmailApp.sendEmail('info.manma@gmail.com', self_subject, self_body, {name: 'manmaシステム'});

  // 登録者向け
  GmailApp.sendEmail(apply_mail, subject, body, {name: 'manma'});
}
