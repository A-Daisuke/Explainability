function __method_wrapper__() {
  globalVar.sendReference = function(filename, data) {
    const req = new XMLHttpRequest();
    req.open("POST", `http://localhost:9090${filename}`, true);
    req.setRequestHeader("Content-Type", "text/plain; charset=x-user-defined");
    req.onload = e => {
      //console.log(e)
    };

    const uint8Array = new Uint8Array(data.length);
    for (let i = 0; i < data.length; i++) {
      uint8Array[i] = data.charCodeAt(i);
    }
    const blob = new Blob([uint8Array], {
      type: "text/plain; charset=x-user-defined"
    });

    req.send(blob);
  };

}
