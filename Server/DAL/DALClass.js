/*

	Interface IClass:
 */

function DALClass(){
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

	var ClassSchema = new Schema({
		name : String,	
		courseid : String,
		link : String
	});

	try{
		var ClassModel = mongoose.model("Class");
	}catch(e){
		var	ClassModel = mongoose.model("Class", ClassSchema);
	}


	self.GetClasses = function(callback){
		ClassModel.find({}, function(err, data){
			for(var i = 0; i < data.length; i++)
				data[i] = data[i].toObject();
			callback(data)
		});
	}

	self.AddClass = function(title, courseID, url){
										var titleObj = {
									name : title,
									courseid : courseID,
									link : url
								};
		var Class = new ClassModel({
									name : title,
									courseid : courseID,
									link : url
									});
		Class.save(function(err){
			console.log(err);
		})
	}


}

module.exports = DALClass;