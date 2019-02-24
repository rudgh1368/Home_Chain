var constructorMypage = function (params, callaback) {
    console.log("JSON-RPC constructorMypage 호출");
    console.log(params[0].password);

    connection.createAccount(params[0].password, function (result) {
        callaback(null, result);
    })
};
module.exports = constructorMypage;