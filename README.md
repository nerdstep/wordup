# WordUp
[![npm version](https://img.shields.io/npm/v/wordup.svg?style=flat)](https://www.npmjs.com/package/wordup)
[![dependencies](https://img.shields.io/badge/dependencies-zero-blue.svg?style=flat)]()

> A zero dependency micro library for wrapping words with HTML tags.

### [DEMO](https://nerdstep.github.io/wordup/)

## Installation

Install from *npm*:

```bash
npm i wordup
```

## Basic Usage

```js
window.onload = () => {
  const context = document.querySelector('.content')
  const wu = new WordUp(context)

  wu.init()
}
```

## References

- https://github.com/julmot/mark.js

## License

Released under the [MIT license](https://opensource.org/licenses/MIT) by Justin Williams.