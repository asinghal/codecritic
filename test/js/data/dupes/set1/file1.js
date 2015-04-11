/* jslint node: true */
'use strict';

function aFunction(aVar, bVar) {
  var x = 15,
    y = 20,
    result = {};
  result.msg = 'some message here';
  result.sum = x + y;
  result.diff = x - y;
  result.mult = x * y;
  result.div = x / y;
  return result;
}
