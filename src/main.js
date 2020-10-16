const prompt = require('prompt-sync')();
const index = require('./index');



function main(){

  const path = prompt('Enter the path to the file to be scanned: ');
  const extensionsArray = prompt('Enter connections to be ignored, separated by space. Ex: js md py:  ').split(' ');
  const functionName = prompt('Name of function:  ');

  console.log(index.directoryFiles(path, extensionsArray))
  console.log(index.lineCounter(path));
  console.log(index.checkIfMarkdownHasGrowingSections(path));
  console.log(index.hasLineAboveEightyCharacters(path));
  console.log(index.firstSectionStartsWithH1(path));
  console.log(index.ignoresExtensions(path, extensionsArray));
  index.useImportFunction(path, functionName);
  
}

main();