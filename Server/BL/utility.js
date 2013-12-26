function utility(){
	
	var self = this;
self.GetRequest = function(url, callback){
		var http = require("http");
		var returnStr = "";
		var count = 0;
		http.get(url, function(res){
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
       		returnStr += chunk;
    		});
		res.on('end', function(){
        	callback(returnStr);
    		});
		});
	}

self.average = function(a) {
  var r = {mean: 0, variance: 0, deviation: 0}, t = a.length;
  for(var m, s = 0, l = t; l--; s += a[l]);
  for(m = r.mean = s / t, l = t, s = 0; l--; s += Math.pow(a[l] - m, 2));
  return r.deviation = Math.sqrt(r.variance = s / t), r;
}

self.formatID = function(formId){
	var id = formId
	if(id.length < 4 && id != "0"){	// 0 is max user automatically 0 
		for(var i = 0; i < 4-id.length; i++){
			id = "0" + id;
		}
	}
	console.log(id);
	return id;
}

}

module.exports = utility;