var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var contentSchema = new Schema({
    content: {
        type: ObjectId,
        ref: 'Content'
    },
    username: String,
    toname: {
        type: String,
        default: 'base'
    },
    email: String,
    tele: Number,
    txt: String,
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        }
    }
})


module.exports = contentSchema;