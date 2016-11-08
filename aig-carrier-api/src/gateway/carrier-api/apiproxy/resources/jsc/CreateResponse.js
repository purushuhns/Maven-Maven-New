 //Convert the response to the expected UI json response
 
 var targetResponse = JSON.parse(context.getVariable("response.content"));
 var pathsuffix = context.getVariable("proxy.pathsuffix");
 var attribute = '';
 var list =[];
 var type='';
 var responseJSON = {};
 
 
 if (pathsuffix=="/airlines"){
        attribute = "airlines";
        type="carrier";
  }else if (pathsuffix=="/cruiselines"){
        attribute = "cruiseLines";
        type="carrier";
  }else if (pathsuffix=="/carrentals"){
        attribute = "carRentals";
        type="carrier";
  }else if (pathsuffix=="/touroperators"){
        attribute = "tourOperators";
        type="carrier";
  }else if (pathsuffix=="/financialdefaults"){
        attribute = "financialDefault";
        type="action";
  }else if (pathsuffix=="/nocoverages"){
        attribute = "noCoverage";
        type="action";
  }else if (pathsuffix=="/strikes"){
        attribute = "airlineStrikeList";
        type="action";
  }else{
    attribute = "";
    type="";
  }
  
if (context.getVariable("is.error")===false){
 if(type=="carrier" && targetResponse !== null && targetResponse !== undefined){
  var carrierList = targetResponse.Envelope.Body.GetSimpleCarrierListResponse.GetSimpleCarrierListResult.SimpleCarrier;
            if (carrierList !== null && carrierList !== undefined)
            responseJSON[attribute] = getCarrierList();
  }else if (type=="action" && targetResponse !== null && targetResponse !== undefined){
  var actionList = targetResponse.Envelope.Body.GetSimpleActionsListResponse.GetSimpleActionsListResult.SimpleAction;
        if (actionList !== null && actionList !== undefined)
            responseJSON[attribute] = getActionList();
  }}else{
      responseJSON = getErrorResponse();
  }

function getErrorResponse(){
    responseJSON.code = context.getVariable("error.status.code");
    responseJSON.message= targetResponse.Envelope.Body.Fault.Reason.Text.content;
    return responseJSON;
}
 
 function getCarrierList(){
 for (var i=0;i<carrierList.length;i++){
     var carrier = {};
     carrier.id = carrierList[i].Code;
     carrier.name = carrierList[i].Name;
     list.push(carrier);
 }
 return list;
 }
 
 function getActionList(){
 for (var i=0;i<actionList.length;i++){
        var action = {};
        action.effectiveDate = actionList[i].BeginDate;
        if (pathsuffix=="/strikes"){
            action.airline = actionList[i].CarrierName;
            action.endDate = actionList[i].EndDate;
        }else if(pathsuffix=="/financialdefaults" || pathsuffix=="/nocoverages"){
            action.company = actionList[i].CarrierName;
        }
     list.push(action);
 }
 return list;
 }
 
 context.setVariable("response.content",JSON.stringify(responseJSON));