const fs = require('fs');
const prompt = require('prompt-sync')();


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
			if (lines[i].length > 80){
				result.push([i]+ " : " + lines[i]);
			}
		}
	}
	return result;
}

function firstSectionStartsWithH1(link){
	const file = fs.readFileSync(link, "utf-8");

	for(let i = 0; i < file.length; i++){
		return file[i] == "#" && file[i+1] != "#"
	}
}

function checkIfMarkdownHasGrowingSections(link){
	const file = fs.readFileSync(link, "utf-8");
	const lines = file.split("\n");
	const sizes = [];
	let retorno = true;

	for(let i = 0; i < lines.length; i++){
		if(lines[i].startsWith('#')){
			let aux = "";
			for(let j = 0; j < lines[i].length; j++){
				if(lines[i][j] === "#"){
					aux += "#";
				}		
			}
			sizes [sizes.length] = aux.length;
		}
	}

	for(let i = 0; i < sizes.length - 1; i++){
		if(sizes[i] !== sizes[i+1] && sizes[i] !== sizes[i+1] - 1 && sizes[i] !== sizes[i+1] + 1){
			return false;
		}
	}

	return retorno;
}




console.log(checkIfMarkdownHasGrowingSections("/home/felipe/Moenda/CODE_OF_CONDUCT.md"));


