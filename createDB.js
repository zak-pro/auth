var mongoose = require('libs/mongoose');
mongoose.set('debug', true);
var async = require('async');


async.series([      //последовательный асинхронный вызов функций
        open,
        dropDatabase,
        requireModels,
        createAdmins
    ],
    function (err) {
        mongoose.disconnect();
        console.log(arguments);
    });

function open (callback) {
    mongoose.connection.on('open', callback);
    console.log("open+")
}

function dropDatabase(callback){
    var db = mongoose.connection.db;
    db.dropDatabase(callback);
    console.log("drop+")
}

/*function createAdmins(callback) {
    async.parallel([
        function(callback) {
            var dimon = new Admin({username: 'Димон', password: "qwe123" });
            dimon.save(function(err){
                callback(err, dimon);
            });
        },
        function(callback) {
            var serega = new Admin({username: 'Серега', password: "qwe123" });
            serega.save(function(err){
                callback(err, serega);
            });
        }
    ], callback);
    console.log("careate +");
}
*/
function requireModels(callback){
    require('models/admin').Admin;

    async.each(Object.keys(mongoose.models), function (modelName, callback) {
        mongoose.models[modelName].ensureIndexes(callback);
    }, callback);
}

function createAdmins(callback) {

    var admins = [
        {username: 'Димон', password: "qwe123" },
        {username: 'Серега', password: "qwe123" }
    ];

    async.each(admins, function (adminData, callback) {
        var admin = new mongoose.models.Admin(adminData);
        admin.save(callback);
    }, callback);
    console.log(admins);
}