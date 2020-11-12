"use strict";

const http = require("http");
const PORT = process.env.PORT || 8080;

http.createServer(function(req, res){
	console.log("--- Request Listen ---");
	console.log(req);
	console.log(res);
}).listen(PORT);

console.log("server start PORT=" + PORT);
