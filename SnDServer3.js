var static = require('node-static');

// Create a node-static server instance to serve the './public' folder
var file = new static.Server('./public');

// changed code
//include statements
var http = require('http');

//server object is being instantiated
var server = http.createServer(handler);

// ========================================
// global variables
var fs = require('fs');  // file access module
var sqlite3 = require("sqlite3").verbose();
var dbFileName = "PhotoQ.db";
var db = new sqlite3.Database(dbFileName);
var stringify = require("json-stringify");

var keys = {};
// generates lokup table for autocomplete
var tagTable = {};   // global
var auto = require("./makeTagTable");
auto.makeTagTable(tagTableCallback);
function tagTableCallback(data) {
   tagTable = data;
}

function autocomplete(val) {
    var suggestions = [];
    var tagsHash = tagTable;
    // SAMPLE: "fa":{"tags":{"fauna":18,"facade":21,"fault":6,"factory":1,"farm":2,"farmhouse":1}}
    if (val.length == 2 && JSON.parse(fs.readFileSync("xxx.json")).hasOwnProperty(val)) {
      var Json = JSON.parse(fs.readFileSync("xxx.json"))[val];
      var keys = Object.keys(Json.tags);
  //    console.log("(cond 1) keys are: " + keys);
      return keys;
    }
    else if (val.length > 2) {
        var firstTwo = val.substring(0,2);
        var Json = JSON.parse(fs.readFileSync("xxx.json"))[firstTwo];
        var keys = Object.keys(Json.tags);
        var ret = [];
        for (let i=0; i < keys.length; i++) {
            var curr = keys[i];
            if (curr.length >= val.length && curr.indexOf(val) !== -1) {
                ret.push(curr);
            }
        }
        return ret;
    }
    else {
      return [null];
    }
}

// ======================================




//callback function
function handler (request, response) {

    var url = request.url;
//	console.log("url: " + url);			// 	/query?keyList=frogs+toads+lizards

    var urlReq = url.split("/")[1];
//    console.log("urlReq: " + urlReq)	//

 	var urlQuery = url.split("?")[0];
//	console.log("urlQuery: " + urlQuery);

    var urlResp = "http://lotus.idav.ucdavis.edu/public/ecs162/UNESCO/";

    //portion to handle static query: this part should be finished
    //if(urlReq === "testWHS.html" || urlReq === "testWHS.css" || urlReq === "testWHS.js" || urlReq === "reset.css"){
	 if(urlReq.includes(".html") || urlReq.includes(".css") || urlReq.includes(".js")) {
//        console.log("in query, serving some random file!!");
        function fileServe () {
            file.serve(request, response);
        }

        var listener = request.addListener('end', fileServe);
        listener.resume();

    }

    //portion to handle dynamic query: will be built on for step 2
    else if(urlQuery === "/query") {
        var frontPart = url.split("?")[1];   // keyList=frogs+toads+lizards   or autocomplete=bu
  //      console.log("frontpart: " + frontPart);

        var inputType = frontPart.split("=")[0];  // keyList     or autocomplete
  //      console.log("type: " + inputType);

         if (!frontPart || !inputType){
           response.writeHead(400, {"Content-Type": "text/html"});
           response.write("Bad Request\n");
           response.end();
         }
        else{
            if (inputType == "keyList") {
    //            console.log("INSIDE KEYLIST");
                var urlTags = url.split("=")[1];
      		      var tagList = urlTags.split("+");		// contains all the tags/locations in input
          			cmdStr = "SELECT * FROM photoTags WHERE ";
          			for (i =0; i < tagList.length; i++) {
          				if (i > 0) {cmdStr += "AND ";}
          				cmdStr += "(locationTag = " + "\"" + tagList[i] + "\""  + " OR tagList LIKE \"%" + tagList[i] + "%\") ";
          			}
          			db.all(cmdStr, function (err, rowData) {
          					if (err) {
          						console.log(err);
          					}
          					else {
          						response.writeHead(200, {"Content-Type": "text/html"});
          						var jsonRet = {"objects": rowData}
          						response.write(stringify(jsonRet));
          						response.end();
          					}
          				}
          			)
              }
              if (inputType == "autocomplete") {
            //     console.log("INSIDE AUTOCOMPLETE");
                  var input = frontPart.split("=")[1];
              //    console.log("input:" + input);
                  var res = autocomplete(input);
              //    console.log("suggestions: " + res);
                  var fin = JSON.stringify(res);
          	      response.write(fin);
          	      response.end();
              }
        }
    }

    //portion to handle invalid query
    else{
        // console.log("BS");
        response.writeHead(404, {"Content-Type": "text/html"});
        response.write("<p> Not Found </p>");
        response.end();
    }



}

//insert port number here
server.listen(57717);
