
// like include
var http  = require("http");
var staticServer = require("node-static");
var fileServer = new staticServer.Server("./");
function search (request, response) {
    var url = request.url;
    if (url.split("/")[1] == "index.html")
        request.addListener('end', findFile).resume();
    function findFile() {
        // dynamic query part
        fileServer.serve(request, response);
    }
    if (url.includes("?q")){
        query = url.split("=")[1];
        console.log(query);
        var res = autocomplete(query);
        console.log(res);
	      var fin = JSON.stringify(res);
	      response.write(fin);
	      response.end();
    }

    function autocomplete(val) {
        var people_return = [];
        var people = ["katy", "katy Perry", "taylor", "taylor Swift", "kay this works"];
            for (i = 0; i < people.length; i++) {
                if (val === people[i].slice(0, val.length)){
                    people_return.push(people[i]);
                }
            }
         return people_return;
    }
}
var finder = http.createServer(search);

// fill in YOUR port number!
finder.listen("57717");
