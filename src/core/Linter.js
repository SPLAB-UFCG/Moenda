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

    this.rules.forEach((rule) => {
      rule.run(params, report);
    });
  }
}

module.exports = Linter;
