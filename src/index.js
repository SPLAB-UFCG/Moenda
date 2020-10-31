const fs = require('fs');
const os = require('os');
const util = require('./util');


module.exports = {
	directoryFiles: function(path, extensionsArray){
		let result = {status:"info", line: "-", column: "-", data:[], msg: "This directory has the following files:", toString: ""};

		if(util.testIfIsFile(path).status === false){
			const arrayFiles = fs.readdirSync(path);

			for(let i = 0; i < arrayFiles.length; i++){
				if(util.testIfIsFile(`${path}/${arrayFiles[i]}`).status === true){
					if(util.ignoresExtensions(arrayFiles[i], extensionsArray).status === false){
						result.data [result.data.length] = (arrayFiles[i]);
				}}
			}
		}else{
			result.msg = "Unable to read this directory";
		}

		result.toString = util.toStringGenerate(result);

		return result;
	},

	lineCounter: function(link, config){
		const rules = require(config);
		let result = {line: "-", column: "-", status: "info", msg:"", data:0, toString: "", name: "lineCounter()"};;

		if(util.testIfIsFile(link).status === true){
			const lines = fs.readFileSync(link, "utf-8").split(os.EOL).length;
			result.msg = `The file has ${lines} line(s)`;
			result.data = lines;

			if(rules.lineCounter?.limit !== undefined){
				if(lines > rules.lineCounter.limit){
				result.status = "error";
				result.line = rules.lineCounter.limit + 1;
				result.msg = `This file is expected to have a maximum of ${rules.lineCounter.limit} lines`;
				}
			} 
		}

		result.toString = util.toStringGenerate(result);

		return result;
	},

	hasLineAboveXCharacters: function(link, config){	
		const fileTest = fs.statSync(link, "utf-8");
		const rules = require(config);

		if (fileTest.isFile()){
		let	result = {status: false, data: "", msg:"", line: "-", column:"-", toString:"", name:""};

			if(rules.hasLineAboveXCharacters?.limit !== undefined){
				const file = fs.readFileSync(link, "utf-8");
				const lines = file.split(os.EOL);
				for(let i = 0; i<lines.length; i++){
					if (lines[i].length > config){
						result.status = "error";
						result.line = i + 1;
						result.data = lines[i];
						result.column = config + 1;
						result.msg = `This line must not exceed ${config} characters.`;
						result.name = "hasLineAboveXCharacters()";
						result.toString = util.toStringGenerate(result);

						return result;
					}
				}	
			}
			result.toString = util.toStringGenerate(result);
			return result;
		}
	
	},

	firstSectionStartsWithH1: function(link){
		let result = {status: "", line: "-", column: "-", msg: "", data:"", toString: "", name: ""};
		if(util.testIfIsFile(link).status === true && link.endsWith(".md")){
			result = {status: "error", line: "-", column: "-", msg: "The first section of the file does not start with H1", data:"", toString: "", name: "firstSectionStartsWithH1()"};
			const file = fs.readFileSync(link, "utf-8");
			const lines = file.split(os.EOL);
			let size = [];
			
			for(let i = 0; i < lines.length; i++){
				if(lines[i].startsWith('#')){
					let aux = "";
					for(let j = 0; j < lines[i].length; j++){
						if(lines[i][j] === "#"){
							aux += "#";
						}		
					}
					size [size.length] = [i, aux.length];
					result.column = aux.length;
					result.data = aux;
					result.name = "firstSectionStartsWithH1()";

					result.line = size[0][0] + 1;

					if(size[0][1] === 1){
						result.status = false;
						}
					break;
				}
			}
		}
		result.toString = util.toStringGenerate(result);

		return result;
	},

	checkIfMarkdownHasGrowingSections: function(link){
		let result = {status: false, line:"-", column: "-", msg: "The file has increasing and decreasing sections", data: "", toString: "", name: "checkIfMarkdownHasGrowingSections()"};
		if(util.testIfIsFile(link).status === true && link.endsWith(".md")){
			const file = fs.readFileSync(link, "utf-8");
			const lines = file.split(os.EOL);
			let sizes = [];

			for(let i = 0; i < lines.length; i++){
				if(lines[i].startsWith('#')){
					let aux = "";
					for(let j = 0; j < lines[i].length; j++){
						if(lines[i][j] === "#"){
							aux += "#";
						}		
					}
					sizes [sizes.length] = [i, aux.length];
				}
			}

			for(let i = 0; i < sizes.length - 1; i++){
				if(sizes[i][1] !== sizes[i+1][1] && sizes[i][1] !== sizes[i+1][1] - 1 && sizes[i][1] !== sizes[i+1][1] + 1){
					result.status = "error";
					result.line = sizes[i][0] + 1;
					result.msg = "The file does not have increasing and decreasing sections";
					result.column = sizes[i][1];
					result.data = lines[sizes[i][0]];
					result.name = "checkIfMarkdownHasGrowingSections()";
				}
			}
		}

		result.toString = util.toStringGenerate(result);

		return result;
	},

	exit: function(rules, path, extensionsArray){
		
		if(util.testIfIsFile(path).status === true){
			let errors = 0;
			let infos = 0;

			let functions = [this.checkIfMarkdownHasGrowingSections(path), 
				this.firstSectionStartsWithH1(path), 
				this.hasLineAboveXCharacters(path, rules),
				this.lineCounter(path, rules),
			];
		
			string = path + os.EOL;
			
			let returns = [];

			for(let j = 0; j < functions.length; j++){
				if(functions[j].status === "error"){
					returns.push(functions[j].toString);
					errors++;
				}
				if(functions[j].status === "info"){
					returns.push(functions[j].toString);
					infos++;
				}
			}

			returns.sort();

			for(let j = 0; j < returns.length; j++){
				string += returns[j] + os.EOL;

			}

		string += os.EOL + "* " + errors + ` problem(s) (${errors} errors)` + os.EOL;
		string += "* " + infos + " info(s)" + os.EOL;

		console.log(string);
		
		} else {
			const array = this.directoryFiles(path, extensionsArray).data;
			for(let i = 0; i < array.length; i++){
				let errors = 0;
				let infos = 0;
				const functions = [this.checkIfMarkdownHasGrowingSections(`${path}/${array[i]}`), 
					this.firstSectionStartsWithH1(`${path}/${array[i]}`), 
					this.hasLineAboveXCharacters(`${path}/${array[i]}`, rules),
					this.lineCounter(`${path}/${array[i]}`, rules),
				];

				let returns = [];

				string = `${path}/${array[i]}`+ os.EOL;
				
				for(let j = 0; j < functions.length; j++){
					if(functions[j].status === "error"){
						returns.push(functions[j].toString);
						errors++;
					}
					if(functions[j].status === "info"){
						returns.push(functions[j].toString);
						infos++;
					}
				}

				returns.sort();

				for(let j = 0; j < returns.length; j++){
					string += returns[j] + os.EOL;
				}

			string += os.EOL + "* " + errors + ` problem(s) (${errors} errors)` + os.EOL;
			string += "* " + infos + " info(s)" + os.EOL;

			console.log(string);
			}
		}
		
	}
	
}
