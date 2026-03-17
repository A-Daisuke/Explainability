function __method_wrapper__() {
  buildFragmentString = function(pdfParams) {
    var string = "",
      prop;

    if (pdfParams) {
      for (prop in pdfParams) {
        if (pdfParams.hasOwnProperty(prop)) {
          string +=
            encodeURIComponent(prop) +
            "=" +
            encodeURIComponent(pdfParams[prop]) +
            "&";
        }
      }

      //The string will be empty if no PDF Params found
      if (string) {
        string = "#" + string;

        //Remove last ampersand
        string = string.slice(0, string.length - 1);
      }
    }

    return string;
  };

}
