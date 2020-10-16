const fs = require('fs');
const os = require('os');


function testIfIsFile(link){
	const fileTest = fs.statSync(link);

	return fileTest.isFile();
}

module.exports = {

	ignoresExtensions: function(path, extensionsArray){
		if(extensionsArray.indexOf(path.split('.')[1]) == 0){
			return true;
		} 
		return false;
	},

	directoryFiles: function(path, extensionsArray){
		let result = [];

		if(testIfIsFile(path) == false){
			const arrayFiles = fs.readdirSync(path);

			for(let i = 0; i < arrayFiles.length; i++){
				if(testIfIsFile(`${path}/${arrayFiles[i]}`) === true){
					if(this.ignoresExtensions(arrayFiles[i], extensionsArray) === false){
						result[result.length] = arrayFiles[i];
					}
				}
			}
		}

		return result;
	},

	lineCounter: function(link){
		if(testIfIsFile(link) === true){
			return fs.readFileSync(link, "utf-8").split(os.EOL).length;
		}
	},

	hasLineAboveEightyCharacters: function(link){	
		const fileTest = fs.statSync(link, "utf-8");

		if (fileTest.isFile()){
			let result = [];
			const file = fs.readFileSync(link, "utf-8");
			const lines = file.split(os.EOL);

			for(let i = 0; i<lines.length; i++){
				if (lines[i].length > 80){
					result[result.length] = i;
				}
			}
			return result;
		}	
	},

	firstSectionStartsWithH1: function(link){
		if(testIfIsFile(link) === true && link.endsWith(".md")){
			const file = fs.readFileSync(link, "utf-8");
			const lines = file.split(os.EOL);

			for(let i = 0; i < lines.length; i++){
				const boolean = lines[i][0] == "#" && lines[i][1] != "#";

				return boolean;
			
		}}
	},

	checkIfMarkdownHasGrowingSections: function(link){
		if(testIfIsFile(link) === true && link.endsWith(".md")){
				const file = fs.readFileSync(link, "utf-8");
				const lines = file.split(os.EOL);
				const sizes = [];
				let result = true;

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
						result = false;
					}
				}
				return result;
		}
	},

	useImportFunction: function(path, functionality){
		const file = require(path);
		
		file[functionality]();
	}
}
