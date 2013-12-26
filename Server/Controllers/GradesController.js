function GradesController(params){
	var self = this;
	self.params = params;
	var fs = require('fs');

	self.View = function(callback){
		fs.readFile("./Client/Views/Grades.html", function(err, data){
			callback(data);
		});
	}

	self.applyActions = function(callback){
		var DB = require("../DAL/DALGrades.js")
		var BLGrades = require("../BL/BLGrades.js")
		var DAL = new DB();
		var ClassDB = require("../DAL/DALClass.js")
		var BLClass = require("../BL/BLClass.js")
		var DALClass = new ClassDB();
		var ClassModule = new BLClass(DALClass);
		var GradeModule = new BLGrades(DAL, ClassModule);
		try{
			if(self.params.action == "ReadUser"){
				GradeModule.ReadUser(self.params.classid, self.params.userid, callback);
			}else if (self.params.action == "GetClassStats"){
				if(self.params.userid == null){
					self.params.userid = "0"; // string sent is empty
				}
				GradeModule.GetClassStats(self.params.classid, self.params.userid, callback);
			}else if (self.params.action == "GetClasses"){
				GradeModule.GetClasses(callback);
			}
		}catch(e){
			console.log(e);
		}

	}

}

module.exports = GradesController;