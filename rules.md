# Defining rules
This page covers the most recent rule format for Moenda. Each rule follows some conventions that are explained below.

* Every function must receive as parameters the path to the analyzed file and the path to the settings file.
* Each function must return an object with the following properties: `status, line, column, msg, data, name`.
* All the functions in the rules file must be exported.

The exported functions are which sets up the rules. To those functions are passed two arguments, a file path and a config object. The file path, is the path of the file being analyzed at a certain point of moenda execution. The config are the customizations options provided by a config file.

Quite simply, the basic pattern to follow is:
```
rulesfile.js
{
  rule1: function(path, config){
    console.log("example1");
    ...
    return {
      status: boolean,
      line:"-",
      column: "-",
      msg: "Example",
      data: "",
      toString: "",
      name: "name of function()"
    }
  },
  rule2: function(path, config){
    console.log("example 2");
    ...
    return {
      status: boolean,
      line:"-",
      column: "-",
      msg: "Example",
      data: "", 
      toString: "",
      name: "name of function()"
    }
  }
```
