var res = JSON.parse(context.getVariable("response.content"));
context.setVariable("dsuSessionToken", res.session_token);
var util = new Utility();
if(!util.isEmpty(res.expires_at)) {
    var ttl = parseInt(res.expires_at * 1000 *60);
    if(ttl > 0) {
        context.setVariable("dsuTtl", ttl.toString());
        var refreshTtl = ttl * 2;
        context.setVariable("refreshTtl", refreshTtl.toString());
    }
}

context.setVariable("dsuUuid", res.user.id);
context.setVariable("dsuEmail", res.user.email);
context.setVariable("dsuLegacyid", res.user.legacyid);

/*Set Authorization header for OAuth2*/
var basiAuthHeader  = context.getVariable("basiAuthHeader");
context.setVariable("request.header.Authorization", basiAuthHeader);



function Utility() {
	this.isEmpty = function(data) {
	    if(typeof(data) == 'number' || typeof(data) == 'boolean') {
            return false;
        }
        if(typeof(data) == 'undefined' || data === null) {
            return true;
        }
  
        if(typeof(data.length) != 'undefined') {
            return data.length == 0;
        }
		for (var h in data) {
			if (data.hasOwnProperty(h)) {
				return false;
			}
		}
		return true;
    };
    
    this.isJsonString = function(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    };
}
