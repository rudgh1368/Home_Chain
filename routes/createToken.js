var connection = require('../connection/connect');
var fs = require('fs');

var createToken = function (req, res) {
    console.log("createToken 접근");

    res.render('createToken.ejs', {output : undefined});
}

var create = function (req, res) {
    console.log("addToken/create 접근");
    console.log("to : ", req.body.to);
    console.log("investmentAmount : ", req.body.investmentAmount);
    console.log("smartContractAddress : ", req.body.smartContractAddress);
    console.log("investmentForm : ", req.body.investmentForm);

    var to = req.body.to;
    var investmentAmount = req.body.investmentAmount;
    var smartContractAddress = req.body.smartContractAddress;
    var investmentForm = req.body.investmentForm;

    if(to && investmentAmount && smartContractAddress && investmentForm) {
    console.log("정상입력");

    var message = smartContractAddress + "|" + to + "|" + investmentAmount + '|' + investmentForm + "|";

    // sign (contractaddress/to/index/investmentAmount) index -> 1 : 투자자, 2: 수분양자
    connection.signToken(message, function (signedToken) {
        var json = JSON.stringify(signedToken);
        var fileName = './' + message + '.json';

        fs.writeFileSync(fileName ,json, 'utf8');

        res.render('createToken.ejs', {output : "success"});
    });

    }else{
        console.log("입력요구");

        res.render('createToken.ejs', {output : "fail"});
    }
};

module.exports.createToken = createToken;
module.exports.create = create;