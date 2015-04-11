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
  if (x > 10 && x < 20 && x !== 11) {
    if (y > 15 && y < 25 && y !== 21) {
      if (result.sum > 10 && result.sum < 40 && result.sum !== 30) {
        if (result.diff > -10 && result.diff < 10 && result.diff !== 0) {
          if (result.mult > 100 && result.mult < 400 && result.mult !== 350) {
            if (result.div > 0 && result.div < 1 && result.div !== 1) {
              return true;
            }
          }
        }
      }
    }
  }
  return false;
}
