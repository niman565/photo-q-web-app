var https = require('https');
var fs = require("fs");
// var array = require('array');

var sqlite3 = require("sqlite3").verbose();
var dbFileName = "PhotoQ.db";
var db = new sqlite3.Database(dbFileName);

var imglist = JSON.parse(fs.readFileSync("photoList.json")).photoURLs;

var API_KEY= fs.readFileSync("GV_API_KEY").toString().replace(/\s/g, "");

function loadTags(response, id, indexElement) {
    // console.log("Inside loadTags: index we are at: " + indexElement);
    if(!response){
        console.log("response is empty");
        return;
    }
    else if(!response.responses){
        console.log("response is empty");
        return;
    }

    var tagLabel;
    var tagLandmark;
    
    var arrLabel = [], arrLand = [];

    var full = false;

    var taginit = response.responses[0];
    // console.log("this is the response JSON");
    // console.log(taginit);
    // console.log("");
    if(taginit.landmarkAnnotations){
        tagLandmark = response.responses[0].landmarkAnnotations;
        // boolLandmark = true;
        // console.log("============LANDMARKS===========");
        for (var idx = 0; idx < tagLandmark.length; idx++) {
            var arrayElement = tagLandmark[idx];
            // console.log( arrayElement.description, arrayElement.score );
            // var combLength;
            // if(!combined.includes(arrayElement)){
            //     combLength = combined.push(arrayElement.description);
            // }
            // if(combLength == 6){
            //     full = true;
            //     break;
            // }
            var length = arrLand.push(arrayElement.description);
            if(length == 6){
                full = true;
                break;
            }
        }
        // console.log("the length of the array in landmark is currently: " + arrLand.length);
    }
    if(taginit.labelAnnotations && (full == false) ){
        // console.log("==============LABEL=============");
        // boolLabel = true;
        tagLabel = response.responses[0].labelAnnotations;
        for (var idx = 0; idx < tagLabel.length; idx++) {
            var arrayElement = tagLabel[idx];
            // console.log( arrayElement.description, arrayElement.score );
            // var combLength;
            // if(!combined.includes(arrayElement)){
            //     combLength = combined.push(arrayElement.description);
            // }
            // if(combLength == 6){
            //     full = true;
            //     break;
            // }
            var length = arrLabel.push(arrayElement.description);
            if(length == 6){
                full = true;
                break;
            }
        }
        // console.log("the length of the array in label is currently: " + arrLabel.length);
    }
    // else console.log("Landmark empty");
    
    // else console.log("Label empty");
    if(arrLabel.length > 0 && arrLand.length > 0){
        updatedb(arrLabel, arrLand, id);
    }
    else if(arrLabel.length > 0){
        console.log("Landmark empty");
        updatedbLabel(arrLabel, id);
    }
    else if(arrLand.length > 0){
        console.log("Label empty");
        updatedbLandmark(arrLand, id);
    }
    else {
        console.log("no landmark or label tags available");
        index++;
        if(index < listLength){
            console.log("index is now: " + index);
            getImageTags(imglist[index], index);
        }
        else {
            console.log("done");
            return;
        }
    }

    // console.log(id);
}
// var cmdStr = "CREATE TABLE photoTags (idNum INTEGER UNIQUE NOT NULL PRIMARY KEY, fileName TEXT, width INTEGER, height INTEGER, locationTag TEXT, tagList TEXT)";

function updatedbLandmark(array, id){
    // console.log("updatedb overloaded 2");
    // console.log("length of the array is: " + array.length);
    // console.log(db);
    var arraystr = array.toString();
    var cmd = "UPDATE phototags SET locationTag = \"" + arraystr + "\" WHERE fileName = \"" + id + "\"";
    // console.log("this is the command:" + cmd);
    db.run(cmd, function(err){
        if (err) { 
            console.log(err); 
        }
        else{
            index++;
            if(index < listLength){
                console.log("index is now: " + index);
                getImageTags(imglist[index], index);
            }
            else {
                console.log("done");
                return;
            }
        }
    });
    // db.close();
}

function updatedbLabel(array, id){
    // console.log("updatedb overloaded 2");
    // console.log("length of the array is: " + array.length);
    // console.log(db);
    var arraystr = array.toString();
    var cmd = "UPDATE phototags SET tagList = \"" + arraystr + "\" WHERE fileName = \"" + id + "\"";
    // console.log("this is the command:" + cmd);
    db.run(cmd, function(err){
        if (err) { 
            console.log(err); 
        }
        else{
            index++;
            if(index < listLength){
                console.log("index is now: " + index);
                getImageTags(imglist[index], index);
            }
            else {
                console.log("done");
                return;
            }
        }
    });
    // db.close();
}

function updatedb(arraylabel, arrayland, id){
    var arraystrLabel = arraylabel.toString();
    var cmdlabel = "UPDATE phototags SET tagList = \"" + arraystrLabel + "\" WHERE fileName = \"" + id + "\"";
    var arraystrLand = arrayland.toString();
    var cmdland = "UPDATE phototags SET locationTag = \"" + arraystrLand + "\" WHERE fileName = \"" + id + "\"";
    var cmd = cmdlabel + ";" + cmdland + ";";
    db.run(cmd, function(err){
        if (err) { 
            console.log(err); 
        }
        else{
            index++;
            if(index < listLength){
                console.log("index is now: " + index);
                getImageTags(imglist[index], index);
            }
            else {
                console.log("done");
                return;
            }
        }
    });
}

function getImageTags(filename, indexElement) {

    var imageStringB64 = filename.toString('base64');
    var urlResp = "http://lotus.idav.ucdavis.edu/public/ecs162/UNESCO/" + imageStringB64;
    
    var options = {
        hostname: 'vision.googleapis.com',
        port: 443,
        path: '/v1/images:annotate?key=' + API_KEY,
        method: 'POST'
    };
    
    var params = {

          "requests":[
            {
              "image":{
                "source": {"imageUri":urlResp}
              },
              "features":[
                {
                  "type":"LABEL_DETECTION",
                  "maxResults":10
                },
                { "type": "LANDMARK_DETECTION"}
              ]
            }
          ]
    };

    var response = []
    const req = https.request(options, (res) => {
        console.log('=================>statusCode:', res.statusCode);
        // console.log('headers:', res.headers);
        
        res.on('data', (d) => {
            response.push(d);
        }).on('end', () => {
            loadTags( JSON.parse(Buffer.concat(response)), imageStringB64, indexElement);
        });
    });

    req.on('error', (e) => { console.error(e); });

    req.write( JSON.stringify(params) );
    req.end();
}

// for(var i = 0 ; i < imglist.length; i++){
//     getImageTags(imglist[i]);
// }
var index = 0;
var listLength = imglist.length;
getImageTags(imglist[index], index);

// for(var i = 0 ; i < 25; i++){
//     getImageTags(imglist[i], i);
// }

// for(var i = 200 ; i < 400; i++){
//     getImageTags(imglist[i]);
// }

// for(var i = 400 ; i < 600; i++){
//     getImageTags(imglist[i]);
// }

// for(var i = 600 ; i < 800; i++){
//     getImageTags(imglist[i]);
// }

// for(var i = 800 ; i < imglist.length; i++){
//     getImageTags(imglist[i]);
// }
