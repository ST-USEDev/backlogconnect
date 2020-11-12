"use strict";

const http = require("http");

http.createServer(function(req, res){
	console.log(req);
	console.log(res);
}).listen(8080);
