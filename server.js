"use strict";

// サーバーPORTの決定
const PORT = process.env.PORT || 8080;

// Salesforce側の接続アプリケーション情報
const SF_INSTANCE_URL = "https://sato-global-jp--2019USE.my.salesforce.com";
const SF_CLIENT_ID = "3MVG9rnryk9FxFMXMi93yAP6uKBjb3YsMBzAqjdXCT9YR.4Trha3ANDntg4SLcPvAtFj9DL8TmSCf42lUmaU.";
const SF_CLIENT_SECRET = "7F92FE629BFB70AE8CBC373CDEF6C86B662E10FFEE57C916554A35D1BB61CC92";
const SF_REDIRECT_URI = "https://backlogconnect.herokuapp.com/token";

// Nodeモジュールの準備
const express = require("express");
const parser = require("body-parser");
const request = require("request");
// Expressのインスタンス化
const app = express();
// body-parserの準備
app.use(parser.urlencoded({extended:true}));
// body-parserの適用
app.use(parser.json());
// Expressのlisner設定
app.listen(PORT);
// ログ出力
console.log("server start PORT=" + PORT);
// 
let issue = null;

let accessToken = null;

/**
 * 認証をする
 */
app.use('/auth', function(req, res){
	// ログ出力
	console.log("--- authorize call ---");
	// レスポンスヘッダを設定
	res.set('Content-Type', 'text/html');
	// 遷移用のhtml準備
	const html = 
	"<form id='f' name='f' method='POST' action='" + SF_INSTANCE_URL + "/services/oauth2/authorize'>" +
	"	<input type='hidden' name='response_type' value='code'/>" +
	"	<input type='hidden' name='client_id' value='" + SF_CLIENT_ID + "'/>" + 
	"	<input type='hidden' name='redirect_uri' value='" + SF_REDIRECT_URI + "'/>" + 
	"</form>" +
	"<script>" +
	"document.forms.f.submit();" +
	"</script>";
	// レンダリング
	res.send(Buffer.from(html));
});
/**
 * 認証→コールバック（認証コード取得）
 */
app.use('/token', function(req, res){
	// ログ出力
	console.log("--- token call ---");
	// コードが含まれる場合（含まれていないのは不正なリクエスト）
	if(req.query.code){
		// ヘッダ設定
		res.set('Content-Type', 'text/html');
		// token発行のためのAjax通信実行用のスクリプトを書き込む
		const html = 
		"<script type='text/javascript' src='https://code.jquery.com/jquery-3.5.1.min.js'></script>" +
		"<script type='text/javascript'>" +
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
		"        console.log('success');" +
		"        console.log(xhr.responseJSON.access_token);" +
		"        passToken(xhr.responseJSON.access_token);" +
		"    }," +
		"    error:function(xhr, textStatus, error){" + 
		"        console.log('error' + error);" +
		"    }" +
		"});" +
		"function passToken(token){" +
		"    $.ajax({" +
		"        type:'GET'," +
		"        url:'https://backlogconnect.herokuapp.com/passtoken?token=' + token," + 
		"        dataType:'xml'," +
		"        success:function(result, textStatus, xhr){" + 
		"            console.log('success');" +
		"        }," +
		"        error:function(xhr, textStatus, error){" + 
		"            console.log('error' + error);" +
		"        }" +
		"    });" +
		"}" +
		"</script>";
		// レンダリング
		res.send(Buffer.from(html));
	}
	// レスポンス終了
	res.end();
});

app.use('/passtoken', function(req, res){
	console.log("--- pass Token ---");
	accessToken = req.query.token;
	res.end();
});

// BacklogのWebhookからのコール
app.use('/webhook', function(req, res){
	console.log("--- webhook ---");
	console.log(accessToken);
	res.set("Authorization", "Bearer " + accessToken);
	res.redirect(307, SF_INSTANCE_URL + "/services/apexrest/backlogconnect");
});

/*
"function restcall(token){" +
		"    $.ajax({" +
		"        type:'POST'," +
		"        url:'" + SF_INSTANCE_URL + "/services/apexrest/backlogconnect'," + 
		"        dataType:'xml'," +
		"        beforeSend:function(xhr, settings){" +
		"            xhr.setRequestHeader('Authorization', 'Bearer ' + token);" +
		"        }," +
		"        success:function(result, textStatus, xhr){" + 
		"            console.log('success');" +
		"        }," +
		"        error:function(xhr, textStatus, error){" + 
		"            console.log('error' + error);" +
		"        }" +
		"    });" +
		"}" +
*/
