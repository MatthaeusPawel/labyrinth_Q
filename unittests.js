import { strict as assert } from 'assert';
//import { getRandomNumber } from './depthfirst.js';
import { distance2, getRandomNumber } from './generics.js';

describe('Random Integer', () => {
  it('low = 1, upp = 10', () => {
    assert.equal(getRandomNumber(1, 10, 0), 1);
    assert.equal(getRandomNumber(1, 10, 0.01), 1);
    assert.equal(getRandomNumber(1, 10, 0.999), 10);
    assert.equal(getRandomNumber(1, 10, 1), 10);
    assert.equal(getRandomNumber(1, 10, .5), 6);
  });
});


describe('distance2', () => {
  it('Singleton', () => {
    assert.equal(distance2([1], [2]), 1);
    assert.equal(distance2([-5], [6]), 121);
  });
  it('Two Elements', () => {
    assert.equal(distance2([0, 0], [2, 3]), 13);
    assert.equal(distance2([1, 1], [3, 4]), 13);
  });
  it('Wrong array sizes', () => {
    assert.throws(()=>{distance2([0], [1,2])}, TypeError('distance2 requires equally-sized arrays'));
  })
});