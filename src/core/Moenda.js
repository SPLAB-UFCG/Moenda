const fs = require('fs');
const path = require('path');
const Linter = require(path.resolve(__dirname, './Linter.js'));
const {createContext} = require(path.resolve(__dirname, './processor.js'));
const rules = require(path.resolve(__dirname, '../rules'));

class Moenda {
  constructor(config) {
    this.results = [];
    this.config = config;
    this.linter = new Linter(rules, createContext);
  }

  reporter(payload) {
    this.results.push(payload);
  }

  runRules() {
    const file = fs.readFileSync(
      path.resolve(__dirname, '../teste.md'),
      'utf-8',
    );
    this.linter.verify(file, this.reporter.bind(this));
    /*files.forEach(
            (file) => this.linter.verify(file, this.reporter)
        )*/
  }
}

module.exports = Moenda;
