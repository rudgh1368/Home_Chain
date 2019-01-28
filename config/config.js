module.exports = {
    server_port: 3000,
    db_url: 'mongodb://localhost:27017/local',
    db_schemas: [
        {file:'./user_schema', collection:'hncUsers', schemaName:'UserSchema', modelName:'UserModel'},
        {file:'./post_schema', collection:'hncPosts', schemaName:'PostSchema', modelName:'PostModel'}
    ],
    route_info: [
        //===== basic =====//
        // {file:'./basic', path:'/', method:'index', type:'get'},

        //===== hyperlink =====//
        // {file:'./bridge', path:'/register', method:'register', type:'get'},
        // {file:'./bridge', path:'/login', method:'login', type:'get'},

        //===== login =====//
        // {file:'./user', path:'/process/login', method:'join', type:'post'},		// user.join
        // {file:'./user', path:'/process/register', method:'adduser', type:'post'},	// user.adduser
        // {file:'./user', path:'/listuser', method:'listuser', type:'post'}	   	// user.listuser

        //===== post =====//
        {file:'./post', path:'/addpost', method:'addpost', type:'get'},
        {file:'./post', path:'/addpost/write', method:'write', type:'post'},
        {file:'./post', path:'/showpost/:id', method:'showpost', type:'get'},
        // ,{file:'./post', path:'/listpost', method:'listpost', type:'post'}
        {file:'./post', path:'/listpost', method:'listpost', type:'get'}
    ]
}