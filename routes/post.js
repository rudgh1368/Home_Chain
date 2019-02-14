// 게시판을 위한 라우팅 함수 정의

// showpost.ejs 에서 사용함
var Entites = require('html-entities').AllHtmlEntities;

var addpost = function (req, res) {
    console.log('post 모듈 안에 있는 addpost 호출됨.');

    if (!req.user) {
        console.log('post: 사용자 인증 안된 상태임.');
        res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
        res.write('<script>alert("먼저 로그인해주세요.");' +
            'location.href="/login"</script>');
        res.end();
    } else {
        var context = {};
        console.log('post: 사용자 인증된 상태임.');
        console.log('회원정보 로드.');
        console.dir(req.user);
        context.login_success = true;
        context.user = req.user;

        req.app.render('addpost', context, function (err, html) {

            if (err) {
                console.error('응답 웹문서 생성 중 에러 발생 : ' + err.stack);

                res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
                res.write('<script>alert("응답 웹문서 생성 중 에러 발생");' +
                    'location.href="/"</script>');
                res.end();
                return;
            } else res.end(html);

        });
    }

}

var write = function (req, res) {
    console.log('post 모듈 안에 있는 write 호출됨.');

    var paramWallet = req.user.wallet_address;
    var paramWriter = req.user.id;
    var paramTitle = req.body.title || req.query.title;
    var paramLocation = req.body.location || req.query.location;

    console.log('요청 파라미터 : ' + paramWallet + ', ' + paramWriter + ', '
        + paramTitle + ', ' + paramLocation);

    var database = req.app.get('database');

    // 데이터베이스 객체가 초기화 된 경우
    if (database.db) {
        // 1. 아이디를 이용해 사용자 검색
        database.UserModel.findById(paramWriter, function (err, results) {
            if (err) {
                console.error('게시판 글 추가 중 에러 발생 : ' + err.stack);

                res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
                res.write('<script>alert("게시판 글 추가 중 에러 발생");' +
                    'location.href="/addpost"</script>');
                res.end();

                return;
            }

            if (results == undefined || results.length < 1) {
                res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
                res.write('<script>alert("등록된 회원이 아닙니다.");' +
                    'location.href="/addpost"</script>');
                res.end();

                return;
            }

            var userObjectId = results[0]._doc._id;

            console.log('사용자 ObjectId : ' + paramWriter + ' -> ' + userObjectId);

            // save()로 저장
            // PostModel 인스턴스 생성
            var post = new database.PostModel({
                dev_wallet: paramWallet,
                writer: userObjectId,
                title: paramTitle,
                location: paramLocation
            });

            // user 스키마에 작성 글 정보 추가, 글 쓰는건 시행사기 때문에 1번이 됨
            results.save(function(err){

            })
            post.savePost(function (err, result) {
                if (err) {
                    if (err) {
                        console.error('응답 웹문서 생성 중 에러 발생 : ' + err.stack);

                        res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
                        res.write('<script>alert("응답 웹문서 생성 중 에러 발생");' +
                            'location.href="/addpost"</script>');
                        res.end();

                        return;
                    }
                }

                console.log("글 데이터 추가함.");
                console.log('글 작성', '게시글을 생성했습니다. : ' + post._id);

                return res.redirect('/listpost');
                // return res.redirect('/showpost/' + post._id);
            });
        });
    } else {
        res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
        res.write('<script>alert("데이터베이스 연결 실패");' +
            'location.href="/addpost"</script>');
        res.end();
    }

};

var listpost = function (req, res) {
    console.log('post 모듈 안에 있는 listpost 호출됨.');

    var paramPage = req.body.page || req.query.page;
    var paramPerPage = req.body.perPage || req.query.perPage;

    console.log('요청 파라미터 : ' + paramPage + ', ' + paramPerPage);

    var database = req.app.get('database');

    // 데이터베이스 객체가 초기화된 경우
    if (database.db) {
        // 1. 글 리스트
        var options = {
            page: paramPage,
            perPage: paramPerPage
        }

        database.PostModel.list(options, function (err, results) {
            if (err) {
                console.error('게시판 글 목록 조회 중 에러 발생 : ' + err.stack);

                res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
                res.write('<script>alert("게시판 글 목록 조회 중 에러 발생");' +
                    'location.href="/"</script>');
                res.end();

                return;
            }

            if (results) {
                console.dir(results);

                // 전체 문서 객체 수 확인
                database.PostModel.count().exec(function (err, count) {
                    // 뷰 템플레이트를 이용하여 렌더링한 후 전송=
                    var context = {
                        title: '글 목록',
                        posts: results,
                        page:  1, //parseInt(paramPage),
                        pageCount: 1, //Math.ceil(count / paramPerPage),
                        perPage: 10, //paramPerPage,
                        totalRecords: count,
                        size: paramPerPage
                    };
                    // var cp = context.posts;
                    // console.log("cp: " + cp);
                    // for (var i = 0; i < cp.size; i++){
                    //     var time = cp[i]._doc.created_at;
                    //     cp[i]._doc.created_at = time.substring(time.length - 20);
                    //     console.log(time);
                    // }
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

                    req.app.render('listpost', context, function (err, html) {

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

                });

            } else {
                res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
                res.write('<script>alert("글 목록 조회 실패" + err.stack);' +
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

};


var showpost = function (req, res) {
    console.log('post 모듈 안에 있는 showpost 호출됨.');

    // URL 파라미터로 전달됨
    var paramId = req.body.id || req.query.id || req.params.id;

    console.log('요청 파라미터 : ' + paramId);


    var database = req.app.get('database');

    // 데이터베이스 객체가 초기화된 경우
    if (database.db) {
        // 1. 글 리스트
        database.PostModel.load(paramId, function (err, results) {
            if (err) {
                console.error('게시판 글 조회 중 에러 발생 : ' + err.stack);

                res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
                res.write('<h2>게시판 글 조회 중 에러 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
                res.end();

                return;
            }

            if (results) {
                console.dir(results);

                res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});

                // 뷰 템플레이트를 이용하여 렌더링한 후 전송
                var context = {
                    title: '글 조회 ',
                    posts: results,
                    Entities: Entities
                };

                req.app.render('showpost', context, function (err, html) {
                    if (err) {
                        console.error('응답 웹문서 생성 중 에러 발생 : ' + err.stack);

                        res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
                        res.write('<h2>응답 웹문서 생성 중 에러 발생</h2>');
                        res.write('<p>' + err.stack + '</p>');
                        res.end();

                        return;
                    }

                    console.log('응답 웹문서 : ' + html);
                    res.end(html);
                });

            } else {
                res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
                res.write('<h2>글 조회  실패</h2>');
                res.end();
            }
        });
    } else {
        res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.end();
    }

};

module.exports.addpost = addpost;
module.exports.listpost = listpost;
module.exports.write = write;
module.exports.showpost = showpost;
