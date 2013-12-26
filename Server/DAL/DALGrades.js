/*

	Interface IGrades:
		AddGrade(Grade grade)
		GetGrades(userid, classid, callback)
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
	//console.log(db);
	var GradeSchema = new Schema({
			ID : String,
			ClassID : String,
			Grades : [{subject : String, grade : String}],
		});



	try{
		var GradeModel = mongoose.model("Grade");
	}catch(e){
		var	GradeModel = mongoose.model("Grade", GradeSchema);
	}



	self.AddGrade = function(Grade, callback){
		var grade = new GradeModel({
			ID : Grade.ID,
			ClassID : Grade.ClassID,
			Grades : Grade.Grades
		});

	var upsertData = grade.toObject();
	delete upsertData._id;
							//userid, classid
	GradeModel.update({ID : Grade.ID, ClassID : Grade.ClassID}, upsertData, {upsert: true}, function(err, affected, metaInfo){
		 if(metaInfo.updatedExisting == false){
		// 	console.log("Added a new grade!", Grade.ID, Grade.ClassID);
		 	callback(true);
		 }else{
		//	console.log("No change here...", Grade.ID, Grade.ClassID)
		 	callback(false)
		 }
	});

	}


	self.GetGrades = function(userid, classid, callback){
		GradeModel.find({ID : userid, ClassID : classid}, function(err, data){
			//mongoose.connection.close();
			callback(data)
		});
	}

	self.GetClassGrades = function(classid, callback){
		console.log(classid);

		GradeModel.find({ClassID : classid}, function(err, data){
			callback(data)
		//	mongoose.connection.close();
		});
	}



}

module.exports = DALGrades;