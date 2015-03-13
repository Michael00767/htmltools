/*controller for javascript helper*/

var fs = require('fs');
var path = require('path');
var UglifyJS = require("uglify-js");
var CleanCSS = require('clean-css');

var result = $("#result");



function run(dir){
    var files = fs.readdirSync(dir);
    for (var i in files){
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()){
            run(name);
        } else {
        	//created minify js files
        	if(path.extname(files[i]) == ".js"&&(path.basename(files[i], '.js').indexOf(".min")<0)){
					var outputPath = dir+"/";
					var minFile = path.basename(files[i], '.js')+".min.js";
					var mapFile = path.basename(files[i], '.js')+".min.js"+".map";
					var result = UglifyJS.minify(name,{
					    outSourceMap: mapFile
					});
					fs.writeFile(outputPath+minFile, result.code, function (err) {
					  if (err) {
					    console.log(err);
					    return;
					  }
					  console.log(minFile+' created');
					});
					var mapObj = JSON.parse(result.map);
					for(var j in mapObj.sources){
						mapObj.sources[j] = path.basename(mapObj.sources[j]);
					}
					//console.log(mapObj);
					fs.writeFile(outputPath+mapFile, JSON.stringify(mapObj), function (err) {
					  if (err) {
					    console.log(err);
					    return;
					  }
					  console.log(mapFile+' created');
					});
			}
        	//created minify css files
			if(path.extname(files[i]) == ".css"&&(path.basename(files[i], '.css').indexOf(".min")<0)){
				var outputPath = dir+"/";
				var minFile = path.basename(files[i], '.css')+".min.css";
				var data = fs.readFileSync(outputPath+files[i]).toString();
				var minified = new CleanCSS().minify(data).styles;
				fs.writeFile(outputPath+minFile, minified, function (err) {
					  if (err) {
					    console.log(err);
					    return;
					  }
					  console.log(minFile+' created');
				});
			}


        }

        
    }

}


$(function(){
	var sourcePath = "examples";
	var outputPath = "examples";
	$("#btn-run").click(function(){
		sourcePath = $("#input-sourcepath").val()||sourcePath;
		outputPath = $("#input-sourcepath").val()||sourcePath;
		fs.exists(sourcePath, function (exists) {
			if(exists){
				fs.exists(outputPath, function (exists) {
					if(exists){
						run(sourcePath);
					}else{
						result.html("outputPath didn't exist:"+"<span class='label label-danger'>"+outputPath+"</span>");
					}
				});
			}else{
				result.html("sourcePath didn't exist:"+"<span class='label label-danger'>"+sourcePath+"</span>");
			}
		});



	});


})