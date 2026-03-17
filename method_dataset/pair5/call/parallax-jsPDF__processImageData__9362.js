    var processImageData = function processImageData(imageData, format, alias, compression) {
      var result, dataAsBinaryString;
      if (typeof imageData === "string" && getImageFileTypeByImageData(imageData) === UNKNOWN) {
        imageData = unescape(imageData);
        var tmpImageData = convertBase64ToBinaryString(imageData, false);
        if (tmpImageData !== "") {
          imageData = tmpImageData;
        } else {
          tmpImageData = jsPDFAPI.loadFile(imageData, true);
          if (tmpImageData !== undefined) {
            imageData = tmpImageData;
          }
        }
      }
      if (isDOMElement(imageData)) {
        imageData = getImageDataFromElement(imageData, format);
      }
      format = getImageFileTypeByImageData(imageData, format);
      if (!isImageTypeSupported(format)) {
        throw new Error("addImage does not support files of type '" + format + "', please ensure that a plugin for '" + format + "' support is added.");
      }

      // now do the heavy lifting

      if (notDefined(alias)) {
        alias = generateAliasFromImageData(imageData);
      }
      result = checkImagesForAlias.call(this, alias);
      if (!result) {
        // no need to convert if imageData is already uint8array
        if (!(imageData instanceof Uint8Array) && format !== "RGBA") {
          dataAsBinaryString = imageData;
          imageData = binaryStringToUint8Array(imageData);
        }
        result = this["process" + format.toUpperCase()](imageData, getImageIndex.call(this), alias, checkCompressValue(compression), dataAsBinaryString);
      }
      if (!result) {
        throw new Error("An unknown error occurred whilst processing the image.");
      }
      return result;
    };
