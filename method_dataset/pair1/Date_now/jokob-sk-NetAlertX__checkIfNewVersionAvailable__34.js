function checkIfNewVersionAvailable()
{
  $.get('php/server/query_json.php', { file: 'app_state.json', nocache: Date.now() }, function(appState) {   
    
    // console.log(appState["isNewVersionChecked"])
    // console.log(appState["isNewVersion"])
    
    // cache value
    setCookie("isNewVersion", appState["isNewVersion"], 30);
    setCookie("isNewVersionChecked", appState["isNewVersionChecked"], 30);

    versionUpdateUI();

  })
}
