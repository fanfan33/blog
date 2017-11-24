var mongoose = require('mongoose');
var categorySchema = require('../schemas/categories');
var Cate = mongoose.model('Cate', categorySchema);
module.exports = Cate;