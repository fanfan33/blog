var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VisitorSchema = new Schema({
    username: String,
    email: String,
    tele: Number,
    meat: {
        createAt:{
            type: Date,
            default: Date.now()
        }
    }
})
module.exports = VisitorSchema;