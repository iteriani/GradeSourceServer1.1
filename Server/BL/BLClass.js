function BLClass(DB){

	this.DB = DB;
	var self = this;
	var UtilClass = require("./utility.js");
	this.utility = new UtilClass();

	self.GetClasses = function(callback){
		self.DB.GetClasses(function(classes){
			callback(classes)
		});
	}

	self.CheckUrl = function(url, callback){
		var urlParts = url.split("/");
		if(urlParts[2]!== "www.gradesource.com" || urlParts[3] !== "reports"){
			return "false";
		}else{
			try{
				self.GetCourseTitle(url,function(title){
					self.GetCourseIDFromTitle(title, function(courseID){
						title = title.slice(14); // take gradesource off title
						self.DB.GetClasses(function(classes){
							var filteredClasses = classes.filter(function(element){
								return element.courseid == courseID;
							})
							var returnVal = filteredClasses.length == 0? "true" : "false"
							callback(returnVal);

							if( filteredClasses.length == 0){
								self.AddClass(title, courseID, url);
							}
						});
					});
				});

			}catch(e){
				return false;
			}	
		}
	}

	self.AddClass = function(title, courseID, url){
		self.DB.AddClass(title, courseID, url);

	}

	self.GetCourseID = function(url, callback){
		self.GetCourseTitle(url, function(title){
			self.GetCourseIDFromTitle(title, callback);			
		});

	}

	self.GetCourseTitle = function(url, callback){
		self.utility.GetRequest(url + "index.html", function(data){
			var title = data.split("</title>");
			title = title[0].split("<title>");
			title = title[1];
			callback(title);
		});
	}

	self.GetCourseIDFromTitle = function(title, callback){
		var courseID =	title
							.slice(14)
							.replace(/ /g,'')
							.replace("-","")
							.replace(",", "")
							.replace("Fall", "FA")
							.replace("Spring", "SP")
							.replace("Summer", "SU")
							.replace("Winter", "WI")
							.replace("2013", "13")
							.replace("2014", "14");
			callback(courseID);
	}



}

module.exports = BLClass;