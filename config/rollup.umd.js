import babelrc from 'babelrc-rollup';
import babel from 'rollup-plugin-babel';
import config from './rollup';

config.format = 'umd';
config.moduleName = 'WordUp';
config.dest = 'dist/wordup.js';

// use babelrc-rollup to read a create a custom config for babel
// the default .babelrc config is for ava
config.plugins.push(babel(babelrc({
  path: '.babelrc.rollup'
})));

export default config;
