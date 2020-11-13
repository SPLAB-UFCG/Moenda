const fs = require('fs');
const os = require('os');

module.exports = {
  testIfIsFile: function (path) {
    let result = {status: false};
    const fileTest = fs.statSync(path);
    result.status = fileTest.isFile();

    if (result.status === true) {
      result.msg = 'the path passed corresponds to a file';
    }

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
    let result = {status: false};

    if (extensionsArray !== undefined) {
      const list = extensionsArray.split(',');
      for (let i = 0; i < list.length; i++) {
        if (String(path.split('.')[1]) === list[i]) {
          result.status = true;
          break;
        }
      }
    }

    return result;
  },

  directoryFiles: function (path, extensionsArray) {
    let result = {status: 'info', data: []};

    const arrayFiles = fs.readdirSync(path);

    for (let i = 0; i < arrayFiles.length; i++) {
      if (this.testIfIsFile(`${path}/${arrayFiles[i]}`).status === true) {
        if (
          this.ignoresExtensions(arrayFiles[i], extensionsArray).status ===
          false
        ) {
          result.data[result.data.length] = arrayFiles[i];
        }
      }
    }

    return result;
  },

  exitAid: function (program, file) {
    let errors = 0;
    let infos = 0;
    const functions = Object.values(require(`${program.rules}`));
    let returns = [];
    let string = '';

    if (this.testIfIsFile(program.path).status) {
      string += program.path + os.EOL;

      for (let j = 0; j < functions.length; j++) {
        if (functions[j](program.path, program.config).status === 'error') {
          returns.push(functions[j](program.path, program.config));
          errors++;
        }
        if (functions[j](program.path, program.config).status === 'info') {
          returns.push(functions[j](program.path, program.config));
          infos++;
        }
      }
    } else {
      string += `${program.path}/${file}` + os.EOL;

      for (let j = 0; j < functions.length; j++) {
        if (
          functions[j](`${program.path}/${file}`, program.config).status ===
          'error'
        ) {
          returns.push(functions[j](`${program.path}/${file}`, program.config));
          errors++;
        }
        if (
          functions[j](`${program.path}/${file}`, program.config).status ===
          'info'
        ) {
          returns.push(functions[j](`${program.path}/${file}`, program.config));
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
