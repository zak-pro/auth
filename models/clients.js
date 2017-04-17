var mongoose = require('libs/mongoose');

var Schema = mongoose.Schema;


//Схема пользователя, описывающая документ в БД с игровым прогрессом

var schema = new Schema({
    _id: String,

    playerName: String,

    level: String,

    experience: String,

    mass: Array,

    timeSpan: String,

    closeTime:{
        type: Date,
        default : Date.now
    },

    created:{
        type: Date,
        default : Date.now
    }
});

exports.Client = mongoose.model('Client', schema);