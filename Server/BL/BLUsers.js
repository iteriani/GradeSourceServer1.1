function BLUsers(DB){

	this.DB = DB;
	var self = this;

	self.GetUserData = function(id, callback){
		self.DB.GetUserData(id, callback);
	}

	self.RegisterUser = function(userdata, callback){
		self.DB.RegisterUser(userdata, callback)
	}

}

module.exports = BLUsers;