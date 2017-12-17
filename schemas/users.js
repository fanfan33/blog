var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: String,
    password: String,
    isAdmin: {
        type: Boolean,
        default: false
    },
    createAt:{
        type: Date,
        default: Date.now()
    },
    lastLoginAt:{
        type: Date,
        default: Date.now()
    },
    justTime: Number,
    thisLoginAt: Date
})

module.exports = userSchema;