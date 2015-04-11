/* jslint node: true */
'use strict';

function sumFunction(aVar, bVar) {
  var x = 15,
    y = 20,
    result = {};
  result.sum = x + y;
  result.diff = x - y;
  result.msg = 'a message here';
  return result;
}
