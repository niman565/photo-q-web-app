var auto = require("./makeTagTable");
var stringify = require("json-stringify");
var fs = require('fs');  // file access module

var tagTable = {};   // global
auto.makeTagTable(tagTableCallback);
function tagTableCallback(data) {
   tagTable = data;
//   console.log(tagTable);
}

// note- xxx.json should already exist and be populated beyond this point

var acJson = JSON.parse(fs.readFileSync("xxx.json"))["fa"];
var keys = Object.keys(acJson.tags);
console.log(keys);

//console.log(tagTable);
//var innerJson = JSON.stringify(tagTable);
//console.log(innerJson);
