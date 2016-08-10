import { rollup } from 'rollup';
import filesize from 'rollup-plugin-filesize';
const pkg = require('../package.json');

export default {
  entry: 'src/index.js',
  banner: `/*! WordUp v${pkg.version}, @license ${pkg.license} */`,
  plugins: [
    filesize()
  ]
};
