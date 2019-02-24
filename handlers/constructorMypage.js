var constructorMypage = function (params, callback) {
    console.log("JSON-RPC constructorMypage 호출");
    console.log(params[0].password);

    var database = req.app.get('database');

    if (database.db){
        database.UserModel.findRole3(params[0].user.id, function(err, results_user) {
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
        })
    }
};

module.exports = constructorMypage;