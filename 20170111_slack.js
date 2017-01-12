function slack_submitForm(e){
  var itemResponses = e.response.getItemResponses();
  var message = '';
  var mention = '';

  for (var i = 0; i < itemResponses.length; i++) {
    var itemResponse = itemResponses[i];
    var question = itemResponse.getItem().getTitle();
    var answer = itemResponse.getResponse();
    /*if (question == '事前説明会兼カウンセリング　希望日程'){
      var date = answer;
      if (date="その他")
        mention = "@iroha: さーん日程調整よろしくお願いしますー"
    }*/

    message += (i + 1).toString() + '. ' + question + ': ' + answer + '\n';
  }
  var token = 'XXXX';
  var slackApp = SlackApp.create(token); //SlackApp インスタンスの取得
  var slack_message = message

  var options = {
    channelId: "#contactsupport", //チャンネル名
    userName: "参加者登録【1回目】", //投稿するbotの名前
    message: slack_message //投稿するメッセージ
  };

  slackApp.postMessage(options.channelId, options.message, {username: options.userName});
}
