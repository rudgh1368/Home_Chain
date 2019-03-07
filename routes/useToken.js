var connection = require('../connection/connect');

var useToken = function (req, res) {
    console.log("useToken 접근");

    res.render('useToken.ejs', {output : undefined});
}

var use = function (req, res) {
    console.log("useToken/use 접근");

    var toAddress = req.body.toAddress;
    var tokenAmount = req.body.tokenAmount;
    var content = req.body.content;

    console.log("to Address : ", toAddress);
    console.log("tokenAmount : ", tokenAmount);
    console.log("content : ", content);

    // toAddress가 은행 or 시행사인지 체크
    // smartcontract 가져오기

    //accountEncryption, password, contractAddress, toAddress, amount, content, callback
    connection.useToken("accountEncryption", "password", contractAddress, toAddress, tokenAmount, content, function (result) {
       if(result) {
           res.render('useToken.ejs', {output : "success"});
       }
    });



}

module.exports.useToken = useToken;
module.exports.use = use;