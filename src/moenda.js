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
    let errors = 0;
    let infos = 0;
    const functions = Object.values(require(`${program.rules}`));

    string = program.path + os.EOL;
    
    let returns = [];

    for(let j = 0; j < functions.length; j++){
      if(functions[j](program.path, program.config).status === "error"){
        returns.push(functions[j](program.path, program.config).toString);
        errors++;
      }
      if(functions[j](program.path, program.config).status === "info"){
        returns.push(functions[j](program.path, program.config).toString);
        infos++;
      }
    }

    returns.sort(function (a, b) {
      if (a === "-" || b === "-"){
        return 0;
      }
      if (a.line > b.line) {
        return 1;
      }
      if (a.line < b.line) {
        return -1;
      }
      return 0;
    });

    for(let j = 0; j < returns.length; j++){
      string += returns[j] + os.EOL;

    }

  string += os.EOL + "* " + errors + ` problem(s) (${errors} errors)` + os.EOL;
  string += "* " + infos + " info(s)" + os.EOL;

  console.log(string);
  
  } else {
    let parameter = "";

    if (program.exclude){
      parameter += program.exclude;
    }

    const array = util.directoryFiles(program.path, parameter).data;
    
    for(let i = 0; i < array.length; i++){
      
      let errors = 0;
      let infos = 0;
      const functions = Object.values(require(`${program.rules}`));

      let returns = [];

      string = `${program.path}/${array[i]}`+ os.EOL;
      
      for(let j = 0; j < functions.length; j++){
        if(functions[j](`${program.path}/${array[i]}`, program.config).status === "error"){
          returns.push(functions[j](`${program.path}/${array[i]}`, program.config));
          errors++;
        }
        if(functions[j](`${program.path}/${array[i]}`, program.config).status === "info"){
          returns.push(functions[j](`${program.path}/${array[i]}`, program.config));
          infos++;
        }
      }

      returns.sort(function (a, b) {
        if (a === "-" || b === "-"){
          return 0;
        }
        if (a.line > b.line) {
          return 1;
        }
        if (a.line < b.line) {
          return -1;
        }
        return 0;
      });

      for(let j = 0; j < returns.length; j++){
        string += returns[j].toString + os.EOL;
      }

    string += os.EOL + "* " + errors + ` problem(s) (${errors} errors)` + os.EOL;
    string += "* " + infos + " info(s)" + os.EOL;

    console.log(string);
    }
  }
}

main();