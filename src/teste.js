const markdownInt = require('markdown-it');
const mdParser = markdownInt({html: true});
const path = require('path');
const fs = require('fs');

const Moenda = require(path.resolve(__dirname, './core/Moenda.js'));

const moenda = new Moenda(null);

console.dir(moenda.runRules());

// const result = mdParser.parse(fs.readFileSync(path.resolve('./teste.md'), 'utf-8'))

// console.log(createContext(result)   )
