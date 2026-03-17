    var putInfo = API.__private__.putInfo = function () {
      var objectId = newObject();
      var encryptor = function encryptor(data) {
        return data;
      };
      if (encryptionOptions !== null) {
        encryptor = encryption.encryptor(objectId, 0);
      }
      out("<<");
      out("/Producer (" + pdfEscape(encryptor("jsPDF " + jsPDF.version)) + ")");
      for (var key in documentProperties) {
        if (documentProperties.hasOwnProperty(key) && documentProperties[key]) {
          out("/" + key.substr(0, 1).toUpperCase() + key.substr(1) + " (" + pdfEscape(encryptor(documentProperties[key])) + ")");
        }
      }
      out("/CreationDate (" + pdfEscape(encryptor(creationDate)) + ")");
      out(">>");
      out("endobj");
    };
