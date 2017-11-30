var mongoose = require('mongoose');
var VisitorSchema = require('../schemas/visitor');
var Visitor = mongoose.model('Visitor', VisitorSchema);

module.exports = Visitor;