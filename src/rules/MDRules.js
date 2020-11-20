const util = require("../util");
const fs = require("fs");
const os = require('os');

module.exports = {
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
}

