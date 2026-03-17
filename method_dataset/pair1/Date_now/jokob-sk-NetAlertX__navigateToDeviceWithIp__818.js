function navigateToDeviceWithIp (ip) {

  $.get('php/server/query_json.php', { file: 'table_devices.json', nocache: Date.now() }, function(res) {    
        
    devices = res["data"];

    mac = ""
    
    $.each(devices, function(index, obj) {
      
      if(obj.devLastIP.trim() == ip.trim())
      {
        mac = obj.devMac;

        window.open('./deviceDetails.php?mac=' + mac , "_blank");
      }
    });
    
  });
}
