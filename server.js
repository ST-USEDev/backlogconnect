"use strict";

// サーバーPORTの決定
const PORT = process.env.PORT || 8080;

// Salesforce側の接続アプリケーション情報
const SFConnInfo = {
	loginUrl  : "https://sato-global-jp--2019USE.my.salesforce.com",
	clientId     : "3MVG9rnryk9FxFMXMi93yAP6uKBjb3YsMBzAqjdXCT9YR.4Trha3ANDntg4SLcPvAtFj9DL8TmSCf42lUmaU.",
	clientSecret : "7F92FE629BFB70AE8CBC373CDEF6C86B662E10FFEE57C916554A35D1BB61CC92",
	redirectUri  : "https://backlogconnect.herokuapp.com/token"
};

// Nodeモジュールの準備
const express = require("express");
const parser = require("body-parser");
const jsforce = require("jsforce");
// Expressのインスタンス化
const app = express();
// body-parserの準備
app.use(parser.urlencoded({extended:true}));
// body-parserの適用
app.use(parser.json());
// Expressのlisner設定
app.listen(PORT);
// ログ出力
console.log("Server Start PORT=" + PORT);

// BacklogのWebhookからのコール
app.use('/', function(req, res){
	
	const body = req.body;
	
	const conn = new jsforce.Connection({oauth2:SFConnInfo});
	
	const username = "takesues@use-ebisu.co.jp.2019use";
	const password = "take5ue@use";
	
	conn.login(username, password,
		function(err, userInfo) {
			if(err){
				return console.error(err);
			}
			conn.apex.post("/backlogconnect/", body, function(err, rsp) {
				if(err){
					return console.error(err);
				}
			  	console.log("response: ", rsp);
			});
		}
	);

	res.end();
});


