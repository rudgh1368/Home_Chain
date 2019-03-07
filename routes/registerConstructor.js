var connection = require('../connection/connect');

var registerConstructor = function (req, res) {
    console.log("registerConstructor 접근");

    if(!req.user){
        console.log('사용자 인증 안된 상태임.');
        res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
        res.write('<script>alert("먼저 로그인해주세요.");' +
            'location.href="/login"</script>');
        res.end();
    } else{
        var context = {}
        console.log('사용자 인증된 상태임.');
        console.log('회원정보 로드.');
        console.dir(req.user);
        context.login_success = true;
        context.user = req.user;
        context.output = undefined;
        res.render('registerConstructor.ejs', context);
    }
}

var register = function (req, res) {
    console.log("registerConstructor/register 접근");
    var encryptionWallet = req.user.accountEncryption;
    var walletPassword = req.user.wallet_password;

    var buildingConstructor = req.body.buildingConstructor;
    var contractAddress = req.body.smartContractAddress;

    console.log("buildingConstructor : ", buildingConstructor);

    // 시행사인지 체크
    // smartcontract 가져오기

    //accountEncryption, password, contractAddress, buildingConstructor, callback
    connection.registerBuildingCostructor(encryptionWallet, walletPassword, contractAddress, buildingConstructor, function (result) {
        if(result) {
            res.render('registerConstructor.ejs', {output : "success"});
        }else{
            // error
        }
    });
}

module.exports.registerConstructor = registerConstructor;
module.exports.register = register;