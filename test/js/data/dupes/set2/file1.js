/* jslint node: true */
'use strict';

function multFunction(aVar, bVar) {
  var x = 15,
    y = 20,
    result = {};
  result.msg = 'some message here';
  result.mult = x * y;
  result.div = x / y;
  return result;
}
