var express = require('express');
var router = express.Router();

var async = require('async');
//var Client = require('../models/clients');
var Client = require('models/clients').Client;


var mongoose = require('libs/mongoose');
var db = mongoose.connection;


router.get('/test', function (req, res, next) {
   res.json({});
});

router.post('/api/download/:id', function (req, res, next) {

    var id = req.params.id;
    var userprogress = req.body.userclass;
    console.log("JSON from client " + userprogress + "\n");

    var jsonContent = JSON.parse(userprogress); // Парсинг JSON полученного от клиента
    console.log("Имя пользователя: " + id + "\n");

    async.waterfall([
        function (callback) {
            Client.findById({_id: id }, callback);
        },
        function (client, callback) {
            if (client){
                console.log("ПОЛЬЗОВАТЕЛЬ НАЙДЕН!");
                callback(null, client);
            }
            else {
                console.log("ПОЛЬЗОВАТЕЛЬ НЕ НАЙДЕН!");
                var client = new Client({_id: id
                    , playerName: jsonContent.playerName
                    , level: jsonContent.level
                    , experience: jsonContent.expirience
                    , mass: jsonContent.mass
                });
                client.save(function (err)
                {
                    if (err) return next(err);
                    console.log("New client was save");
                    //callback(null, client);
                });
            }
        }
    ], function (err, client) {
        if (err) return next(err);
        var _timeSpan = Date.now() - client.closetime;
        Client.findByIdAndUpdate(id, {$set:  {timeSpan: _timeSpan}}, {new: true}, function (err, client) {
            res.json(client);
            console.log("UPDATED");
        });
    });
});

router.post('/api/close/:id', function (req, res, next) {

    var id = req.params.id;
    var userprogress = req.body.userclass;
    console.log("JSON from client " + userprogress + "\n");

    var jsonContent = JSON.parse(userprogress); // Парсинг JSON полученного от клиента

    Client.findByIdAndUpdate(id, {$set:{playerName: jsonContent.playerName
            ,level: jsonContent.level
            ,experience: jsonContent.experience
            ,mass: jsonContent.mass
            ,closeTime: Date.now()}}
        ,{new: true}, function (err, client) {
            if (err) return next(err);
            console.log("UPDATED");
        });
});

router.post('/api/save/:id', function (req, res, next) {
    var id = req.params.id;
    var userprogress = req.body.userclass;

    console.log("JSON from client " + userprogress + "\n");

    var jsonContent = JSON.parse(userprogress); // Парсинг JSON полученного от клиента
    Client.findByIdAndUpdate(id, {$set:{playerName: jsonContent.playerName
            ,level: jsonContent.level
            ,experience: jsonContent.experience
            ,mass: jsonContent.mass }}
        ,{new: true}, function (err, client) {
            if (err) return next(err);
            console.log("UPDATED");
            res.send(200);
        });
});

module.exports = router;