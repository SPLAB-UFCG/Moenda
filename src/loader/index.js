const fs = require('fs');
const markdownInt = require('markdown-it');

const parsers = {
  md: markdownInt({html: true}),
};

function isMissingProperty(options) {
  const keys = ['rulesConfig', 'files', 'parser', 'processor', 'rules'];
  const [missingProperty, _] = keys.filter(
    (key) => !options.hasOwnProperty(key),
  );
  return missingProperty;
}

function translateOptions(options) {
  const missingProperty = isMissingProperty(options);
  if (missingProperty) {
    throw `Missing property: ${missingProperty}\n`;
  }

  const {
    files: filesPath,
    parser,
    processor,
    rulesConfig,
    rules,
  } = options;
  const filesPathList = Array.isArray(filesPath) ? filesPath : [filesPath];
  const files = filesPathList.map((filePath) => ({
    path: filePath,
    content: fs.readFileSync(filePath, 'utf-8'),
  }));
  const enabledRules = rules.filter((rule) => !!rule);

  return {
    files,
    parser: parsers[parser],
    processor,
    rules: enabledRules,
    rulesConfig,
  };
}

module.exports = {
  translateOptions,
};
