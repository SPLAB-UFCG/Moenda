const markdownInt = require('markdown-it');

class Linter {
  constructor(rules, processor) {
    this.rules = rules;
    this.parser = markdownInt({html: true});
    this.processor = processor;
  }

  verify(content, report) {
    const tokens = this.parser.parse(content);
    const context = this.processor(tokens);
    const structure = {
      h1: {p: 'required', h2: 'required'},
      h2: [{p: 'required', code: 'optional', h3: 'optional'}, {h3: 'required'}],
      h3: [
        {p: 'required', code: 'required'},
        {p: 'required', table: 'required'},
      ],
    };
    const params = {context, structure};
    this.rules.forEach((rule) => {
      rule.run(params, report);
    });
  }
}

module.exports = Linter;
