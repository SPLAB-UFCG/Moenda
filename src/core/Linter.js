const path = require('path')
const {parseCommentSuppression} = require(
  path.resolve(__dirname, '../utils/linterUtils.js')
);

class Linter {
  constructor(rules, processor, parser) {
    this.rules = rules;
    this.parser = parser;
    this.processor = processor;
  }

  verify(content, report, config) {
    const tokens = this.parser.parse(content);
    const context = this.processor(tokens);
    const params = {context, config};

    const disabledRules = parseCommentSuppression(tokens)
    const enabledRules = this.rules.filter(
      (rule) => !disabledRules.hasOwnProperty(rule.name)
    )
    console.log(enabledRules)

    enabledRules.forEach((rule) => {
      rule.run(params, report);
    });
  }
}

module.exports = Linter;
