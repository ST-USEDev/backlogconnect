"use strict";

const PORT = process.env.PORT || 8080;

const express = require("express");
const parser = require("body-parser");

const app = express();

app.use(parser.urlencoded({extended:true}));

app.use(parser.json());

app.listen(PORT);

console.log("server start PORT=" + PORT);

app.post('/', function(req,res){
	console.log(req.url);
	console.log(req.query);
	console.log(req.body);
	res.end();
});

app.get('/', function(req,res){
	console.log(req.url);
	console.log(req.query);
	res.end();
});
