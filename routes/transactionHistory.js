var transactionHistory = function (req, res){
    var context = {}

    if (!req.user) {
        console.log('post: 사용자 인증 안된 상태임.');
        context.login_success = false;
    } else {
        console.log('post: 사용자 인증된 상태임.');
        console.log('회원정보 로드.');
        console.dir(req.user);
        context.login_success = true;
        context.user = req.user;
    }
    
    req.app.render('transactionHistory', context, function (err, html){
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

module.exports.transactionHistory = transactionHistory;