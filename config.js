module.exports = {
    server_port: 3000,
    db_url: 'mongodb://localhost:27017/local',
    db_schemas: [
        {file:'./user_schema', collection:'hncUsers', schemaName:'UserSchema', modelName:'UserModel'}
    ],
    route_info: [
        //===== basic =====//
        {file:'./basic', path:'/', method:'index', type:'get'},

        //===== hyperlink =====//
        {file:'./bridge', path:'/register', method:'register', type:'get'},
        {file:'./bridge', path:'/login', method:'login', type:'get'},

        //===== function =====//
        {file:'./user', path:'/process/login', method:'join', type:'post'},		// user.join
        {file:'./user', path:'/process/register', method:'adduser', type:'post'},	// user.adduser
        {file:'./user', path:'/listuser', method:'listuser', type:'post'}	   	// user.listuser

    ]
}