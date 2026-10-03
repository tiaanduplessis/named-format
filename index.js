const assert = require('assert')

function namedformat (str = '', obj = {}) {
  assert(typeof str === 'string', 'named-format: Invalid string provided')
  assert(typeof obj === 'object', 'named-format: Invalid object provided')

  const keys = Object.keys(obj)

  return keys.reduce((acc, key) => {
    const value = obj[key]
    return acc.replace(`:${key}`, typeof value === 'string' ? () => value : value)
  }, str)
}

module.exports = namedformat
