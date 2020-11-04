# Defining rules:

* Every function must receive as parameters the path to the analyzed file and the path to the settings file.

* Each function must return an object with the following properties:
  ```
  		let object = {status: boolean, line:"-", column: "-", msg: "Example", data: "", toString: "", name: "name of function()"};

  ```
* All the functions in the rules file must be exported, example:
  ```
  module.exports = {

    example: function(path, config){
      console.log("example");
    }

  }

  ```
* The settings file must follow the following format:

  ```
    const config = {

      nameOfFunction: {propertie: value},

    }

    module.exports = config;

  ```

* The --config argument is given the path to the settings file.

* The --exclude argument receives extensions that should be ignored in the analysis, example:

  ```
    --exclude js,md,java

    --exclude java,txt
    
  ```