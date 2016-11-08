 
var statusCode = context.getVariable("response.status.code");
context.setVariable("response.header.Content-Type", "application/json");

if(statusCode>=200 && statusCode<300) {
    var tokenResponse = {};
    var res = JSON.parse(response.content);
    tokenResponse.token_type = res.token_type;
    tokenResponse.access_token = res.access_token;
    tokenResponse.expires_in = res.expires_in;
    tokenResponse.refresh_token = res.refresh_token;
    tokenResponse.refresh_token_expires_in = res.refresh_token_expires_in;
    tokenResponse.refresh_count = res.refresh_count;
    tokenResponse.refresh_token_issued_at = res.refresh_token_issued_at;
    tokenResponse.status = res.status;
    tokenResponse.refresh_token_status = res.refresh_token_status;
    tokenResponse = JSON.stringify(tokenResponse);
    context.setVariable("response.content", tokenResponse);
    
}


