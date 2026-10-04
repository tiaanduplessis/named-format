
<h1 align="center">named-format</h1>
<div align="center">
  <strong>Like util.format, but uses object props</strong>
</div>
<br>
<div align="center">
  <a href="https://npmjs.org/package/named-format">
    <img src="https://img.shields.io/npm/v/named-format.svg?style=flat-square" alt="npm package version" />
  </a>
  <a href="https://npmjs.org/package/named-format">
  <img src="https://img.shields.io/npm/dm/named-format.svg?style=flat-square" alt="npm downloads" />
  </a>
  <a href="https://travis-ci.org/tiaanduplessis/named-format">
    <img src="https://img.shields.io/travis/tiaanduplessis/named-format.svg?style=flat-square" alt="travis ci build status" />
  </a>
  <a href="https://github.com/tiaanduplessis/named-format/blob/master/LICENSE">
    <img src="https://img.shields.io/npm/l/named-format.svg?style=flat-square" alt="project license" />
  </a>
  <a href="http://makeapullrequest.com">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square" alt="make a pull request" />
  </a>
</div>
<br>
<div align="center">
  <a href="https://github.com/tiaanduplessis/named-format/watchers">
    <img src="https://img.shields.io/github/watchers/tiaanduplessis/named-format.svg?style=social" alt="Github Watch Badge" />
  </a>
  <a href="https://github.com/tiaanduplessis/named-format/stargazers">
    <img src="https://img.shields.io/github/stars/tiaanduplessis/named-format.svg?style=social" alt="Github Star Badge" />
  </a>
  <a href="https://twitter.com/intent/tweet?text=Check%20out%20named-format!%20https://github.com/tiaanduplessis/named-format%20%F0%9F%91%8D">
    <img src="https://img.shields.io/twitter/url/https/github.com/tiaanduplessis/named-format.svg?style=social" alt="Tweet" />
  </a>
</div>
<br>
<div align="center">
  Built with ❤︎ by <a href="https://github.com/tiaanduplessis">tiaanduplessis</a> and <a href="https://github.com/tiaanduplessis/named-format/contributors">contributors</a>
</div>

<h2>Table of Contents</h2>
<details>
  <summary>Table of Contents</summary>
  <li><a href="#install">Install</a></li>
  <li><a href="#usage">Usage</a></li>
  <li><a href="#contribute">Contribute</a></li>
  <li><a href="#license">License</a></li>
</details>

## Install

[![Greenkeeper badge](https://badges.greenkeeper.io/tiaanduplessis/named-format.svg)](https://greenkeeper.io/)

```sh
$ npm install named-format
# OR
$ yarn add named-format
```

## Usage

```js
const namedFormat = require('named-format')

console.log(namedformat('My name is :name', { name: 'Tiaan' }))
// My name is Tiaan
```

Primitive string values are inserted literally, including dollar signs such as
`$$` and `$&`:

```js
namedFormat('Value: :value', { value: '$&' })
// Value: $&
```

Each key replaces its first matching placeholder, in object key order. A value
containing another key's placeholder can still be replaced when that key is
processed later.

## Contributing

Contributions are welcome!

### Development checks

Use Node.js 22.13 or newer in the 22.x line, or Node.js 24 or newer, with
Yarn Classic 1.22.22 for development:

```sh
yarn install --frozen-lockfile --ignore-scripts --ignore-optional
npm test
```

`npm test` runs a nonmutating lint check followed by the 32 synchronous tests.
`npm run lint` checks code without changing it; `npm run format` explicitly
applies automatic style fixes. Git hooks are not installed automatically, so
run `npm test` before committing.

The test suite uses Node.js's built-in `assert` module and can also run without
installing development dependencies:

```sh
node test.js
```

The newer Node.js requirement applies to development lint tooling only. The
published CommonJS runtime and its dependencies are unchanged. Compatibility
checks include the standalone tests against source and packed files on Node.js
6, 8, 16, 20, 22 and 24; this is not a new minimum supported-version promise.

1. Fork it.
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

Or open up [a issue](https://github.com/tiaanduplessis/named-format/issues).

## License

Licensed under the MIT License.
