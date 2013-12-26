function UsersController(params){
	var self = this;
	self.params = params;
	var fs = require('fs');

	self.View = function(callback){
		if(self.params.classid != null){
			fs.readFile("./Client/Views/Users.html", function(err, data){
				callback(data);
			});
		}else{
			fs.readFile("./Client/Views/AddUsers.html", function(err, data){
				callback(data);
			});			
		}
	}

	self.applyActions = function(callback){
		var DB = require("../DAL/DALUsers.js")
		var BLUsers = require("../BL/BLUsers.js")
		var DAL = new DB();
		var UsersModule = new BLUsers(DAL);
		try{
			if(self.params.action == "GetUserData"){
				UsersModule.GetUserData(self.params.classid, function(userData){
					callback(JSON.stringify(userData));
				});
			}else if(self.params.action == "AddUser"){
				UsersModule.RegisterUser(self.params, function(userData){
					callback(userData);
				});
			//	callback(JSON.stringify(self.params));
			}
		}catch(e){
			console.log(e)
		}
	}

	self.processRequest = function(callback){
		var DB = require("../DAL/DALUsers.js")
		var BLUsers = require("../BL/BLUsers.js")
		var DAL = new DB();		
		var UsersModule = new BLUsers(DAL);
		try{

		}catch(e){
			console.log(e)
		}
	}

}

module.exports = UsersController;