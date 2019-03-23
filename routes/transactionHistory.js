var connect = require('../connection/connect');

var transactionHistory = function (req, res) {
    var context = {};

    if (!req.user) {
        console.log('post: 사용자 인증 안된 상태임.');
        res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
        res.write('<script>alert("먼저 로그인해주세요.");' +
            'location.href="/login"</script>');
        res.end();
    } else {
        console.log('post: 사용자 인증된 상태임.');
        console.log('회원정보 로드.');
        console.dir(req.user);
        context.login_success = true;
        context.user = req.user;

        var paramId = req.body.id || req.query.id || req.params.id;

        var database = req.app.get('database');

        // 데이터베이스 객체가 초기화된 경우
        if (database.db) {
            // 1. 글 리스트
            database.PostModel.load(paramId, function (err, results) {
                if (err) {
                    console.error('게시판 글 조회 중 에러 발생 : ' + err.stack);

                    res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
                    res.write('<script>alert("게시판 글 조회 중 에러 발생" + err.stack);' +
                        'location.href="/listpost"</script>');
                    res.end();
                    return;
                }
                if (results) {
                    var contractAddress = results.smart_addr;
                    var paramEncryptionWallet = req.user.accountEncryption;
                    var paramWalletPassword = req.user.wallet_password;

                    console.log("contractAddress : ", contractAddress);

                    var output = new Array();
                    connect.checkUseTokenAmount(paramEncryptionWallet, paramWalletPassword, contractAddress, function (transactionLength) {
                        var func = function () {
                            for (var i = 0; i < transactionLength; i++) {
                                var temp = {from: "", to: "", amount: "", content: ""};
                                connect.checkUseToken(paramEncryptionWallet, paramWalletPassword, contractAddress, i, function (transaction) {
                                    temp.from = transaction[0];
                                    temp.to = transaction[1];
                                    temp.amount = transaction[2];
                                    temp.content = transaction[3];
                                    output.push(temp);
                                });
                            }
                            return function (output) {
                                context.output = output;
                                console.log("output : ", output);
                                req.app.render('transactionHistory', context, function (err, html) {
                                    if (err) {
                                        console.error('응답 웹문서 생성 중 에러 발생 : ' + err.stack);

                                        res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
                                        res.write('<script>alert("응답 웹문서 생성 중 에러 발생" + err.stack);' +
                                            'location.href="/mypage"</script>');
                                        res.end();
                                        return;
                                    }
                                    res.end(html);
                                });
                            }
                        }
                        func();
                    });
                }
            });
        }
        ;
    }
    ;
};

module.exports.transactionHistory = transactionHistory;
