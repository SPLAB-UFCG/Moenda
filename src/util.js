const fs = require('fs');
const os = require('os');


module.exports = {
  testIfIsFile: function (path) {
    const fileTest = fs.statSync(path);
    const result = fileTest.isFile();

    return result;
  },

  toStringGenerate: function (method) {
    const string =
      method.line +
      ':' +
      method.column +
      '     ' +
      method.status +
      '     ' +
      method.msg +
      '     ' +
      method.name;

    return string;
  },

  ignoresExtensions: function (path, extensionsArray) {
    let result = false;

    if (extensionsArray !== undefined) {
      const list = extensionsArray.split(',');
      for (let i = 0; i < list.length; i++) {
        if (String(path.split('.')[1]) === list[i]) {
          result = true;
          break;
        }
      }
    }

    return result;
  },

  directoryFiles: function (path, extensionsArray) {
    let result = [];

    const arrayFiles = fs.readdirSync(path);

    for (let i = 0; i < arrayFiles.length; i++) {
      if (this.testIfIsFile(`${path}/${arrayFiles[i]}`) === true) {
        if (
          this.ignoresExtensions(arrayFiles[i], extensionsArray) ===
          false
        ) {
          result [result.length] = arrayFiles[i];
        }
      }
    }

    return result;
  },

  exitAid: function (program, genericalRules, file) {
    let errors = 0;
    let infos = 0;
    const functions = Object.values(genericalRules).concat(Object.values(require("/home/felipe/fork/Moenda/src/rules/MDRules.js")));
    let returns = [];
    let string = '';
    const config = require(program.config);

    if (this.testIfIsFile(program.path)) {
      string += program.path + os.EOL;

      for (let j = 0; j < functions.length; j++) {
        if (functions[j](program.path, config).status === 'error') {
          returns.push(functions[j](program.path, config));
          errors++;
        }
        if (functions[j](program.path, config).status === 'info') {
          returns.push(functions[j](program.path, config));
          infos++;
        }
      }
    } else {
      string += `${program.path}/${file}` + os.EOL;

      for (let j = 0; j < functions.length; j++) {
        if (
          functions[j](`${program.path}/${file}`, config).status ===
          'error'
        ) {
          returns.push(functions[j](`${program.path}/${file}`, config));
          errors++;
        }
        if (
          functions[j](`${program.path}/${file}`, config).status ===
          'info'
        ) {
          returns.push(functions[j](`${program.path}/${file}`, config));
          infos++;
        }
      }
    }

    returns.sort(function (a, b) {
      if (a === '-' || b === '-') {
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

    for (let j = 0; j < returns.length; j++) {
      string += returns[j].toString + os.EOL;
    }

    string +=
      os.EOL + '* ' + errors + ` problem(s) (${errors} errors)` + os.EOL;
    string += '* ' + infos + ' info(s)' + os.EOL;

    console.log(string);
  },

};
