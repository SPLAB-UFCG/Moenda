const path = require('path');

const Moenda = require(path.resolve(__dirname, '../src/core/Moenda.js'));

const config = {
  'require-structure': {
    structure: {
      h1: {p: 'required', h2: 'required'},
      h2: [{p: 'required', code: 'optional', h3: 'optional'}, {h3: 'required'}],
      h3: [
        {p: 'required', code: 'required'},
        {p: 'required', table: 'required'},
      ],
    },
  },
  comment: 'docs-checker',
};

const moenda = new Moenda({
  parser: 'md',
  rules: require(path.resolve(__dirname, './rules')),
  files: path.resolve(__dirname, './files/teste.md'),
  processor: require(path.resolve(__dirname, './processor.js')).createContext,
  rulesConfig: config,
});

moenda.runRules();
setTimeout(() => console.log('finish'), 0);
console.log(moenda.getResults());
