"use strict";

/* Server Values */

// サーバーPORTの決定
const PORT = process.env.PORT || 8080;
// Salesforce側の接続アプリケーション情報
const SFConnInfo = {
	loginUrl     : "test.salesforce.com",
	clientId     : "3MVG9rnryk9FxFMXMi93yAP6uKBjb3YsMBzAqjdXCT9YR.4Trha3ANDntg4SLcPvAtFj9DL8TmSCf42lUmaU.",
	clientSecret : "7F92FE629BFB70AE8CBC373CDEF6C86B662E10FFEE57C916554A35D1BB61CC92",
	redirectUri  : "https://backlogconnect.herokuapp.com/token"
};
// Nodeモジュールの準備
const express = require("express");
const parser = require("body-parser");
const jsforce = require("jsforce");

/* Server Boot */

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

/* Listener Setting */

/**
 * POST,GET受信時処理
 * (BacklogのWebhookからのコール)
 */
app.use('/', function(req, res){
	// RequestのBodyを取得＝webhookから送られた課題の情報
	const body = req.body;
	// Body部が無い場合、何もせずに終了
	if(!body)res.end();
	// Salesforceとの接続アプリケーションとの接続の確立
	const conn = new jsforce.Connection({oauth2:SFConnInfo});
	// ログイン情報　※変数化する
	const username = "takesues@use-ebisu.co.jp.2019use";
	const password = "take5ue@use";
	// OAuth2.0によるログイン処理の実行
	conn.login(username, password,
		// ログイン後の処理
		function(err, userInfo) {
			// エラーならコンソールにエラー出力して後続の処理はしない
			if(err){
				return console.error(err);
			}
			// Apex RestへのHttp POST Send
			conn.apex.post(
				"/backlogconnect/",
				body,
				function(err, rsp) {
					// エラーならコンソールにエラー出力
					if(err){
						return console.error(err);
					}
					// ログの出力
				  	console.log("Apex Rest Complete");
				}
			);
		}
	);
	// Responseを終了する
	res.end();
});


