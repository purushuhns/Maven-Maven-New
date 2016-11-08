
try{
	var faultName = context.getVariable("fault.name");
	var fh = new FaultHandler();
	var handler = fh.getFaultHandler(faultName);
	
	//context.setVariable("echoFaultName", faultName);
	//var handler = faultHandlers[faultName];
	
	var util = new Utility();	
	if(util.isEmpty(handler)) {
		 handler = new DefaultFaultHandler();
	}
	
	
	fh.setHandlerStrategy(handler);
	fh.runHandler();

	
} catch (err) {
   var handler = new InternalErrorFaultHandler()
   handler.handleFault();
}



function FaultHandler() {
	this.handler = "";
	
	this.setHandlerStrategy = function() {
	    this.handler = handler;
	};
	this.runHandler = function()  {
	    this.handler.handleFault();
	};
	
	var faultHandlers  = {
		"SpikeArrestViolation"									: new TooManyRequestFaultHandler(),
		"InvalidMessageWeight"									: new TooManyRequestFaultHandler(),
		"ErrorLoadingProperties"								: new TooManyRequestFaultHandler(),
		"FailedToResolveQuotaIntervalReference"					: new TooManyRequestFaultHandler(),
		"InvalidQuotaInterval"									: new TooManyRequestFaultHandler(),
		"FailedToResolveQuotaIntervalTimeUnitReference"			: new TooManyRequestFaultHandler(),
		"InvalidQuotaTimeUnit"									: new TooManyRequestFaultHandler(),
		"InvalidTimeUnitForDistributedQuota"  					: new TooManyRequestFaultHandler(),
		"InvalidSynchronizeIntervalForAsyncConfiguration"      	: new TooManyRequestFaultHandler(),
		"InvalidSynchronizeMessageCountForAsyncConfiguration"	: new TooManyRequestFaultHandler(),
		"InvalidAsynchronizeConfigurationForSynchronousQuota"	: new TooManyRequestFaultHandler(),
		"InvalidQuotaType"                          			: new TooManyRequestFaultHandler(),
		"InvalidStartTime"										: new TooManyRequestFaultHandler(),
		"StartTimeNotSupported"									: new TooManyRequestFaultHandler(),
		"SpikeArrestViolation"									: new TooManyRequestFaultHandler(),
		"InvalidAllowedRate"									: new TooManyRequestFaultHandler(),
		"FailedToResolveSpikeArrestRate"						: new TooManyRequestFaultHandler(),
		"QuotaViolation"										: new TooManyRequestFaultHandler(),
		"RaiseFault"											: new RaiseFaultHandler(),
		"ErrorResponseCode"										: new ClientResponseFaultHandler()
    };
    
    this.getFaultHandler = function(faultName) {
		return faultHandlers[faultName];
	};
}



function DefaultFaultHandler() {
	this.handleFault = function() {	    	
		context.setVariable("error.status.code", context.getVariable("error.status.code"));
		context.setVariable("error.reason.phrase",  context.getVariable("error.reason.phrase"));
		context.setVariable("error.header.Content-Type", "application/json");
		var jsonResponse = {};
		//var faultName = context.getVariable("fault.name");
		jsonResponse.code = context.getVariable("error.status.code");
		jsonResponse.message = context.getVariable("error.message");
		jsonResponse = JSON.stringify(jsonResponse);
		context.setVariable("error.content", jsonResponse);	
	};
}

function RaiseFaultHandler() {
	this.handleFault = function() {	    	
		context.setVariable("error.status.code", context.getVariable("error.status.code"));
		context.setVariable("error.reason.phrase",  context.getVariable("error.reason.phrase"));
		context.setVariable("error.header.Content-Type", "application/json");
		/*Get actual message from raise fault payload*/
	    var message = JSON.parse(context.getVariable("error.content"));	
		var jsonResponse = {};
		jsonResponse.code = message.code;
		jsonResponse.message = message.message; 
		jsonResponse = JSON.stringify(jsonResponse);
		context.setVariable("error.content", jsonResponse);						
	
	};	
}



function TooManyRequestFaultHandler() {
	this.handleFault = function() {	    	
		context.setVariable("error.status.code", 429);
		context.setVariable("error.reason.phrase",  "Too Many Requests");
		context.setVariable("error.header.Content-Type", "application/json");
		var jsonResponse = {};
	//	var faultName = context.getVariable("fault.name");
		jsonResponse.code = 429;
		jsonResponse.message = context.getVariable("error.message");
		jsonResponse = JSON.stringify(jsonResponse);
		context.setVariable("error.content", jsonResponse);	
	};
}


function InternalErrorFaultHandler() {
	this.handleFault = function() {	    	
		context.setVariable("error.status.code", 500);
		context.setVariable("error.reason.phrase",  "Internal Server Error");
		context.setVariable("error.header.Content-Type", "application/json");
		var jsonResponse = {};
		jsonResponse.code = 500;
		jsonResponse.message = "Internal Server Error";
		jsonResponse = JSON.stringify(jsonResponse);
		context.setVariable("error.content", jsonResponse);	
	};
}


function ClientResponseFaultHandler() {
	this.handleFault = function() {	    	
		context.setVariable("error.status.code", context.getVariable("error.status.code"));
		context.setVariable("error.reason.phrase",  context.getVariable("error.reason.phrase"));
		context.setVariable("error.header.Content-Type", "application/json");
		var util = new Utility();
		/*If the response received from client is not json format then create json respone form default apigee variables*/
		if(!util.isJsonString(context.getVariable("response.content"))) {
    		var jsonResponse = {};
    		//var faultName = context.getVariable("fault.name");
    		jsonResponse.code = context.getVariable("error.status.code");
    		jsonResponse.message = context.getVariable("error.message");
    		jsonResponse = JSON.stringify(jsonResponse);
    		context.setVariable("error.content", jsonResponse);	
		}
	};
}

	
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



