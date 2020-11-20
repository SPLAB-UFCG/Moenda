#!/usr/bin/env node

const util = require('../src/util');
const {Command} = require('commander');
const program = new Command();
const genericRules = require("../src/rules/genericRules");
program.version('0.0.1');

program
  .option('-r, --rules <type>', 'Rules file')
  .option('-p, --path <type>', 'Archive for analysis')
  .option('-e, --exclude <type>', 'Exclude Extensions')
  .option('-c, --config <type>', 'Configurations');

program.parse(process.argv);

function main() {
  if (util.testIfIsFile(program.path) === true) {
    util.exitAid(program, genericRules);
  } else {
    let parameter = '';

    if (program.exclude) {
      parameter += program.exclude;
    }

    const array = util.directoryFiles(program.path, parameter).data;

    for (let i = 0; i < array.length; i++) {
      util.exitAid(program, genericRules, array[i]);
    }
  }
}

main();
