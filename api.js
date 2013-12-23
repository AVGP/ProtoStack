

var listAvailableOptionsFor = function(apiClient, jobName, outputElementId, responsePropertyName, params) {
  apiClient.exec(jobName, params || {}, function(err, res) {
    console.log(err, res);
    if(err) {
      alert("ERROR: " + err.message)
      return
    }
      
    var listElem = document.getElementById(outputElementId);
    for(var i=0, len=res[responsePropertyName].length;i<len;i++) {
      var item = res[responsePropertyName][i];
      listElem.innerHTML += "<option value=" + item.id + ">" + item.name + "</option>"
    }
  });
};

document.getElementById("connect").addEventListener("click", function() {
  connectAPI(document.getElementById("url").value, document.getElementById("key").value, document.getElementById("secret").value, function(apiClient) {
    
    listAvailableOptionsFor(apiClient, "listTemplates", "templates", "template", {templatefilter: "executable"});
    listAvailableOptionsFor(apiClient, "listZones", "zones", "zone");
    listAvailableOptionsFor(apiClient, "listNetworks", "networks", "network");
    listAvailableOptionsFor(apiClient, "listServiceOfferings", "services", "serviceoffering");
    
    document.getElementById("deploy").addEventListener("click", function() {
      apiClient.exec("deployVirtualMachine", {
        serviceofferingid: document.getElementById("services").value,
        templateid: document.getElementById("templates").value,
        zoneid: document.getElementById("zones").value,
        networkids: [ document.getElementById("networks").value ]  
      }, function(err, res) {
        console.log(err, res);
      });
    });
  });
});