const fs = require('fs');
const os = require('os');
const { isBuffer } = require('util');

function testIfIsFile(path){
	let result = {status: false, msg: "the path passed does not correspond to a file.", line: "-", column: "-"};
	const fileTest = fs.statSync(path);
	result.status = fileTest.isFile();

	if(result.status === true){
		result.msg = "the path passed corresponds to a file";
	}
	return result;
}

function toStringGenerate(method, name){
	const string = method.line +":" + method.column + "     " +method.status + "     " + method.msg + "     " + method.name;

	return string;
}

module.exports = {

	ignoresExtensions: function(path, extensionsArray){
		let result = {line: "-", column: "-", status:false, msg: "The informed path does not have any of the reported extensions.", data: ""};

		if(extensionsArray.indexOf(String(path.split('.')[1]), 0) !== -1){
			result.status = true;
			result.msg = "The path passed corresponds to a file of type that needs to be ignored.";
		} 
		return result;
	},

	directoryFiles: function(path, extensionsArray){
		let result = {status:"info", line: "-", column: "-", data:[], msg: "This directory has the following files:", toString: ""};

		if(testIfIsFile(path).status === false){
			const arrayFiles = fs.readdirSync(path);

			for(let i = 0; i < arrayFiles.length; i++){
				if(testIfIsFile(`${path}/${arrayFiles[i]}`).status === true){
					if(ignoresExtensions(arrayFiles[i], extensionsArray).status === false){
						result.data [result.data.length] = (arrayFiles[i]);
				}}
			}
		}else{
			result.msg = "Unable to read this directory";
		}

		result.toString = toStringGenerate(result);

		return result;
	},

	lineCounter: function(link, config){
		let result = {line: "-", column: "-", status: "info", msg:"", data:0, toString: "", name: "lineCounter()"};;

		if(testIfIsFile(link).status === true){
			const lines = fs.readFileSync(link, "utf-8").split(os.EOL).length;
			if(lines > config){
				result.status = "error";
				result.line = config + 1;
				result.msg = `This file is expected to have a maximum of ${config} lines`;
			}else{
				result.msg = `The file has ${lines} lines`;
			}
			result.data = lines;
		}

		result.toString = toStringGenerate(result);

		return result;
	},

	hasLineAboveXCharacters: function(link, config){	
		let result = {status: "", data: "", msg: "", line: "-", column:"-", toString:"", name:""};
		
		const fileTest = fs.statSync(link, "utf-8");

		if (fileTest.isFile()){
			result = {status: false, data: "", msg: `No lines exceed ${config} characters.`, line: "-", column:"-", toString:"", name:""};
			const file = fs.readFileSync(link, "utf-8");
			const lines = file.split(os.EOL);;
			for(let i = 0; i<lines.length; i++){
				if (lines[i].length > config){
					result.status = "error";
					result.line = i + 1;
					result.data = lines[i];
					result.column = config + 1;
					result.msg = `This line must not exceed ${config} characters.`;
					result.name = "hasLineAboveXCharacters()";
					result.toString = toStringGenerate(result);

					return result;
				}
			}	
		}

		result.toString = toStringGenerate(result);

		return result;	
	},

	firstSectionStartsWithH1: function(link){
		let result = {status: "", line: "-", column: "-", msg: "", data:"", toString: "", name: ""};
		if(testIfIsFile(link).status === true && link.endsWith(".md")){
			result = {status: "error", line: "-", column: "-", msg: "The first section of the file does not start with H1", data:"", toString: ""};
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
					break;
				}
			}

			result.line = size[0][0] + 1;

			if(size[0][1] === 1){
				result.status = false;
			}
		}
		result.toString = toStringGenerate(result);

		return result;
	},

	checkIfMarkdownHasGrowingSections: function(link){
		let result = {status: false, line:"-", column: "-", msg: "The file has increasing and decreasing sections", data: "", toString: "", name: ""};
		if(testIfIsFile(link).status === true && link.endsWith(".md")){
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

		result.toString = toStringGenerate(result);

		return result;
	},

	exit: function(rules, path, extensionsArray){
		let string = "";
		const config = require(rules);
		let errors = 0;
		let infos = 0;
		let functions = [this.checkIfMarkdownHasGrowingSections(path), 
			this.firstSectionStartsWithH1(path), 
			this.hasLineAboveXCharacters(path, config.hasLineAboveXCharacters.limit),
			this.lineCounter(path, config.lineCounter.limit),
		];

		string = path + os.EOL + "" + os.EOL;

		for(let i = 0; i < functions.length; i++){
			if(functions[i].status === "error"){
				string += functions[i].toString + os.EOL;
				errors++
			}
			if(functions[i].status === "info"){
				string += functions[i].toString + os.EOL;
				infos++
			}
		}
		string += os.EOL + "* " + errors + ` problem(s) (${errors} errors)` + os.EOL;
		string += "* " + infos + " info(s)" + os.EOL;

		console.log(string);
	}
	
}
