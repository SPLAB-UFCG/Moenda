# Moenda

## What is Moenda:

Moenda is an engine built with Nodejs that analyzes a set of files from editable and user-defined rules and generates a report of these files.

## Installation and Usage:

```
$ npm i moenda

$ ./node_modules/moenda.js --rules <rules-file.js> --path <files-dir/> --exclude <files-extensions> --config <config-file.js>
 
Basic Configuration:
 --rules               This option allows you to specify another file from which to load rules files rather then default. 
 --path                This option allows you to specify the path to the file(s) to be analyzed.
 --config              This option allows you to specify an additional configuration file for Moenda.
 --exclude             This option allows you to specify which file extensions Moenda must ignore.(optional)
```
   
#### Rules
You can specify another file from which to load rules files using `--rules` option. This allows you to dynamically load new rules at run time. This is useful when you have custom rules that aren't suitable for being bundled with Moenda. Check it out our [rules documentation](https://github.com/SPLAB-UFCG/Moenda/blob/master/rules.md) to see how implement your custom rules.

#### Path
You can specify the path to the file(s) to be analyzed using `--path` option.

#### Exclude 
You can specify extensions of file to be ignored using `--exclude`. So, Moenda will not looks to those files when running the rules.


#### Configuration
Use a JavaScript file to specify configuration information for your files. This should be in the form of an `<configName>.js` file. Moenda will look for the file that you specified on the command line using `--config` option.


```js
const config = {
  lineCounter: {limit:60},
  LineAboveXCharacters: {limit:30},
  firstSectionStartsWithHx: {limit: 3},
  consecutiveBlankLines: {limit: 1}
}

module.exports = config;
```
#### Output
After run the command you'll see the report in your terminal.
```shell
$ moenda.js --rules /home/user/md-rules.js --path /home/user/sut --exclude html,java  --config configOne.js

/home/user/sut/file.js
12:76  error  "This line must not exceed 75 characters."     LineAboveXCharacters()
51:-  error    "This file is expected to have a maximum of 50 lines"   lineCounter()
62:- error     "This file is expected to have a maximum of 1 consecutive blank lines"     consecutiveBlankLines()

* 4 problem(s) (2 errors)
* 0 info(s)


/home/user/sut/markdown.md
1:4     error     The first section of the file does not start with H1     firstSectionStartsWithHx()
1:4     error     The file does not have increasing and decreasing sections     NeighboringSections()
15:76   error     "This line must not exceed 75 characters."     LineAboveXCharacters()
51:-  error    "This file is expected to have a maximum of 50 lines"   lineCounter()

* 4 problem(s) (4 errors)
* 0 info(s)
  

```

## Built-in Rules:

  1. [lineCounter](https://github.com/SPLAB-UFCG/Moenda/blob/master/src/index.js#L6)  
  2. [LessThanXLines](https://github.com/SPLAB-UFCG/Moenda/blob/master/src/index.js#L37)  
  3. [LineAboveXCharacters](https://github.com/SPLAB-UFCG/Moenda/blob/master/src/index.js#L68)    
  4. [firstSectionStartsWithHx](https://github.com/SPLAB-UFCG/Moenda/blob/master/src/index.js#L103)    
  5. [NeighboringSections](https://github.com/SPLAB-UFCG/Moenda/blob/master/src/index.js#L159)  
  6. [inconsistencyOfSpaces](https://github.com/SPLAB-UFCG/Moenda/blob/master/src/index.js#L209)  
  7. [consecutiveBlankLines](https://github.com/SPLAB-UFCG/Moenda/blob/master/src/index.js#L260)  




## Licença

MIT © Moenda
