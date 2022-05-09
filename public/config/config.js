///ENV
require('dotenv').config();
///Set environment
const Userdb = process.env.USER_DB;
const Userpa = process.env.USER_PASSWORD;
const data = process.env.DB;
var address = {
    connectionLimit : 10,
    host            : 'localhost',
    user            : Userdb,
    password        : Userpa,
    database        : data,
    debug : false
}

module.exports =  address;