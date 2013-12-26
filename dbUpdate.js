		var DB = require("./Server/DAL/DALGrades.js")
		var BLGrades = require("./Server/BL/BLGrades.js")
		var DAL = new DB();
		var ClassDB = require("./Server/DAL/DALClass.js")
		var BLClass = require("./Server/BL/BLClass.js")
		var DALClass = new ClassDB();
		var ClassModule = new BLClass(DALClass);
		var GradeModule = new BLGrades(DAL, ClassModule);
	GradeModule.updateDB();
	var minutes = 30, the_interval = minutes * 60 * 1000;
	setInterval(function() {
		console.log("Restarting process");
		GradeModule.updateDB();
	}, the_interval);