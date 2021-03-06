const path = require('path');
const {translateOptions} = require(path.resolve(__dirname, '../loader'));
const {parseCommentSuppression} = require(path.resolve(
  __dirname,
  '../utils/parserUtils.js',
));

class Moenda {
  constructor(options) {
    this.results = {};
    this.config = translateOptions(options);
  }

  reporter(ruleName, filePath) {
    this.results[filePath] = [];
    return (payload) => {
      this.results[filePath].push({
        ruleName,
        column: 0,
        ...payload,
      });
    };
  }

  verify(file) {
    const tokens = this.config.parser.parse(file.content);
    const context = this.config.processor(tokens);
    const reporter = this.reporter.bind(this);
    const {rulesConfig} = this.config;

    const disabledRules = parseCommentSuppression(tokens, rulesConfig.comment);
    const enabledRules = this.config.rules.filter(
      (rule) => !disabledRules.hasOwnProperty(rule.name),
    );

    enabledRules.forEach((rule) => {
      rule.run(
        {context, config: rulesConfig[rule.name]},
        reporter(rule.name, file.path),
      );
    });
  }

  runRules() {
    const {files} = this.config;
    files.forEach((file) => this.verify(file));
  }

  getResults() {
    return this.results;
  }
}

module.exports = Moenda;
