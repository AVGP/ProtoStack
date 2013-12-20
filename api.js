document.getElementById("connect").addEventListener("click", function() {
  connectAPI(document.getElementById("key").value, document.getElementById("secret").value, function(apiClient) {
    apiClient.exec("listTemplates", {templatefilter: "executable"}, function(err, res) {
      console.log(err, res);
      if(err) {
        alert("ERROR: " + err.message)
        return
      }
      
      var listElem = document.getElementById("templates");
      for(var i=0, len=res.template.length;i<len;i++) {
        var tpl = res.template[i];
        listElem.innerHTML += "<option value=" + tpl.id + ">" + tpl.name + "</option>"
      }
    });
    
    apiClient.exec("listZones", {}, function(err, res) {
      console.log(err, res);
      if(err) {
        alert("ERROR: " + err.message)
        return
      }
      
      var listElem = document.getElementById("zones");
      for(var i=0, len=res.zone.length;i<len;i++) {
        var tpl = res.zone[i];
        listElem.innerHTML += "<option value=" + tpl.id + ">" + tpl.name + "</option>"
      }
    });

    apiClient.exec("listServiceOfferings", {}, function(err, res) {
      console.log(err, res);
      if(err) {
        alert("ERROR: " + err.message)
        return
      }
      
      var listElem = document.getElementById("services");
      for(var i=0, len=res.serviceoffering.length;i<len;i++) {
        var tpl = res.serviceoffering[i];
        listElem.innerHTML += "<option value=" + tpl.id + ">" + tpl.name + "</option>"
      }
    });
    
    document.getElementById("deploy").addEventListener("click", function() {
      apiClient.exec("deployVirtualMachine", {
        serviceofferingid: document.getElementById("services").value,
        templateid: document.getElementById("templates").value,
        zoneid: document.getElementById("zones").value
      }, function(err, res) {
        console.log(err, res);
      });
    });
  });
});

/*
var Cloudstack = require("cloudstack");

var client = new Cloudstack({
  apiUri: "https://api.exoscale.ch/compute",
  apiKey: "DyrDvwhlFk7ZpaLJBVQOMpu1PpnHF12dD8GsKsUxq1CxmUZobgdXhGSL6rUvy4h8a5lYvx5QNyjEKWUbX2FlVw",
  apiSecret: "bUJ434BnwQ1b1603xYCLxrSrxSghazNnB0dkE7FEjeZJ3C03fgfwyNTdXamKYmfrWEpDP7DJkeODcr82fNjkww"
});

client.exec("listTemplates", {templatefilter: "executable"}, function(err, res) {
  console.log(err, res);
});
*/