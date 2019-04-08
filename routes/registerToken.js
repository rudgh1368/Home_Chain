var formidable = require('formidable');
var fs = require('fs');
var connection = require('../connection/connect');
var registerBC = require('../modules/registerBC');

var registerToken = function (req, res) {
    console.log("registerToken 접근");

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
        res.render('registerToken.ejs', context);
    }
};
var register = function (req, res) {
    console.log("registerToken/register 접근");

    if(!req.user){
        console.log('사용자 인증 안된 상태임.');
        res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
        res.write('<script>alert("먼저 로그인해주세요.");' +
            'location.href="/login"</script>');
        res.end();
    } else {
        var context = {}
        console.log('사용자 인증된 상태임.');
        console.log('회원정보 로드.');
        console.dir(req.user);
        context.login_success = true;
        context.user = req.user;
        context.output = undefined;

        var encryptionWallet = req.user.accountEncryption;
        var walletPassword = req.user.wallet_password;

        var form = new formidable.IncomingForm();
        var uri = '/home/yang/WebstormProjects/graduate2/';

        form.uploadDir = uri;
        form.keepExtensions = true;
        form.parse(req, function (err, fields, files) {
            console.log("files", files.signedToken);
            console.log("name : ", files.signedToken.name);

            registerBC.readEncryptionFile(encryptionWallet, walletPassword, files.signedToken.name, files.signedToken.path, function (result) {

                // result == true 체크
                if (result == true) {
                    var name = files.signedToken.name.split("|");
                    var contractAddress = name[0];

                    var newPath = uri + contractAddress;
                    try {
                        fs.mkdirSync(newPath);
                        // fs.writeFileSync(uri + paramWallet + "/" + newPath , a, encoding='utf8')
                    } catch (err) {
                        if (err.code !== 'EEXIST') {
                            console.log("directory already exsist" + err);
                            // fs.writeFileSync(__dirname + '/zzzzzz/aa', a, encoding='utf8')
                        }
                    }

                    // 파일이름에 날짜 입력
                    var today = new Date();
                    var ss = today.getSeconds();
                    var dd = today.getDate();
                    var mm = today.getMonth() + 1;
                    var yyyy = today.getFullYear();

                    if (dd < 10) {
                        dd = '0' + dd
                    }

                    if (mm < 10) {
                        mm = '0' + mm
                    }

                    if (ss < 10) {
                        ss = '0' + ss
                    }


                    today = yyyy + '.' + mm + '.' + dd + "." + ss + ".";
                    var newName = today + files.signedToken.name;
                    fs.renameSync(files.signedToken.path, newPath + '/' + newName);
                    context.output="success";

                    res.render('registerToken.ejs', context);
                } else {
                    // error
                }
            });
        })
    }
};

module.exports.registerToken = registerToken;
module.exports.register = register;