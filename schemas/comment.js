var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var CommentSchema = new Schema({
    content: { type: ObjectId, ref: 'Content'},
    from: String,
    to: String,
    reply: [{
        from: String,
        to: String,
        txt: String
    }],
    headIcon: {
        type: ObjectId,
        ref: 'Users'
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

module.exports = CommentSchema;