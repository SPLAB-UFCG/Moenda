const path = require('path');

const {getOptions} = require(path.resolve(__dirname, '../loader'));
const Linter = require(path.resolve(__dirname, './Linter.js'));

class Moenda {
  constructor(options) {
    this.results = [];
    this.config = getOptions(options);
    this.linter = new Linter(
      this.config.rules,
      this.config.processor,
      this.config.parser
    );
  }

  reporter(payload) {
    console.log(payload)
    this.results.push(payload);
  }

  runRules() {
    const {files, rulesConfig} = this.config;
    const reporter = this.reporter.bind(this);
    files.forEach((file) => 
      this.linter.verify(file, reporter, rulesConfig)
    );
  }

  getResults(){
    return this.results;
  }
}

module.exports = Moenda;
