function BaseController(params){
	var self = this;
	self.parameters = params;
	var fs = require('fs');


	self.GetResponse = function(callback){
		if(self.parameters.action == "View"){
			self.View(callback);
		}else {
			var controller = require("./" + params.controller + "Controller");
			var api = new controller(params);
			api.applyActions(callback);
		}

	};

	self.View = function(callback){
		try{
			var controller = require("./" + params.controller + "Controller");
			var api = new controller(params);
			var responseStr = "";
			fs.readFile("./Client/Views/Header.html", function(err, data){
				responseStr += data;
				api.View(function(view){
					responseStr += view;

					fs.readFile("./Client/Views/Footer.html",function(err, data){
						responseStr+= data;
						callback(responseStr);
					});

				});
			});

		}catch(exception){
			return exception;
		}
	}


}

module.exports = BaseController;