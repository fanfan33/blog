var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var contentSchema = new Schema({
    cate: {
        type: ObjectId,
        ref: 'Cate'
    },
    title: String,
    desc: String,
    content: String,
    pv: {
        type: Number,
        default: 0
    },
    meta: {
        createAt: {
            type: Date,
            default1: Date.now()
        },
        updateAt: {
            type: Date,
            default1: Date.now()
        }
    }
})

contentSchema.pre('save', function(next) {
    if (this.isNew) {
        this.meta.updateAt = this.meta.createAt = Date.now()
    } else {
        this.meta.updateAt = Date.now();
    }
    next();
})

module.exports = contentSchema;