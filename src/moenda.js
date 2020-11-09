const util = require("./util");
const os = require('os');
const { Command } = require('commander');
const program = new Command();
program.version('0.0.1');

program
  .option('-r, --rules <type>', 'Rules file')
  .option('-p, --path <type>', 'Archive for analysis')
  .option('-e, --exclude <type>', 'Exclude Extensions')
  .option('-c, --config <type>', 'Configurations');

program.parse(process.argv);

function main(){
  if (util.testIfIsFile(program.path).status === true){
    util.exitAid(program);
  } else {
    let parameter = "";

    if (program.exclude){
      parameter += program.exclude;
    }

    const array = util.directoryFiles(program.path, parameter).data;
    
    for(let i = 0; i < array.length; i++){
      util.exitAid(program, array[i]);
    }
  }
}

main();