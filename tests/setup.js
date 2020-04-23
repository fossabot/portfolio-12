const mkdir = require('make-dir');
require('jest-matcher-one-of');

const { ARTIFACTS_PATH } = require('./utils.js');

// Make sure the artifacts directory exists
mkdir.sync(ARTIFACTS_PATH);
