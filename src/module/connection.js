const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const conn = mongoose.createConnection("mongodb://127.0.0.1:27017/express-mongo", { useNewUrlParser: true });

mongoose.connection;
autoIncrement.initialize(conn);

exports.mongoose = mongoose;
exports.conn = conn;
exports.autoIncrement = autoIncrement;