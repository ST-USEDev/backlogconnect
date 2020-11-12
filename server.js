"use strict";

const PORT = process.env.PORT || 8080;

const SF_INSTANCE_URL = "https://sato-global-jp--2019USE.my.salesforce.com";
const SF_CLIENT_ID = "3MVG9rnryk9FxFMXMi93yAP6uKBjb3YsMBzAqjdXCT9YR.4Trha3ANDntg4SLcPvAtFj9DL8TmSCf42lUmaU.";
const SF_CLIENT_SECRET = "7F92FE629BFB70AE8CBC373CDEF6C86B662E10FFEE57C916554A35D1BB61CC92";
const SF_REDIRECT_URI = "https://backlogconnect.herokuapp.com/token";

const express = require("express");
const parser = require("body-parser");

const app = express();

app.use(parser.urlencoded({extended:true}));

app.use(parser.json());

app.listen(PORT);

console.log("server start PORT=" + PORT);

let bodyData = null;

// 認証をする
app.use('/auth', function(req, res){
	console.log("--- authorize call ---");
	res.set('Content-Type', 'text/html');
	const html = 
	"<form id='f' name='f' method='POST' action='" + SF_INSTANCE_URL + "/services/oauth2/authorize'>" +
	"	<input type='hidden' name='response_type' value='code'/>" +
	"	<input type='hidden' name='client_id' value='" + SF_CLIENT_ID + "'/>" + 
	"	<input type='hidden' name='redirect_uri' value='" + SF_REDIRECT_URI + "'/>" + 
	"</form>" +
	"<script>" +
	"document.forms.f.submit();" +
	"</script>";
	res.send(Buffer.from(html));
});
// 認証→コールバック（認証コード取得）
app.use('/token', function(req, res){
	console.log("--- token call ---");
	console.log(req.query);
	console.log(req.body);
	console.log(req.query.code);
	if(req.query.code){
		res.set('Content-Type', 'text/html');
		const html = 
		"<script src='//code.jquery.com/jquery-3.5.1.min.js'>" +
		"<script>" +
		"$.ajax({" + 
		"    type:'POST'," + 
		"    url:'" + SF_INSTANCE_URL + "/services/oauth2/token'," + 
		"    dataType:'json'," +
		"    data:{" +
		"        grant_type:'authorization_code'," +
		"        code:'" + req.query.code + "'," +
		"        client_id:'" + SF_CLIENT_ID + "'," +
		"        client_secret:'" + SF_CLIENT_SECRET + "'," +
		"        redirect_uri:'" + SF_REDIRECT_URI + "'" +
		"    }," +
		"    success:function(result, textStatus, xhr){" + 
		"        console.log('aaaaa');" +
		"    }" +
		"});" +
		"</script>";
		res.send(Buffer.from(html));
	}
	res.end();
});

// BacklogのWebhookからのコール
app.use('/webhook', function(req, res){
	console.log(req.url);
	console.log(req.query);
	console.log(req.body);
	bodyData = req.body;

	res.end();
});
