function submitForm(e) {
  var itemResponses = e.response.getItemResponses();
  // フォームの内容を保持する（manma宛に送信）
  var message = '';
  // 登録者の氏名
  var apply_name = '';
  // 登録者のメールアドレス
  var apply_mail = '';
  for (var i = 0; i < itemResponses.length; i++) {
    var itemResponse = itemResponses[i];
    var question = itemResponse.getItem().getTitle();
    var answer = itemResponse.getResponse();
    
    if (question == 'メールアドレス') {
      apply_mail = answer;
    }
    message += (i + 1).toString() + '. ' + question + ': ' + answer + '\n';
  }
  
  apply_name = itemResponses[0].getResponse();
  
  // manmaメンバー向けメール設定
  var manma_mail = "info.manma@gmail.com";
  var self_body  = "以下の内容でフォームが送信されました。\n\n" + message;
  var self_subject = "manma新規登録者あり";

  // 自動送信向けメール設定
  var subject = "【manma】家族留学へのご登録ありがとうございます";

  // 登録者向け本文
  var body = apply_name + " 様\n"
    + "\n"
    + "この度は、manmaへのご登録ありがとうございます。ご登録を確認いたしました！\n"
    + "\n"
    + "\n"
    + "今後ご登録いただいたメールアドレスに、不定期に家族留学をはじめとした各種イベントのご案内をお送りさせていただきます。\n"
    + "ご関心をもっていただけましたら、ぜひご参加いただけたら幸いです。\n"
    + "\n"
    + "【参考：家族留学のご紹介】\n"
    + "家族留学についてのご紹介になります。\n"
    + "下記リンクより、ご一読いただけましたら幸いです。\n"
    + "▷▷▷\n"
    + "https://drive.google.com/file/d/0BzVPbm9ozccTUWNBVGU0UE00MGM/view?usp=sharing \n"
    + "\n"
    + "また、家族留学の流れがわかる動画がこちらになります。\n"
    + "▷▷▷ https://youtu.be/2tzBK7F0gbw\n"
    + "\n"
    + "何かご不明な点がございましたら\n"
    + "info.manma@gmail.comまでご連絡ください。\n"
    + "\n"
    + "皆様とお話できます日を心よりお待ちしております。\n\n"
    + "manma\n";

  // manmaメンバー向け
  GmailApp.sendEmail(manma_mail, self_subject, self_body, { name: 'manmaシステム' });

  // 登録者向け
  GmailApp.sendEmail(apply_mail, subject, body, { name: 'manma' });
}