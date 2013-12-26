/*

	Interface IUser:
 */

function DALGrades(){
	var self = this;
	var mongoose = require('mongoose');
	var Schema = mongoose.Schema;
	if(mongoose.connection._hasOpened == false){
		mongoose.connect('mongodb://localhost/28017');
	}
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function callback () {
		console.log("Connected successfully")
		});

	var UserSchema = new Schema({
			ID : String,
			name : String,
			email : String,
			phone : String,
			classes : [{userid : String, classid : String}]
		});

	try{
		var UserModel = mongoose.model("Users");
	}catch(e){
		var UserModel = mongoose.model("Users", UserSchema);
	}

	self.GetUserData = function(id, callback){
		UserModel.find({PID : id}, function(err, user){
			callback(user);
		});
	}

	self.RegisterUser = function(userdata, callback){
		var ObjectID = require('mongodb').ObjectID;

		var user = {
  			PID : userdata.name,
  			email : userdata.email,
  			phone : userdata.phone,
  			classes : [],
  			_id: new ObjectID()
		};
		// translates form data;
		if(typeof userdata['classids[]'] === "string"){
			var classes = [userdata['classids[]']];
		}else{
			var classes = userdata['classids[]'];
		}
		console.log(classes);
		if(typeof userdata['userids[]'] === "string"){
			var userids = [userdata['userids[]']];
		}else{
			var userids = userdata['userids[]'];
		}

		for(var i = 0; i < classes.length; i++){
			var obj = {classid : classes[i], userid : parseInt(userids[i])};
			user.classes.push(obj);	
		}

		callback(JSON.stringify(user));
		db.collection('users').insert(user, function(err, result){
			callback(JSON.stringify(result));
		});

	}


	}

module.exports = DALGrades;