const path = require('path');

const moenda = require(path.resolve(__dirname, './core/Moenda.js'));

const config = {
  h1: {p: 'required', h2: 'required'},
  h2: [{p: 'required', code: 'optional', h3: 'optional'}, {h3: 'required'}],
  h3: [
    {p: 'required', code: 'required'},
    {p: 'required', table: 'required'},
  ],
};

const moenda = new Moenda({
  parser: 'md',
  rules: path.resolve(__dirname, './rules'),
  files: [path.resolve(__dirname, './teste.md')],
  processor: require(path.resolve(__dirname, './core/processor.js'))
    .createContext,
  rulesConfig: config,
});

console.dir(moenda.runRules());
setTimeout(() => console.log('a'), 0);
console.log(moenda.getResults());
