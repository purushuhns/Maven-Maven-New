var grantType  = context.getVariable("request.formparam.grant_type");
context.setVariable("tokenGrantType", grantType);
 
var userName  = context.getVariable("verifyapikey.VAK.VerifyAPIKey.X-AIG-DSUSiteKey");
context.setVariable("dsuSiteKey", userName);

var pwd  = context.getVariable("request.formparam.state");
context.setVariable("dsuApiTicket", pwd);


var basiAuthHeader  = context.getVariable("request.header.Authorization");
context.setVariable("basiAuthHeader", basiAuthHeader);