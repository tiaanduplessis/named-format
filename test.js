const assert = require('assert')
const namedFormat = require('./')
let passed = 0
let failed = 0

// These tests are deliberately synchronous so they also run on older Node.js.
function test (name, run) {
  try {
    const result = run()
    assert(!(result && typeof result.then === 'function'), 'Tests must be synchronous')
    passed++
    console.log('ok - ' + name)
  } catch (error) {
    failed++
    process.exitCode = 1
    console.error('not ok - ' + name)
    console.error(error.stack || error)
  }
}

test('should be defined', () => {
  assert.notStrictEqual(namedFormat, undefined)
})

test('should insert properties into string', () => {
  const str = ':prop1 and :prop2 is not :prop3'
  const obj = {
    prop1: 'foo',
    prop2: 'bar',
    prop3: 'baz'
  }
  const result = namedFormat(str, obj)

  assert.strictEqual(result.includes('foo'), true)
  assert.strictEqual(result.includes('bar'), true)
  assert.strictEqual(result.includes('baz'), true)
})

;['$$', '$&', '$`', "$'", "$$ $& $` $'"].forEach(value => {
  ;[':value', 'before :value', ':value after', 'before :value after'].forEach(str => {
    test(`should insert the primitive string ${JSON.stringify(value)} literally into ${JSON.stringify(str)}`, () => {
      const parts = str.split(':value')
      assert.strictEqual(namedFormat(str, { value }), parts[0] + value + parts[1])
    })
  })
})

test('should insert empty and Unicode primitive strings', () => {
  assert.strictEqual(namedFormat('a :empty :unicode z', { empty: '', unicode: '💵 café $&' }), 'a  💵 café $& z')
})

test('should replace only the first occurrence for each key', () => {
  assert.strictEqual(namedFormat(':value :value', { value: '$&' }), '$& :value')
  assert.strictEqual(namedFormat(':first :second :first', { first: '$$', second: "$'" }), "$$ $' :first")
})

test('should treat keys containing regular expression characters literally', () => {
  const key = 'a.*+?^${}()|[]\\'
  assert.strictEqual(namedFormat(`:${key} :${key}`, { [key]: '$&' }), `$& :${key}`)
  assert.strictEqual(namedFormat(':aX :a.', { 'a.': '$$' }), ':aX $$')
})

test('should retain key order, prefix matching and cascading replacements', () => {
  assert.strictEqual(namedFormat(':long :l', { l: '$$', long: 'unused' }), '$$ong :l')
  assert.strictEqual(namedFormat(':first', { first: ':second', second: '$&' }), '$&')
  assert.strictEqual(namedFormat(':first', { second: '$&', first: ':second' }), ':second')
  assert.strictEqual(namedFormat(':self :self', { self: ':self $&' }), ':self $& :self')
  assert.strictEqual(namedFormat(': :x', { '': '$$' }), '$$ :x')
})

test('should read each property once, including unmatched properties', () => {
  const calls = []
  const obj = {
    get matched () {
      calls.push('matched')
      return '$&'
    },
    get absent () {
      calls.push('absent')
      return '$$'
    }
  }
  assert.strictEqual(namedFormat(':matched :matched', obj), '$& :matched')
  assert.deepStrictEqual(calls, ['matched', 'absent'])
})

test('should retain function replacement arguments, return conversion and strict receiver', () => {
  let calls = 0
  const obj = {
    value: function () {
      'use strict'
      calls++
      assert.strictEqual(this, undefined)
      assert.deepStrictEqual(Array.prototype.slice.call(arguments), [':value', 2, 'a :value b'])
      return { toString: () => '$&' }
    }
  }
  assert.strictEqual(namedFormat('a :value b', obj), 'a $& b')
  assert.strictEqual(namedFormat('unmatched', obj), 'unmatched')
  assert.strictEqual(calls, 1)
  assert.strictEqual(namedFormat(':value', { value: () => undefined }), 'undefined')
})

test('should preserve conversion of non-string primitive values', () => {
  ;[0, 12, false, true, null, undefined, NaN].forEach(value => {
    assert.strictEqual(namedFormat('a :value b', { value }), 'a ' + String(value) + ' b')
  })
})

test('should retain replacement-template semantics for boxed strings and other objects', () => {
  const value = Object('$&')
  assert.strictEqual(namedFormat('a :value b', { value }), 'a :value b')
  let calls = 0
  const obj = { value: { toString: () => { calls++; return '$$' } } }
  assert.strictEqual(namedFormat(':value', obj), '$')
  assert.strictEqual(calls, 1)
  'unmatched'.replace(':value', obj.value)
  const expectedCalls = calls
  calls = 1
  assert.strictEqual(namedFormat('unmatched', obj), 'unmatched')
  assert.strictEqual(calls, expectedCalls)
})

test('should preserve getter, conversion and callback errors', () => {
  const error = new Error('replacement error')
  const throwsSameError = fn => assert.throws(fn, caught => caught === error)
  throwsSameError(() => namedFormat(':value', { get value () { throw error } }))
  throwsSameError(() => namedFormat('unmatched', { get value () { throw error } }))
  throwsSameError(() => namedFormat(':value', { value: { toString: () => { throw error } } }))
  const outcome = fn => {
    try { return { value: fn() } } catch (error) { return { error } }
  }
  const value = { toString: () => { throw error } }
  assert.deepStrictEqual(outcome(() => namedFormat('unmatched', { value })), outcome(() => 'unmatched'.replace(':value', value)))
  throwsSameError(() => namedFormat(':value', { value: () => { throw error } }))
  assert.throws(() => namedFormat(':value', { value: Symbol('value') }), TypeError)
  const symbolOutcome = fn => {
    try { return fn() } catch (error) { return error.name }
  }
  const symbol = Symbol('value')
  assert.strictEqual(symbolOutcome(() => namedFormat('unmatched', { value: symbol })), symbolOutcome(() => 'unmatched'.replace(':value', symbol)))
  assert.throws(() => namedFormat(':value', { value: () => Symbol('value') }), TypeError)
})

test('should preserve default arguments, validation and own-key behavior', () => {
  assert.strictEqual(namedFormat(), '')
  assert.strictEqual(namedFormat(':missing'), ':missing')
  assert.throws(() => namedFormat(1), /Invalid string provided/)
  assert.throws(() => namedFormat('', 1), /Invalid object provided/)
  assert.throws(() => namedFormat('', null), TypeError)
  const obj = Object.freeze(Object.assign(Object.create({ inherited: '$$' }), { own: '$&' }))
  assert.strictEqual(namedFormat(':inherited :own :missing', obj), ':inherited $& :missing')
  assert.strictEqual(obj.own, '$&')
})

console.log(passed + ' passed, ' + failed + ' failed')
