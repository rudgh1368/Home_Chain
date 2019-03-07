var connection = require('../connection/connect');

var registerCostructor = function (req, res) {
    console.log("registerCostructor 접근");

    res.render('registerCostructor.ejs', {output : undefined});
}

var register = function (req, res) {
    console.log("registerCostructor/register 접근");

    var buildingConstructor = req.body.buildingConstructor;

    console.log("buildingConstructor : ", buildingConstructor);

    // 시행사인지 체크
    // smartcontract 가져오기

    //accountEncryption, password, contractAddress, buildingConstructor, callback
    connection.registerBuildingCostructor("accountEncryption", "password", 'contractAddress', buildingConstructor, function (result) {
        if(result) {
            res.render('registerCostructor.ejs', {output : "success"});
        }
    });
}

module.exports.registerCostructor = registerCostructor;
module.exports.register = register;