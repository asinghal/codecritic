/* jslint node: true */
'use strict';

var levelup = require('levelup'),
    leveldown = require('leveldown'),
  dbName = process.env.NODE_ENV === 'test' ? ('./db/codecritic_test' + new Date().getTime()) : './db/codecritic';

// 1) Create our database, supply location and options.
//    This will create or open the underlying LevelDB store.
var db = levelup(leveldown(dbName, {
  valueEncoding: 'json'
}));

module.exports = {
  db: db
};
