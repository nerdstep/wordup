import { rollup } from 'rollup';
import filesize from 'rollup-plugin-filesize';

const pkg = require('../package.json');
const external = Object.keys(pkg.dependencies);

export default {
  entry: 'src/index.js',
  banner: `/*! WordUp v${pkg.version}, @license ${pkg.license} */`,
  external: external,
  plugins: [
    filesize()
  ]
};
