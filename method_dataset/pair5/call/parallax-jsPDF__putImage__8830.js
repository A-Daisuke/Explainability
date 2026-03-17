    var putImage = function putImage(image) {
      var out = this.internal.write;
      var putStream = this.internal.putStream;
      var getFilters = this.internal.getFilters;
      var filter = getFilters();
      while (filter.indexOf("FlateEncode") !== -1) {
        filter.splice(filter.indexOf("FlateEncode"), 1);
      }
      image.objectId = this.internal.newObject();
      var additionalKeyValues = [];
      additionalKeyValues.push({
        key: "Type",
        value: "/XObject"
      });
      additionalKeyValues.push({
        key: "Subtype",
        value: "/Image"
      });
      additionalKeyValues.push({
        key: "Width",
        value: image.width
      });
      additionalKeyValues.push({
        key: "Height",
        value: image.height
      });
      if (image.colorSpace === color_spaces.INDEXED) {
        additionalKeyValues.push({
          key: "ColorSpace",
          value: "[/Indexed /DeviceRGB " + (
          // if an indexed png defines more than one colour with transparency, we've created a sMask
          image.palette.length / 3 - 1) + " " + ("sMask" in image && typeof image.sMask !== "undefined" ? image.objectId + 2 : image.objectId + 1) + " 0 R]"
        });
      } else {
        additionalKeyValues.push({
          key: "ColorSpace",
          value: "/" + image.colorSpace
        });
        if (image.colorSpace === color_spaces.DEVICE_CMYK) {
          additionalKeyValues.push({
            key: "Decode",
            value: "[1 0 1 0 1 0 1 0]"
          });
        }
      }
      additionalKeyValues.push({
        key: "BitsPerComponent",
        value: image.bitsPerComponent
      });
      if ("decodeParameters" in image && typeof image.decodeParameters !== "undefined") {
        additionalKeyValues.push({
          key: "DecodeParms",
          value: "<<" + image.decodeParameters + ">>"
        });
      }
      if ("transparency" in image && Array.isArray(image.transparency) && image.transparency.length > 0) {
        var transparency = "",
          i = 0,
          len = image.transparency.length;
        for (; i < len; i++) {
          transparency += image.transparency[i] + " " + image.transparency[i] + " ";
        }
        additionalKeyValues.push({
          key: "Mask",
          value: "[" + transparency + "]"
        });
      }
      if (typeof image.sMask !== "undefined") {
        additionalKeyValues.push({
          key: "SMask",
          value: image.objectId + 1 + " 0 R"
        });
      }
      var alreadyAppliedFilters = typeof image.filter !== "undefined" ? ["/" + image.filter] : undefined;
      putStream({
        data: image.data,
        additionalKeyValues: additionalKeyValues,
        alreadyAppliedFilters: alreadyAppliedFilters,
        objectId: image.objectId
      });
      out("endobj");

      // Soft mask
      if ("sMask" in image && typeof image.sMask !== "undefined") {
        var _image$sMaskBitsPerCo;
        var sMaskBitsPerComponent = (_image$sMaskBitsPerCo = image.sMaskBitsPerComponent) !== null && _image$sMaskBitsPerCo !== void 0 ? _image$sMaskBitsPerCo : image.bitsPerComponent;
        var sMask = {
          width: image.width,
          height: image.height,
          colorSpace: "DeviceGray",
          bitsPerComponent: sMaskBitsPerComponent,
          data: image.sMask
        };
        if ("filter" in image) {
          sMask.decodeParameters = "/Predictor ".concat(image.predictor, " /Colors 1 /BitsPerComponent ").concat(sMaskBitsPerComponent, " /Columns ").concat(image.width);
          sMask.filter = image.filter;
        }
        putImage.call(this, sMask);
      }

      //Palette
      if (image.colorSpace === color_spaces.INDEXED) {
        var objId = this.internal.newObject();
        //out('<< /Filter / ' + img['f'] +' /Length ' + img['pal'].length + '>>');
        //putStream(zlib.compress(img['pal']));
        putStream({
          data: arrayBufferToBinaryString(new Uint8Array(image.palette)),
          objectId: objId
        });
        out("endobj");
      }
    };
