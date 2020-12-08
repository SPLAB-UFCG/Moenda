const util = require("./util");
const mdRules = require("./rules/MD/MDRules");
const genericRules = require("./rules/genericRules/genericRules");
const config = require("./config");

// testIfIsFile

test('testIfIsFile returns true', 
  () => {
    const object = util.testIfIsFile("/home/felipe/fork/Moenda/README.md");
    expect(true).toBe(object);
})

test('testIfIsFile returns false', 
  () => {
    const object = util.testIfIsFile("/home/felipe/fork/Moenda");
    expect(false).toBe(object);
})

// toStringGenerate

test('toStringGenerate', 
  () => {
    const object = mdRules.ruleNeighboringSections("/home/felipe/fork/Moenda/README.md", "/home/felipe/fork/Moenda/config.js");
    expect(util.toStringGenerate(object)).toBe("45:4     error     The file does not have increasing and decreasing sections     ruleNeighboringSections()");
})


// ignoresExtensions


test('ruleignoresExtensions returns false', 
  () => {
    expect(util.ignoresExtensions("/home/felipe/fork/Moenda/README.md", "java,html")).toBe(false);
})

test('ruleignoresExtensions returns true', 
  () => {
    expect(util.ignoresExtensions("/home/felipe/fork/Moenda/README.md", "java,md,js")).toBe(true);
})


// directoryFiles

test('directoryFiles returns a list without md files', 
  () => {
    expect(util.directoryFiles("/home/felipe/fork/Moenda", "md")).toStrictEqual([".eslintrc.js", ".gitignore", ".prettierrc", "LICENSE", "package-lock.json", "package.json"]);
})

test('directoryFiles returns a list with md files', 
  () => {
    expect(util.directoryFiles("/home/felipe/fork/Moenda", "java")).toStrictEqual([".eslintrc.js",".gitignore",".prettierrc","CODE_OF_CONDUCT.md","CONTRIBUTING.md","LICENSE","README.md","package-lock.json","package.json","rules.md"]);
})


// selectsObjectsWithStatusErrorAndInfo

test('selectsObjectsWithStatusErrorAndInfo.data returns a list with one object', 
  () => {
    const functions = Object.values(genericRules).concat(Object.values(mdRules));
    expect(util.selectsObjectsWithStatusErrorAndInfo(functions, "/home/felipe/fork/Moenda", config).data).toStrictEqual([{"column": "-", "data": 0, "line": "-", "msg": "", "name": "ruleLineCounter()", "status": "info", "toString": "-:-     info          ruleLineCounter()"}]);
})

