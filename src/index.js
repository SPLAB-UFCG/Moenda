const fs = require('fs');
const os = require('os');
const util = require('./util');

module.exports = {
  ruleLineCounter: function (link, rules) {
    let result = {
      line: '-',
      column: '-',
      status: 'info',
      msg: '',
      data: 0,
      toString: '',
      name: 'ruleLineCounter()',
    };

    if (util.testIfIsFile(link) === true) {
      const lines = fs.readFileSync(link, 'utf-8').split(os.EOL).length;
      result.msg = `The file has ${lines} line(s)`;
      result.data = lines;

      if (rules.ruleLineCounter?.limit !== undefined) {
        if (lines > rules.ruleLineCounter.limit) {
          result.status = 'error';
          result.line = rules.ruleLineCounter.limit + 1;
          result.msg = `This file is expected to have a maximum of ${rules.ruleLineCounter.limit} lines`;
        }
      }
    }

    result.toString = util.toStringGenerate(result);

    return result;
  },

  ruleLessThanXLines: function (link, rules) {
    let result = {
      line: '-',
      column: '-',
      status: '',
      msg: '',
      data: 0,
      toString: '',
      name: 'ruleLessThanXLines()',
    };

    if (util.testIfIsFile(link) === true) {
      const lines = fs.readFileSync(link, 'utf-8').split(os.EOL).length;
      result.msg = `The file has ${lines} line(s)`;
      result.data = lines;

      if (rules.ruleLessThanXLines?.limit !== undefined) {
        if (lines < rules.ruleLessThanXLines.limit) {
          result.status = 'error';
          result.line = lines;
          result.msg = `This file is expected to have a minimum of ${rules.ruleLessThanXLines.limit} lines`;
        }
      }
    }

    result.toString = util.toStringGenerate(result);

    return result;
  },

  ruleLineAboveXCharacters: function (link, rules) {
    const fileTest = fs.statSync(link, 'utf-8');
    let result = {
      status: false,
      data: '',
      msg: '',
      line: '-',
      column: '-',
      toString: '',
      name: '',
    };

    if (fileTest.isFile()) {
      if (rules.ruleLineAboveXCharacters?.limit !== undefined) {
        const file = fs.readFileSync(link, 'utf-8');
        const lines = file.split(os.EOL);
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].length > rules.ruleLineAboveXCharacters.limit) {
            result.status = 'error';
            result.line = i + 1;
            result.data = lines[i];
            result.column = rules.LineAboveXCharacters.limit + 1;
            result.msg = `This line must not exceed ${rules.ruleLineAboveXCharacters.limit} characters.`;
            result.name = 'ruleLineAboveXCharacters()';
            result.toString = util.toStringGenerate(result);
            return result;
          }
        }
      }
      result.toString = util.toStringGenerate(result);
    }
    return result;
  },

  ruleFirstSectionStartsWithHx: function (link, rules) {
    let result = {
      status: '',
      line: '-',
      column: '-',
      msg: '',
      data: '',
      toString: '',
      name: '',
    };

    if (util.testIfIsFile(link) === true && link.endsWith('.md')) {
      const file = fs.readFileSync(link, 'utf-8');
      const lines = file.split(os.EOL);
      let size = [];

      if (rules.ruleFirstSectionStartsWithHx?.limit !== undefined) {
        result = {
          status: 'error',
          line: '-',
          column: '-',
          msg: `The first section of the file does not start with H${rules.ruleFirstSectionStartsWithHx.limit}`,
          data: '',
          toString: '',
          name: '',
        };
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].startsWith('#')) {
            let aux = '';

            for (let j = 0; j < lines[i].length; j++) {
              if (lines[i][j] === '#') {
                aux += '#';
              }
            }
            size[size.length] = [i, aux.length];
            result.column = aux.length;
            result.data = aux;
            result.name = 'ruleFirstSectionStartsWithH1()';

            result.line = size[0][0] + 1;

            if (size[0][1] === rules.ruleFirstSectionStartsWithHx.limit) {
              result.status = false;
            }
            break;
          }
        }
      }
    }
    result.toString = util.toStringGenerate(result);

    return result;
  },

  ruleNeighboringSections: function (link, config) {
    let result = {
      status: false,
      line: '-',
      column: '-',
      msg: '',
      data: '',
      toString: '',
      name: '',
    };

    if (util.testIfIsFile(link) === true && link.endsWith('.md')) {
      const file = fs.readFileSync(link, 'utf-8');
      const lines = file.split(os.EOL);
      let sizes = [];

      for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('#')) {
          let aux = '';
          for (let j = 0; j < lines[i].length; j++) {
            if (lines[i][j] === '#') {
              aux += '#';
            }
          }
          sizes[sizes.length] = [i, aux.length];
        }
      }

      for (let i = 0; i < sizes.length - 1; i++) {
        if (
          sizes[i][1] !== sizes[i + 1][1] &&
          sizes[i][1] !== sizes[i + 1][1] - 1 &&
          sizes[i][1] !== sizes[i + 1][1] + 1
        ) {
          result.status = 'error';
          result.line = sizes[i][0] + 1;
          result.msg =
            'The file does not have increasing and decreasing sections';
          result.column = sizes[i][1];
          result.data = lines[sizes[i][0]];
          result.name = 'ruleNeighboringSections()';
        }
      }
    }

    result.toString = util.toStringGenerate(result);

    return result;
  },

  ruleInconsistencyOfSpaces: function (path, config) {
    let result = {
      status: false,
      line: '-',
      column: '-',
      msg: '',
      data: '',
      toString: '',
      name: 'ruleInconsistencyOfSpaces()',
    };

    if (util.testIfIsFile(path)) {
      const file = fs.readFileSync(path, 'utf-8');
      const lines = file.split(os.EOL);
      let sizes = [];

      for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith(String.fromCharCode(9))) {
          let aux = 0;
          for (let j = 0; j < lines[i].length; j++) {
            if (lines[i][j] === String.fromCharCode(9)) {
              aux++;
            } else {
              break;
            }
          }
          sizes[sizes.length] = [i, aux];
        }
      }

      for (let i = 0; i < sizes.length - 1; i++) {
        if (
          sizes[i][1] !== sizes[i + 1][1] &&
          sizes[i][1] !== sizes[i + 1][1] - 1 &&
          sizes[i][1] !== sizes[i + 1][1] + 1
        ) {
          result.status = 'error';
          result.line = sizes[i][0] + 2;
          result.msg =
            'The file does not have increasing and decreasing TAB spaces';
          result.column = sizes[i][1];
          result.data = lines[sizes[i][0]];
          break;
        }
      }
    }
    result.toString = util.toStringGenerate(result);

    return result;
  },

  ruleConsecutiveBlankLines: function (link, rules) {
    let result = {
      line: '-',
      column: '-',
      status: '',
      msg: '',
      data: 0,
      toString: '',
      name: 'ruleConsecutiveBlankLines()',
    };

    if (util.testIfIsFile(link) === true) {
      if (rules.ruleConsecutiveBlankLines?.limit !== undefined) {
        const lines = fs.readFileSync(link, 'utf-8').split(os.EOL);
        let cont = 0;

        for (let i = 0; i < lines.length; i++) {
          if (lines[i].trim() === '') {
            cont++;

            if (cont > rules.ruleConsecutiveBlankLines.limit) {
              result.status = 'error';
              result.line = i + 1;
              result.msg = `This file is expected to have a maximum of ${rules.ruleConsecutiveBlankLines.limit} consecutive blank lines`;
              break;
            }
          } else {
            cont = 0;
          }
        }
      }
    }

    result.toString = util.toStringGenerate(result);

    return result;
  },
};
