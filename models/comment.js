var mongoose = require('mongoose');
var Commentschema = require('../schemas/comment');
var Comment = mongoose.model('Comment', Commentschema);
module.exports = Comment;