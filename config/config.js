module.exports = {
    server_port: 3000,
    db_url: 'mongodb://localhost:27017/local',
    jsonrpc_api_path : '/api',
    db_schemas: [
        {file:'./user_schema', collection:'hncUsers', schemaName:'UserSchema', modelName:'UserModel'},
        {file:'./post_schema', collection:'hncPosts', schemaName:'PostSchema', modelName:'PostModel'}
    ],
    route_info: [
        //===== post =====//
        {file:'./post', path:'/addpost', method:'addpost', type:'get'},
        {file:'./post', path:'/addpost/write', method:'write', type:'post'},
        {file:'./post', path:'/showpost/:id', method:'showpost', type:'get'},
        // ,{file:'./post', path:'/listpost', method:'listpost', type:'post'}
        {file:'./post', path:'/listpost', method:'listpost', type:'get'},
        {file:'./mypage', path:'/mypage', method:'mypage', type:'get'},
        //===== transaction History =====//
        {file:'./transactionHistory', path:'/transactionHistory/:id', method:'transactionHistory', type:'get'}
    ]
}