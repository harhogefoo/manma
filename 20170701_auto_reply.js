/*
 * 対象フォーム: https://docs.google.com/forms/d/1iHz5Bn-PiqWJAsRy9-7FQZ9P_Gg4v4i6Ub65MHiANKk/edit
 * @author shinocchi
 * @updated_at 20170701
 */
function submitForm(e) {
  var itemResponses = e.response.getItemResponses();
  // フォームの内容を保持する（manma宛に送信）
  var message = '';
  // 登録者の氏名
  var apply_name = '';
  // 登録者のメールアドレス
  var apply_mail = '';
  // 家族留学実施日
  var family_abroad_date = '';

  for (var i = 0; i < itemResponses.length; i++) {
    var itemResponse = itemResponses[i];
    var question = itemResponse.getItem().getTitle();
    var answer = itemResponse.getResponse();

    if (question == '氏名') {
      apply_name = answer;
    }
    if (question == 'メールアドレス') {
      apply_mail = answer;
    }
    if (question == '面談希望日時（場所：JR大塚駅付近）') {
      family_abroad_date = answer;
    }
    message += (i + 1).toString() + '. ' + question + ': ' + answer + '\n';
  }

  // manmaメンバー向けメール設定
  var manma_mail = "info.manma@gmail.com";
  var self_body = "以下の内容でフォームが送信されました。\n\n" + message;
  var self_subject = "家族留学参加申し込みあり";

  // 自動送信向けメール設定
  var subject = "【manma】家族留学参加申し込み受付完了のお知らせ";

  // 登録者向け本文
  var body = apply_name + " 様\n"
    + "\n"
    + "この度は、家族留学への参加申し込みをいただきありがとうございます。\n"
    + "\n"
    + "下記日程で、面談を実施させていただきます。\n"
    + "内容をご確認の上、ご参加をお待ちしております。\n"
    + "\n"
    + "・面談日時\n"
    + family_abroad_date + " \n"
    + "\n"
    + "・面談場所\n"
    + "▼対面\n"
    + "RYOZAN PARK 大塚\n"
    + "〒170-0005 東京都豊島区南大塚3-36-7 南大塚T&Tビル５F\n"
    + "※到着されましたら「507」の呼び鈴を鳴らしてください\n"
    + "▼オンライン\n"
    + "ご記入頂いたSkypeもしくはFacebookをオンラインにしてお待ち下さい\n"
    + "\n"
    + "・持ち物\n"
    + "参加費、身分証明書（初回参加の方のみ）\n"
    + "\n"
    + "・内容\n"
    + "①事前説明会（初回参加の方のみ）\n"
    + "②家族留学マッチング\n"
    + "※条件をお伺いし、面談日から３週間～２ヶ月の日程で家族留学を調整致します\n"
    + "\n"
    + "・参加費\n"
    + " 面談時に参加費をお支払いいただきます\n"
    + "\n"
    + "ご不明な点がございましたら\n"
    + "info@manma.co（久保）までお気軽にご連絡ください。\n"
    + "お会いできますことを、楽しみにしております。\n"
    + "manma\n";

  // manmaメンバー向け
  GmailApp.sendEmail(manma_mail, self_subject, self_body, {name: 'manmaシステム'});

  // 登録者向け
  GmailApp.sendEmail(apply_mail, subject, body, {name: 'manma'});
}
