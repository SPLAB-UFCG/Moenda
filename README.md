# Moenda

## What is Moenda:

Moenda is an engine built with Nodejs that analyzes a set of files from editable and user-defined rules and generates a report of these files.

## How to download:

```
$ git clone https://github.com/SPLAB-UFCG/Moenda.git

$ npm install
```

## How to execute:


config.js: 

```js
const config = {
  lineCounter: {limit:60},
  hasLineAboveXCharacters: {limit:30},
  firstSectionStartsWithHx: {limit: 3},
  consecutiveBlankLines: {limit: 1}
}

module.exports = config;
```

```shell
$ moenda.js /home/user/md-rules.js /home/user/sut --exclude html,java  --config configOne.js

/home/user/sut/file.js
12:76  error  "This line must not exceed 75 characters."     hasLineAboveXCharacters()
51:-  error    "This file is expected to have a maximum of 50 lines"   lineCounter()
62:- error     "This file is expected to have a maximum of 1 consecutive blank lines"     consecutiveBlankLines()

* 4 problem(s) (2 errors)
* 0 info(s)


/home/user/sut/markdown.md
1:4     error     The first section of the file does not start with H1     firstSectionStartsWithHx()
1:4     error     The file does not have increasing and decreasing sections     hasNeighboringSections()
15:76   error     "This line must not exceed 75 characters."     hasLineAboveXCharacters()
51:-  error    "This file is expected to have a maximum of 50 lines"   lineCounter()

* 4 problem(s) (4 errors)
* 0 info(s)
  

```

## Functionalities:

  Function: lineCounter,  
  Function: hasLineAboveXCharacters,  
  Function: firstSectionStartsWithHx,  
  Function: hasNeighboringSections,  
  Function: inconsistencyOfSpaces,  
  Function: consecutiveBlankLines  




## Licença

MIT © [SeuProjeto]()
