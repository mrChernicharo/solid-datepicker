# publishing SolidJS package to npm

1 - clone `solid-community/solid-lib-starter`

```
git clone https://github.com/solidjs-community/solid-lib-starter.git
```

2 - replace the contents inside the src folder with your code

3 - make sure to create an `index.tsx` file inside src. Use it file to export your lib's components

```
// src/index.tsx

export { DatePicker } from './DatePicker';
export { MyComponent } from './MyComponent';
// etc...
```

4 - make sure that your package.json looks more or less like this

```
{
  "version": "0.1.10",
  "name": "{{ package name }}",
  "description": "{{ package description }}",
  "type": "module",
  "files": [
    "dist"
  ],
  "main": "dist/esm/index.js",
  "module": "dist/esm/index.js",
  "types": "dist/types/index.d.ts",
  "exports": {
    ".": {
      "solid": "./dist/source/index.jsx",
      "import": "./dist/esm/index.js",
      "browser": "./dist/esm/index.js",
      "require": "./dist/cjs/index.js",
      "node": "./dist/cjs/index.js"
    }
  },
  "scripts": {
    "build": "rollup -c",
    "prepublishOnly": "pnpm build"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/{{ git repository }}.git"
  },
  "keywords": [],
  "author": "{{ author name }}",
  "license": "MIT",
  "homepage": "https://github.com/{{ git repository }}#readme",

  "dependencies": {
    "solid-js": "^1.1.7",
    "solid-styled-components": "^0.28.4",
    "solid-transition-group": "^0.0.10"
  },
  "devDependencies": {
    "rollup": "^2.58.0",
    "rollup-preset-solid": "^1.0.1",
    "typescript": "^4.4.4"
  }
}

```

5 - run `pnpm i` to install everything

6 - make sure to have a `rollup.config.js` file at the root level

```
import withSolid from 'rollup-preset-solid';

export default withSolid({
  input: "src/index.tsx",
  targets: ["esm", "cjs"],
  printInstructions: true,
});

```

OBS: printInstructions: true will give you a hint on what the paths in your package.json should look like

7 - setup tsconfig.json at the root level

```
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "commonjs",
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "declaration": true,
    "moduleResolution": "node",
    "declarationDir": "./types",
    "emitDeclarationOnly": true,
    "strict": true,
    "jsx": "preserve",
    "resolveJsonModule": true,
    "noImplicitAny": false
  },
  "include": ["src"],
  "exclude": ["node_modules", "**/__tests__/*"]
}

```

8 - Don't forget to add a README.md file

9 - run `pnpm build`.
This should have your dist folder created with four folders inside

- cjs
- esm
- source
- types

10 - run `npm publish --access=public` to have your package published to npm registry
