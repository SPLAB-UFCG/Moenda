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
    rules: rulesPath,
  } = options;
  const filesPathList = Array.isArray(filesPath) ? filesPath : [filesPath];
  const files = filesPathList.map((filePath) => {
    console.log(filePath);
    return {
      path: filePath,
      content: fs.readFileSync(filePath, 'utf-8'),
    };
  });
  const rules = require(rulesPath);
  const enabledRules = rules.filter((rule) => !rule);

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
