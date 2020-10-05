const fs = require('fs');

function testIfIsFile(link){
	const fileTest = fs.statSync(link);

	return fileTest.isFile();
}

module.exports = {
	directoryFiles: function(link, extensionsArray){
		let result = {};

		if(testIfIsFile(link) == false){
			const arrayFiles = fs.readdirSync(link);

			for(let i = 0; i < arrayFiles.length; i++){
				if(testIfIsFile(`${link}/${arrayFiles[i]}`) === true){
					if(extensionsArray.indexOf(arrayFiles[i].split('.')[1]) == -1){
						result[i] = arrayFiles[i];
					}
				}
			}
		}

		return result;
	},

	lineCounter: function(link){
		const result = {};
		if(testIfIsFile(link) === true){
			result[link] = fs.readFileSync(link, "utf-8").split("\n").length - 1;
		}
		return result;	
	},

	hasLineAboveEightyCharacters: function(link){	
		const fileTest = fs.statSync(link, "utf-8");

		if (fileTest.isFile()){
			let result = {};
			const file = fs.readFileSync(link, "utf-8");
			const lines = file.split("\n");

			for(let i = 0; i<lines.length; i++){
				if (lines[i].length > 80){
					result[i] = lines[i];
				}
			}
			return result;
		}	
	},

	firstSectionStartsWithH1: function(link){
		if(testIfIsFile(link) === true && link.endsWith(".md")){
			const file = fs.readFileSync(link, "utf-8");

			for(let i = 0; i < file.length; i++){
				const boolean = file[i] == "#" && file[i+1] != "#";

				return {"value": boolean};
			
		}}
	},

	checkIfMarkdownHasGrowingSections: function(link){
		if(testIfIsFile(link) === true && link.endsWith(".md")){
				const file = fs.readFileSync(link, "utf-8");
				const lines = file.split("\n");
				const sizes = [];
				let result = {"value": true};

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
						result.value = false;
					}
				}
				return result;
			}
		}
	}





