const fs = require('fs');
const path = require('path');
const markdownInt = require('markdown-it');

const parsers = {
  md: markdownInt({ html: true}),
};

function normalizeConfig(options) {
  const keys = ['rulesConfig', 'files', 'parser', 'processor', 'rules'];
  // check if there's a better way
  const [missingProperty, _] = keys.filter(
    (key) => !options.hasOwnProperty(key),
  );
  return missingProperty;
}

function getOptions(options) {
  const {
    files: filesPath,
    parser,
    processor,
    rules,
    rulesConfig
  } = options;
  const files = filesPath.map((filePath) =>
    fs.readFileSync(filePath, 'utf-8'),
  );
  const missingProperty = normalizeConfig(options);
  if (missingProperty)
    throw `Missing property: ${CONFIG_FILENAME}\n`;

  return {
    files,
    rules,
    parser: parsers[parser],
    processor,
    rulesConfig,
  };
}

module.exports = {
  getOptions,
};