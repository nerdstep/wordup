import buble from 'rollup-plugin-buble';
import config from './rollup';

config.format = 'umd';
config.moduleName = 'WordUp';
config.dest = 'dist/wordup.js';
config.plugins.push(buble());

export default config;
