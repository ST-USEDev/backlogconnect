"use strict";

const http = require("http");

http.createServer(function(req, res){
	/*
	console.log(req);
	console.log(res);
	*/
	console.log("request listen");
}).listen(8080);
