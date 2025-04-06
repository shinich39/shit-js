# shit-js

God breathe on me

## Getting Started

### Installation

- win

```console
git clone https://github.com/shinich39/create-ts-module.git new-ts-module && cd new-ts-module && rm -r -Force .git && npm install && cd ..
```

- mac

```console
git clone https://github.com/shinich39/create-ts-module.git new-ts-module && cd new-ts-module && rm -rf .git && npm install && cd ..
```

- npm

```console
npm install github:shinich39/create-ts-module
```

### Usage

- node

```js
import * as ts from "create-ts-module";
```

- browser

```html
<script src="./dist/index.js"></script>
<script>
  const { add, sub, mul, div, wait } = window.$;
</script>
```

## References

- [nodejs](https://nodejs.org/)
- [tsconfig](https://www.typescriptlang.org/tsconfig/)

## Acknowledgements

- [esbuild](https://esbuild.github.io/)
- [prettier](https://prettier.io/)
- [eslint](https://eslint.org/)
- [tsx](https://tsx.is/)