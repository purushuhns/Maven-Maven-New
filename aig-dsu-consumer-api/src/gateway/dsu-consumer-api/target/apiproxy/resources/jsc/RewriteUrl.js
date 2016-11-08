var path = context.getVariable("url");
var pathsuffix = context.getVariable("urlSuffix");

/*
if(pathsuffix == "/oauth2/token") {
    pathsuffix="/sessions";
      var dsuApiTicket = context.getVariable("dsuApiTicket");
    context.setVariable("request.header.X-AIG-DSUApiTicket", dsuApiTicket);
}*/


/*
var dsuSiteKey =  context.getVariable("verifyapikey.VAK.VerifyAPIKey.X-AIG-DSUSiteKey");
//dsuSiteKey = "d4c5356b9075483d8467f18d9d3e9138";//"1b72d380069247a79d40758d3b19a963";
context.setVariable("request.header.X-AIG-DSUSiteKey", dsuSiteKey);
*/
path += pathsuffix ;
context.setVariable("target.url", path);

