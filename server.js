"use strict";

const PORT = process.env.PORT || 8080;

const SF_INSTANCE_URL = "3MVG9rnryk9FxFMXMi93yAP6uKBjb3YsMBzAqjdXCT9YR.4Trha3ANDntg4SLcPvAtFj9DL8TmSCf42lUmaU.";
const REDIRECT_URI = "";

const express = require("express");
const parser = require("body-parser");

const app = express();

app.use(parser.urlencoded({extended:true}));

app.use(parser.json());

app.listen(PORT);

console.log("server start PORT=" + PORT);

let bodyData = null;

// 認証をする
app.get('/auth', function(req, res){

	res.send(Buffer.from("abc"));
	
	res.redirect(307, SF_INSTANCE_URL + "/oauth2/authorize");
});

// BacklogのWebhookからのコール
app.post('/webhook', function(req, res){
	console.log(req.url);
	console.log(req.query);
	console.log(req.body);
	bodyData = req.body;

	res.end();
});

app.get('/auth', function(req, res){
	console.log(req.query);
	res.end();
});
