const fs = require('fs');
const prompt = require('prompt-sync')();


//analyzes all files in a directory and returns the number of lines for each one
function lineCounter(){
	
	const result = {};

	//asks for user input
	const path = prompt('Enter the path to the directory to be scanned:     ');

	//reads all files from a given directory
	let arrayFiles = fs.readdirSync(path);

	//reading specific files and adding the number of lines to the 'result' variable.
	for(let i = 0; i < arrayFiles.length; i++){
		
		const fileTest = fs.statSync(path + "/" + arrayFiles[i], "utf-8");

		if (fileTest.isFile()){
			const file = fs.readFileSync(path + "/" + arrayFiles[i], "utf-8");
			result[`${arrayFiles[i]}`] = file.split("\n").length - 1;
		}	
	};
	
	return result;
}


//analyzes a given file and stores lines that have more than 80 characters
function collectEighty(link){
	
	let result = [];

	//tests whether the past path leads to a directory or file
	const fileTest = fs.statSync(link, "utf-8");

	if (fileTest.isFile()){
		const file = fs.readFileSync(link, "utf-8");

		const lines = file.split("\n");

		for(let i = 0; i<lines.length; i++){
			if (lines[i].trim().length > 80){
                         result.push(`${[i]}:${lines[i]}`);
			}
		}
	}

	//returns a object() with key = line number and value = line.
	return result;

}
