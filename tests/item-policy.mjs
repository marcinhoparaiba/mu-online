import test from 'node:test';
import assert from 'node:assert/strict';
import { itemAppearance, validateItemEdit } from '../item-policy.js';

test('item comum pode subir até +15 e voltar para +11; transparência começa em +12', () => {
  const common = { premium: false, level: 11 };
  assert.deepEqual(validateItemEdit(common, { level: 15 }), { ok: true, level: 15, appearance: 'transparent' });
  assert.deepEqual(validateItemEdit({ ...common, level: 15 }, { level: 11 }), { ok: true, level: 11, appearance: 'normal' });
  assert.equal(itemAppearance(0), 'normal');
  assert.equal(itemAppearance(11), 'normal');
  assert.equal(itemAppearance(12), 'transparent');
  assert.equal(itemAppearance(15), 'transparent');
});

test('limite não aceita números fracionados, strings ou níveis acima de +15', () => {
  for (const level of [-1, 16, 11.5, NaN, Infinity, '15', null, undefined]) {
    assert.equal(validateItemEdit({}, { level }).ok, false);
    assert.throws(() => itemAppearance(level), RangeError);
  }
});

test('custom exclusivo é bloqueado mesmo em nível baixo', () => {
  assert.equal(validateItemEdit({ exclusive: true, level: 0 }, { level: 1 }).ok, false);
  assert.equal(validateItemEdit({ premium: true, level: 15 }, { level: 11 }).ok, false);
  assert.equal(validateItemEdit(null, { level: 15 }).ok, false);
});
