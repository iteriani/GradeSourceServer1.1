function BLGrades(DB, ClassModule){	// refactor utility at bottom

	this.DB = DB;
	this.ClassModule = ClassModule;
	var self = this;
	var DEFAULT_USER = 0;
	var UtilClass = require("./utility.js");
	this.utility = new UtilClass();

	/*
		From a classid and a user, return back class data.
	 */
	self.ReadUser = function(classid, id, callback){
		id = self.utility.formatID(id);
		self.DB.GetGrades(id, classid, function(returnData){
			callback(JSON.stringify(returnData, null, 2))
			//self.updateDB();
		})			
	};

	self.GetClassStats = function(classid, userid, callback){
		userid = self.utility.formatID(userid);
		self.DB.GetClassGrades(classid, function(returnData){
			var gradeDB = {};
			returnData[0].Grades.forEach(function(element){
				gradeDB[element.subject] = [];
			});		// get assignment categories

			returnData.forEach(function(user){
				user.Grades.forEach(function(grade){
					var value = parseFloat(grade.grade);
					if(!isNaN(value)){
						gradeDB[grade.subject].push(value)						
					}	// restructure grades so we get values in an array

				});
			});
			if(userid != null){
			var userGrade = returnData.filter(function(element){
				return element.ID === userid;
			})[0].Grades;	// get user grades for rank

			var clonedGrades = JSON.parse(JSON.stringify(gradeDB));
			Object.keys(clonedGrades).forEach(function(element){
				clonedGrades[element].sort(function(e1, e2){
					return e2 - e1;
				});	// clone and order/rank the grades
			})

			var rankDB = []
			userGrade.forEach(function(element){
				var gradeVal = parseFloat(element.grade);
				if(!isNaN(gradeVal)){
					rankDB.push(clonedGrades[element.subject].indexOf(gradeVal)+1);
				}else{
					rankDB.push("N/A")	// find user ranks
				}
			})
			}

			var gradebook = [];
			Object.keys(gradeDB).forEach(function(element, index){
					var stats = self.utility.average(gradeDB[element]);
					stats.name = element;	// generate stats
					if(userid != null){
						stats.rank = rankDB[index];
					}
					gradebook.push(stats);
				});

			callback(JSON.stringify(gradebook));
		})			
	}

	/*
		Subsequent three methods are used in subroutine to update database. Soon we will
		need to check for updates to contact users.
	 */

	self.updateDB = function(){
		self.ClassModule.GetClasses(function(classes){
			classes.forEach(function(_class){
				console.log("Updaing class..." + _class.name)
				self.updateClass(_class.link);
			})
		});
	}

	self.updateClass = function(url){
		var baseUrl = url;
		var assessmentLink = baseUrl + "/scores.html";
					self.utility.GetRequest(assessmentLink, function(scores){
						var categories = scores.match(/<a[\s\S]*?<\/a>/g);
						categories = categories.slice(3, categories.length-2)
						categories.forEach(function(category, index){
							var basestring = category.slice(24);
							categories[index] = basestring.substring(0, basestring.length-4);
						});
						
						var scoreArr = scores.match(/<tr[\s\S]*?<\/tr>/g);

						var initialRow = scoreArr[5];
						var scoreInitial = initialRow.match(/<font size="2"[\s\S]*?<\/font>/g);
						var scoreMax = scoreInitial.slice(0,scoreInitial.length/2);
						scoreInitial = scoreInitial.slice(scoreInitial.length/2);
						var tailRows = scoreArr.slice(6);
						var returnRow = [];

						self.ClassModule.GetCourseID(baseUrl, function(courseID){
							tailRows.forEach(function(element){
 								returnRow.push(self.parseRowElement(element, courseID, categories));
							})
							returnRow.push(self.parseRowElement(scoreInitial, courseID, categories));
							returnRow.push(self.parseRowElement(scoreMax, courseID, categories, DEFAULT_USER));

							var change = false;
							returnRow.forEach(function(element, index){

								self.DB.AddGrade(element, function(status){
									change = status;
									if(index == returnRow.length-1){
										console.log(change==true?"Change detected" : "No change", url)
									}
								});
							});
						});
					});
	}

	self.parseRowElement = function(element, courseID, categories, userid){

		if(typeof element != "object"){	// inserting preprocessed array
			var score = element.match(/<font size="2"[\s\S]*?<\/font>/g);

		}else{
			var score = element;
		}
		var obj = {ID : "",
					ClassID : courseID,
					Grades : [],
					DateAdded : Date.Now
				};


		if(userid != null){	// mainly used for DEFAULT_USER
			obj.ID = userid;
		}else{
			obj.ID = score[0].split("<b>")[1].split("</b>")[0].replace("&nbsp;", "")
		}
		var count = 0;
		score.slice(1).forEach(function(element, index){
		var strMatcher = element.split("<b>")[1];
		if(strMatcher != null){
			obj.Grades.push(
				{
					subject : categories[count++] , 
					grade : strMatcher.split("</b>")[0].replace("&nbsp;", "")
					});
				}
 		})
 		return obj;
	}



}

module.exports = BLGrades;