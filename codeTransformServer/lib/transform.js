const fs = require('fs');
const path = require('path');
const babel = require('babel-core');
const http = require('http');

const babelConfig = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../../.babelrc')
  )
);

function transform(codeStr) {
  return babel.transform(codeStr, babelConfig).code;
}

module.exports = transform;
