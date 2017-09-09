const assert = require('assert')

function namedformat (str = '', obj = {}) {
  assert(typeof str === 'string', 'named-format: Invalid string provided')
  assert(typeof obj === 'object', 'named-format: Invalid object provided')

  const keys = Object.keys(obj)

  return keys.reduce((acc, key) => acc.replace(`:${key}`, obj[key]), str)
}

module.exports = namedformat
