/*
 * Initial manual implementation of MVC. I will manually load all of the modules
 * required to call the proper modules.


 */

var http = require('http');
var router = require('router');
//documentation found at https://npmjs.org/package/router
var fs = require('fs');
var route = router();
//refactor later
DataFormatter = require("DataFormatter");

route.get('/', function(req, res) {
    res.writeHead(200);
    res.end('hello index page');
});

/* Loads Javascript files */
route.get('/js/{action}/{controller}?', function(req, res){
	var params = req.params;	
	var returnStr = null;
	//console.log(req.params.action);
//	console.log(req.params.controller);
	if(params.action != "Model" && params.action != "ViewModel"){
		returnStr = "./Client/js/" + params.action;
	}else{
		if(params.controller != null){
			if(req.params.action == "Model"){
				returnStr = "./Client/Models/" + params.controller + "Model";

			}else if(req.params.action == "ViewModel"){
				returnStr = "./Client/ViewModels/" + params.controller + "ViewModel";
			}
		}
	}

	if(returnStr == null){
		res.writeHead(404);
		res.end();
	}else{
		returnStr = returnStr+".js";
		console.log(returnStr);
		fs.readFile(returnStr, function(err, data){
			if(err != null){
				console.log(err);
				res.writeHead(404);
				res.end();
			}else{
				res.writeHead(200);
				res.write(data);
				res.end();
			}
		});
	}
});

/*  Loads Controller Actions */
route.get('/{controller}/{action}/{classid}?/{userid}?', function(req, res) {
	var formatter = new DataFormatter(req, res);
    try{
    	var controller = require("./Server/Controllers/BaseController");
    	var initializedController = new controller(formatter.params);
    	res.writeHead(200);
    	initializedController.GetResponse(function(response){
    		res.write(response);
    		res.end();
    	});
	}catch(exception){
		res.writeHead(200)
		res.write("Unable to find controller");
    	res.end();
	}

  route.post('/{controller}/{action}', function (req, res) {
  	var querystring = require('querystring');
    res.writeHead(200, { 'Content-Type': 'application/json' })
    var body = "";
    req.on('data', function (data) {
    	body += data;
    });

    req.on("end", function(){
    	var reqBody = querystring.parse(body);
    	reqBody.controller = req.params.controller;
    	reqBody.action = req.params.action;
    	try{
    		var controller = require("./Server/Controllers/BaseController");
    		var initializedController = new controller(reqBody);
    		res.writeHead(200);
    		initializedController.GetResponse(function(response){
    			res.write(response);
    			res.end();
    		});
		}catch(exception){
			console.log(JSON.stringify(exception));
			res.writeHead(200)
			res.write("Unable to find controller");
    		res.end();
		}
    });

  });

});
http.createServer(route).listen(8000); // start the server on port 8000 once DB connected
/* */
