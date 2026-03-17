function __method_wrapper__() {
      $.get('php/server/query_json.php', { file: 'table_settings.json', nocache: Date.now() }, function(resSet) { 

        $.get('php/server/query_json.php', { file: 'plugins.json', nocache: Date.now() }, function(resPlug) {
       
          pluginsData = resPlug["data"]; 
          settingsData = resSet["data"];  

          settingsData.forEach((set) => {  

            resolvedOptions = createArray(set.setOptions)
            resolvedOptionsOld = resolvedOptions
            setPlugObj     = {};
            options_params = [];
            resolved = ""
          
            // proceed only if first option item contains something to resolve
            if( !set.setKey.includes("__metadata") && 
                resolvedOptions.length != 0 && 
                resolvedOptions[0].includes("{value}"))
            {
              // get setting definition from the plugin config if available
              setPlugObj = getPluginSettingObject(pluginsData, set.setKey)

              // check if options contains parameters and resolve 
              if(setPlugObj != {} && setPlugObj["options_params"])
              {
                // get option_params for {value} resolution
                options_params = setPlugObj["options_params"]      

                if(options_params != [])
                {
                  // handles only strings of length == 1

                  resolved = resolveParams(options_params, resolvedOptions[0])

                  if(resolved.includes('"')) // check if list of strings
                  {
                    resolvedOptions = `[${resolved}]`
                  } else // one value only
                  { 
                    resolvedOptions = `["${resolved}"]`
                  }                  
                }
              }    
            }

            setCache(`nax_set_${set.setKey}`, set.setValue)             
            setCache(`nax_set_opt_${set.setKey}`, resolvedOptions) 
          });
        }).then(() => handleSuccess('cacheSettings', resolve())).catch(() => handleFailure('cacheSettings', reject("cacheSettings already completed")));    // handle AJAX synchronization
      })

}
