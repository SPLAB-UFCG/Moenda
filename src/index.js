const fs = require('fs');
const os = require('os');
const util = require(path.resolve(__dirname, './util.js'));
const Moenda = require(path.resolve(__dirname, './core/Moenda.js'));

module.exports = {
  Moenda,
  lineCounter: function (link, rules) {
    let result = {
      line: '-',
      column: '-',
      status: 'info',
      msg: '',
      data: 0,
      toString: '',
      name: 'lineCounter()',
    };

    if (util.testIfIsFile(link).status === true) {
      const lines = fs.readFileSync(link, 'utf-8').split(os.EOL).length;
      result.msg = `The file has ${lines} line(s)`;
      result.data = lines;

      if (rules.lineCounter?.limit !== undefined) {
        if (lines > rules.lineCounter.limit) {
          result.status = 'error';
          result.line = rules.lineCounter.limit + 1;
          result.msg = `This file is expected to have a maximum of ${rules.lineCounter.limit} lines`;
        }
      }
    }

    result.toString = util.toStringGenerate(result);

    return result;
  },

  LessThanXLines: function (link, rules) {
    let result = {
      line: '-',
      column: '-',
      status: '',
      msg: '',
      data: 0,
      toString: '',
      name: 'LessThanXLines()',
    };

    if (util.testIfIsFile(link).status === true) {
      const lines = fs.readFileSync(link, 'utf-8').split(os.EOL).length;
      result.msg = `The file has ${lines} line(s)`;
      result.data = lines;

      if (rules.LessThanXLines?.limit !== undefined) {
        if (lines < rules.LessThanXLines.limit) {
          result.status = 'error';
          result.line = lines;
          result.msg = `This file is expected to have a minimum of ${rules.LessThanXLines.limit} lines`;
        }
      }
    }

    result.toString = util.toStringGenerate(result);

    return result;
  },

  LineAboveXCharacters: function (link, rules) {
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
      if (rules.LineAboveXCharacters?.limit !== undefined) {
        const file = fs.readFileSync(link, 'utf-8');
        const lines = file.split(os.EOL);
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].length > rules.LineAboveXCharacters.limit) {
            result.status = 'error';
            result.line = i + 1;
            result.data = lines[i];
            result.column = rules.LineAboveXCharacters.limit + 1;
            result.msg = `This line must not exceed ${rules.LineAboveXCharacters.limit} characters.`;
            result.name = 'LineAboveXCharacters()';
            result.toString = util.toStringGenerate(result);
            return result;
          }
        }
      }
      result.toString = util.toStringGenerate(result);
    }
    return result;
  },

  firstSectionStartsWithHx: function (link, rules) {
    let result = {
      status: '',
      line: '-',
      column: '-',
      msg: '',
      data: '',
      toString: '',
      name: '',
    };

    if (util.testIfIsFile(link).status === true && link.endsWith('.md')) {
      const file = fs.readFileSync(link, 'utf-8');
      const lines = file.split(os.EOL);
      let size = [];

      if (rules.firstSectionStartsWithHx?.limit !== undefined) {
        result = {
          status: 'error',
          line: '-',
          column: '-',
          msg: `The first section of the file does not start with H${rules.firstSectionStartsWithHx.limit}`,
          data: '',
          toString: '',
          name: 'firstSectionStartsWithHx()',
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
            result.name = 'firstSectionStartsWithH1()';

            result.line = size[0][0] + 1;

            if (size[0][1] === rules.firstSectionStartsWithHx.limit) {
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

  NeighboringSections: function (link, config) {
    let result = {
      status: false,
      line: '-',
      column: '-',
      msg: '',
      data: '',
      toString: '',
      name: '',
    };

    if (util.testIfIsFile(link).status === true && link.endsWith('.md')) {
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
          result.name = 'NeighboringSections()';
        }
      }
    }

    result.toString = util.toStringGenerate(result);

    return result;
  },

  inconsistencyOfSpaces: function (path, config) {
    let result = {
      status: false,
      line: '-',
      column: '-',
      msg: '',
      data: '',
      toString: '',
      name: 'inconsistencyOfSpaces()',
    };

    if (util.testIfIsFile(path).status) {
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

  consecutiveBlankLines: function (link, rules) {
    let result = {
      line: '-',
      column: '-',
      status: '',
      msg: '',
      data: 0,
      toString: '',
      name: 'consecutiveBlankLines()',
    };

    if (util.testIfIsFile(link).status === true) {
      if (rules.consecutiveBlankLines?.limit !== undefined) {
        const lines = fs.readFileSync(link, 'utf-8').split(os.EOL);
        let cont = 0;

        for (let i = 0; i < lines.length; i++) {
          if (lines[i].trim() === '') {
            cont++;

            if (cont > rules.consecutiveBlankLines.limit) {
              result.status = 'error';
              result.line = i + 1;
              result.msg = `This file is expected to have a maximum of ${rules.consecutiveBlankLines.limit} consecutive blank lines`;
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
  }
};
