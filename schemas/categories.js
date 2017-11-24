var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var categorySchema = new Schema({
    name: String,
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

categorySchema.pre('save', function(next) {
    if (this.isNew) {
        this.meta.updateAt = this.meta.createAt = Date.now()
    } else {
        this.meta.updateAt = Date.now();
    }
    next();
})
categorySchema.statics = {
    fetch: function(cb){
        return this
        .find({})
        .sort('meta.updateAt')
        .exec(cb)
    }
}

module.exports = categorySchema;