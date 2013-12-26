function ClassController(params){
	var self = this;
	self.params = params;
	var fs = require('fs');

	self.View = function(callback){
		fs.readFile("./Client/Views/Class.html", function(err, data){
			callback(data);
		});
	}

	self.applyActions = function(callback){
		var DB = require("../DAL/DALClass.js")
		var BLClass = require("../BL/BLClass.js")
		var DAL = new DB();
		var ClassModule = new BLClass(DAL);
		try{
			if(self.params.action == "CheckUrl"){
				ClassModule.CheckUrl(self.params.url, callback);
			}else if(self.params.action == "GetClasses"){
				ClassModule.GetClasses(function(classes){
					callback(JSON.stringify(classes))
				});
			}
		}catch(e){
			console.log(e);
		}

	}

}

module.exports = ClassController;