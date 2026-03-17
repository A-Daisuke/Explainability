function __method_wrapper__() {
  return new Promise((resolve, reject) => {

    $.get('php/server/query_json.php', { file: 'table_devices.json', nocache: Date.now() }, function(data) {    
        
        // console.log(data)

        devicesListAll_JSON = data["data"]

        devicesListAll_JSON_str = JSON.stringify(devicesListAll_JSON)

        if(devicesListAll_JSON_str == "")
        {
          showSpinner()

          setTimeout(() => {
            cacheDevices()
          }, 1000);
        }
        // console.log(devicesListAll_JSON_str);

        setCache('devicesListAll_JSON', devicesListAll_JSON_str)

        // console.log(getCache('devicesListAll_JSON'))
      }).then(() => handleSuccess('cacheDevices', resolve())).catch(() => handleFailure('cacheDevices', reject("cacheDevices already completed"))); // handle AJAX synchronization
    } 

}
