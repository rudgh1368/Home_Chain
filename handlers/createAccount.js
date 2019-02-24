var connection = require('../connection/connect.js');

var createAccount = function (params, callaback) {
    console.log("JSON-RPC createAccount 호출");
    console.log(params[0].password);

    connection.createAccount(params[0].password, function (result) {
        // {address : address, privateKey : privateKey, accountEncryption : accountEncryption}
        callaback(null, result);
    })
};
module.exports = createAccount;