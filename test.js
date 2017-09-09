const namedFormat = require('./')

test('should be defined', () => {
  expect(namedFormat).toBeDefined()
})

test('should insert properties into string', () => {
  const str = ':prop1 and :prop2 is not :prop3'
  const obj = {
    prop1: 'foo',
    prop2: 'bar',
    prop3: 'baz'
  }
  const result = namedFormat(str, obj)

  expect(result.includes('foo')).toBe(true)
  expect(result.includes('bar')).toBe(true)
  expect(result.includes('baz')).toBe(true)
})
