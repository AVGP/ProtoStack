var listAsOptions = function(item) {
    console.log(item);
  return "<option value=" + item.id + ">" + item.name + "</option>";
};

var listAsItems = function(item) {
    console.log(item);
  return "<li>" + item.name + " <a href=\"#\" onclick=\"showInfo(" + item.id + ")\">[INFO]</a></li>"; 
};

var listAvailableOptionsFor = function(apiClient, jobName, outputElementId, responsePropertyName, params, displayFunc, responseCallback) {
  apiClient.exec(jobName, params || {}, function(err, res) {
    console.log(err, res);
    if(err) {
      alert("ERROR: " + err.message)
      return
    }
      
    if(!displayFunc) displayFunc = listAsOptions;
      
    var listElem = document.getElementById(outputElementId);
    for(var i=0, len=res[responsePropertyName].length;i<len;i++) {
      var item = res[responsePropertyName][i];
      listElem.innerHTML += displayFunc.call(this, item);
    }
      
    if(responseCallback) responseCallback(res);
  });
};

document.getElementById("connect").addEventListener("click", function() {
  connectAPI(document.getElementById("url").value, document.getElementById("key").value, document.getElementById("secret").value, function(apiClient) {
    
    var vms = [];
      
    listAvailableOptionsFor(apiClient, "listTemplates", "templates", "template", {templatefilter: "executable"});
    listAvailableOptionsFor(apiClient, "listZones", "zones", "zone");
    listAvailableOptionsFor(apiClient, "listNetworks", "networks", "network");
    listAvailableOptionsFor(apiClient, "listServiceOfferings", "services", "serviceoffering");
    listAvailableOptionsFor(apiClient, "listVirtualMachines", "vms", "virtualmachine", {}, listAsItems, function(vms) {
      vms = vms;
      window.showInfo = function(vmID) {
        var vmState = null;
        for(var i=0;i<vms.length;i++) {
          if(vms[i].id == vmID) {
            vmState = vms[i];
            break;
          }
        }
        var content = "<h2>" + vmState.displayName + "</h2>"
        if(vmState.nic && vmState.nic[0]) content += "<p>IP: " + vmState.nic[0].ipaddress + "</p>";
        document.getElementById("vmstate").innerHTML = content;
      }
    });
      
    document.getElementById("deploy").addEventListener("click", function() {
      var vmOpts = {
        serviceofferingid: document.getElementById("services").value,
        templateid: document.getElementById("templates").value,
        zoneid: document.getElementById("zones").value,
        networkids: [ document.getElementById("networks").value ]
      };
      
      if(document.getElementById("ipaddress").value != "") vmOpts.ipaddress = document.getElementById("ipaddress").value;
        
      apiClient.exec("deployVirtualMachine", vmOpts, function(err, res) {
        console.log(err, res);
        setTimeout(function queryJobState() {
          apiClient.exec("listAsyncJobStatus", { jobid: res.jobid }, function(err, jobState) {
            console.log(err, res);
            if(err) {
              console.log(err);
              return;
            }
              
            var listElem = document.getElementById("vms");
            var vmInfo = jobState.jobresult.virtualmachine;
            listElem.innerHTML += "<li>" + vmInfo.displayname + "(" + vmInfo.nic[0].ipaddress + ")" + "</li>";
            //if the job is still pending, rerun this!
            if(res.jobstatus == 0) setTimeout(queryJobState, 1000);
          });
        }, 1000);
      });
    });
  });
});