const fs = require('fs');

module.exports = {
  testIfIsFile: function(path){
    let result = {status: false, msg: "the path passed does not correspond to a file.", line: "-", column: "-"};
    const fileTest = fs.statSync(path);
    result.status = fileTest.isFile();
  
    if(result.status === true){
      result.msg = "the path passed corresponds to a file";
    }

    return result;
  },
  
  toStringGenerate: function(method){
    const string = method.line + ":" + method.column + "     " + method.status + "     " + method.msg + "     " + method.name;
  
    return string;
  },

  ignoresExtensions: function(path, extensionsArray){
		let result = {line: "-", column: "-", status:false, msg: "The informed path does not have any of the reported extensions.", data: ""};

    if(extensionsArray !== undefined){
      if(extensionsArray.indexOf(String(path.split('.')[1]), 0) !== -1){
        result.status = true;
        result.msg = "The path passed corresponds to a file of type that needs to be ignored.";
      } 
    }
		return result;
  },

  directoryFiles: function(path, extensionsArray){
		let result = {status:"info", line: "-", column: "-", data:[], msg: "This directory has the following files:", toString: ""};
		if(this.testIfIsFile(path).status === false){
      const arrayFiles = fs.readdirSync(path);
      
			for(let i = 0; i < arrayFiles.length; i++){
				if(this.testIfIsFile(`${path}/${arrayFiles[i]}`).status === true){
					if(this.ignoresExtensions(arrayFiles[i], extensionsArray).status === false){
						result.data [result.data.length] = (arrayFiles[i]);
					}
				}
			}
		}else{
			result.msg = "Unable to read this directory";
		}

		result.toString = this.toStringGenerate(result);

		return result;
  },
  
  sortNumbers: function(path){

  }
}