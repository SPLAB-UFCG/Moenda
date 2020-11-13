# Working with rules
This page covers the most recent rule format for Moenda. Each rule follows some conventions that are explained below.

The exported functions are which sets up the rules. To those functions are passed two arguments, a file path and a config object. The file path, is the path of the file being analyzed at a certain point of moenda execution. The config are the customizations options provided by a config file. Each method returns an object with 6 arguments: 
  * status - the type of result which can be: info, error, success
  * line - line number
  * column - column number
  * msg - message to display
  * toString - format messages
  * data - content about the line
  * name - rule name 

Quite simply, the basic pattern to follow is:
```
rulesfile.js
module.exports = {
  rule1: function(path, config){
    console.log("example1");
    ...
    return {
      status: info,
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
      status: success,
      line:"3",
      column: "10",
      msg: "Example",
      data: "", 
      toString: "",
      name: "name of function()"
    }
  }
```

Remember to export all the functions, otherwise Moenda will not find the rules.
