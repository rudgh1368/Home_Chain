var mypage = function (req, res) {

    console.log('mypage 모듈 안에 있는 mypage 호출됨.');

    if (!req.user) {
        console.log('mypage: 사용자 인증 안된 상태임.');
        res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
        res.write('<script>alert("먼저 로그인해주세요.");' +
            'location.href="/login"</script>');
        res.end();
    } else {

        var context = {};

        console.log('mypage: 사용자 인증된 상태임.');
        console.log('회원정보 로드.');
        // console.dir(req.user);
        context.login_success = true;
        context.user = req.user;

        var database = req.app.get('database');

        if (database.db) {

            // 작성 글 가져오기 (시행사일 경우)
            database.UserModel.findOwn(req.user.id, function (err, results_user) {

                if (err) {
                    console.error('시행사 글 조회 중 에러 발생 : ' + err.stack);

                    res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
                    res.write('<script>alert("시행사 글 조회 중 에러 발생" + err.stack);' +
                        'location.href="/"</script>');
                    res.end();
                    return;
                }

                if (results_user) {
                    var titles = [];
                    console.dir(results_user.length);
                    if (results_user.length != 0) {
                        for (i = 0; i < results_user.length; i++) {
                            titles[i] = results_user[i].posts.title;
                        }

                        database.PostModel.forMypage(titles, function (err, results_post) {
                            if (err) {
                                console.error('시행사 글 조회 중 에러 발생 : ' + err.stack);

                                res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
                                res.write('<script>alert("시행사 글 조회 중 에러 발생" + err.stack);' +
                                    'location.href="/"</script>');
                                res.end();
                                return;
                            }

                            if (results_post) {
                                console.dir(results_post);
                                context.posts = results_post;
                                res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
                                req.app.render('mypage', context, function (err, html) {
                                    if (err) {
                                        console.error('응답 웹문서 생성 중 에러 발생 : ' + err.stack);

                                        res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
                                        res.write('<script>alert("응답 웹문서 생성 중 에러 발생" + err.stack);' +
                                            'location.href="/"</script>');
                                        res.end();
                                        return;
                                    }

                                    res.end(html);
                                });
                            } else {
                                res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
                                res.write('<script>alert("글 조회 실패" + err.stack);' +
                                    'location.href="/"</script>');
                                res.end();
                            }
                        });
                    } else {
                        context.posts = 0;
                        res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
                        req.app.render('mypage', context, function (err, html) {
                            if (err) {
                                console.error('응답 웹문서 생성 중 에러 발생 : ' + err.stack);

                                res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
                                res.write('<script>alert("응답 웹문서 생성 중 에러 발생" + err.stack);' +
                                    'location.href="/"</script>');
                                res.end();
                                return;
                            }

                            res.end(html);
                        });
                    }

                } else {
                    res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
                    res.write('<script>alert("글 조회 실패" + err.stack);' +
                        'location.href="/"</script>');
                    res.end();
                }
            });
        } else {
            res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
            res.write('<script>alert("데이터베이스 연결 실패" + err.stack);' +
                'location.href="/"</script>');
            res.end();
        }
    }

}

module.exports.mypage = mypage;