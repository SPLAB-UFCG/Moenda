const path = require('path');
const {translateOptions} = require(path.resolve(__dirname, '../loader'));
const {parseCommentSuppression} = require(path.resolve(
  __dirname,
  '../utils/parserUtils.js',
));

class Moenda {
  constructor(options) {
    this.results = [];
    this.config = translateOptions(options);
  }

  reporter(ruleName, filePath) {
    return (payload) => {
      this.results.push({
        ruleName,
        filePath,
        column: 0,
        ...payload,
      });
    };
  }

  verify(file, report, config) {
    const tokens = this.config.parser.parse(file.content);
    const context = this.config.processor(tokens);
    const params = {context, config};

    const disabledRules = parseCommentSuppression(tokens);
    const enabledRules = this.config.rules.filter(
      (rule) => !disabledRules.hasOwnProperty(rule.name),
    );

    enabledRules.forEach((rule) => {
      rule.run(params, report(rule.name, file.path));
    });
  }

  runRules() {
    const {files, rulesConfig} = this.config;
    const reporter = this.reporter.bind(this);
    files.forEach((file) => this.verify(file, reporter, rulesConfig));
  }


  getResults() {
    return this.results;
  }
}

module.exports = Moenda;
