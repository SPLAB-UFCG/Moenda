const fs = require('fs');
const prompt = require('prompt-sync')();
const extensionsExtractor = require('path');


function lineCounter(){
	
  	const result = {};

	const path = prompt('Enter the path to the directory to be scanned: ');
	  
	const  extensionsArray = prompt('Enter connections to be ignored, separated by space. Ex: js md py:  ').split(' ');
	
	const arrayFiles = fs.readdirSync(path);

	for(let i = 0; i < arrayFiles.length; i++){
	
		const fileTest = fs.statSync(`${path}/${arrayFiles[i]}`);

		if (fileTest.isFile()){
			const file = fs.readFileSync(path + "/" + arrayFiles[i], "utf-8");

			if(extensionsArray.indexOf(arrayFiles[i].split('.')[1]) == -1){
				result[`${arrayFiles[i]}`] = file.split("\n").length - 1;
			}
		}
	};

	return result;
}

function hasLineAboveEightyCharacters(link){

	let result = [];

	const fileTest = fs.statSync(link, "utf-8");

	if (fileTest.isFile()){
		const file = fs.readFileSync(link, "utf-8");

		const lines = file.split("\n");

		for(let i = 0; i<lines.length; i++){
			if (lines[i].trim().length > 80){
				result.push([i]+ " : " + lines[i]);
			}
		}
	}
	return result;
}







console.log(lineCounter());

