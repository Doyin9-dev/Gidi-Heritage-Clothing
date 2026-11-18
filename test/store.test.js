import { test } from 'node:test';
import assert from 'node:assert/strict';
import { acceptsSize, filterProducts, formatPrice, searchProducts } from '../src/catalog.js';
import { MAX_QUANTITY, parseBag, summarizeBag, updateBag } from '../src/bag.js';

const tankIds = ['gh-tank-white', 'gh-tank-black'];
const teeIds = ['gh-ringer-white', 'gh-ringer-black'];

test('all four styles and colours have separate listings priced at ₦20,000 each', () => {
  const products = filterProducts('all');
  assert.deepEqual(products.map(({ id }) => id), [...tankIds, ...teeIds]);
  assert.equal(new Set(products.map(({ name }) => name)).size, 4);
  assert.deepEqual(products.map(({ price }) => price), [20000, 20000, 20000, 20000]);
  assert.equal(formatPrice(20000), '₦20,000');
});

test('collection filters show both colourways for the selected style', () => {
  const ids = (type) => filterProducts(type).map(({ id }) => id);
  assert.deepEqual(ids('tank-tops'), tankIds);
  assert.deepEqual(ids('t-shirts'), teeIds);
});

test('search matches styles and primary colours without confusing the trim colour', () => {
  assert.deepEqual(searchProducts('   black TÉE ').map(({ id }) => id), ['gh-ringer-black']);
  assert.deepEqual(searchProducts('white vest').map(({ id }) => id), ['gh-tank-white']);
  assert.deepEqual(searchProducts('t-shirt').map(({ id }) => id), teeIds);
  assert.deepEqual(searchProducts('linen jacket'), []);
});

test('the bag keeps each listing separate even when no sizes have been published', () => {
  let bag = updateBag([], 'gh-tank-black', null, 1);
  bag = updateBag(bag, 'gh-tank-black', null, 1);
  bag = updateBag(bag, 'gh-tank-white', null, 1);
  assert.deepEqual(bag.map(({ size, quantity }) => [size, quantity]), [[null, 2], [null, 1]]);
  assert.deepEqual(summarizeBag(bag), { count: 3, subtotal: 60000 });
  assert.deepEqual(updateBag(bag, 'gh-tank-white', null, -1), [bag[0]]);
  assert.deepEqual(updateBag(bag, 'gh-ringer-white', 'M', 1), bag);
  assert.equal(acceptsSize({ sizes: ['S', 'M'] }, 'M'), true);
  assert.equal(acceptsSize({ sizes: ['S', 'M'] }, null), false);
});

test('stored bags ignore outdated or invalid entries and cap quantities', () => {
  assert.deepEqual(parseBag('broken JSON'), []);
  assert.deepEqual(parseBag('{"quantity":1}'), []);
  assert.deepEqual(parseBag(JSON.stringify([
    null,
    { id: 'adire-jacket', size: 'S', quantity: 1 },
    { id: 'gh-tank-white', size: 'L', quantity: 1 },
    { id: 'gh-tank-white', size: null, quantity: -1 },
    { id: 'gh-tank-white', size: null, quantity: 1 },
    { id: 'gh-tank-white', size: null, quantity: 99 },
  ])), [{ id: 'gh-tank-white', size: null, quantity: MAX_QUANTITY }]);
});
