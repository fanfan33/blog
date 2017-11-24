var mongoose = require('mongoose');
var usersSchema = require('../schemas/users');
var Users = mongoose.model('Users', usersSchema);

module.exports = Users;