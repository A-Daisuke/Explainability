function __method_wrapper__() {
    this.encode = function (image, quality // image data object
    ) {
      if (quality) setQuality(quality);

      // Initialize bit writer
      byteout = new Array();
      bytenew = 0;
      bytepos = 7;

      // Add JPEG headers
      writeWord(0xffd8); // SOI
      writeAPP0();
      writeDQT();
      writeSOF0(image.width, image.height);
      writeDHT();
      writeSOS();

      // Encode 8x8 macroblocks
      var DCY = 0;
      var DCU = 0;
      var DCV = 0;
      bytenew = 0;
      bytepos = 7;
      this.encode.displayName = "_encode_";
      var imageData = image.data;
      var width = image.width;
      var height = image.height;
      var quadWidth = width * 4;
      var x,
        y = 0;
      var r, g, b;
      var start, p, col, row, pos;
      while (y < height) {
        x = 0;
        while (x < quadWidth) {
          start = quadWidth * y + x;
          col = -1;
          row = 0;
          for (pos = 0; pos < 64; pos++) {
            row = pos >> 3; // /8
            col = (pos & 7) * 4; // %8
            p = start + row * quadWidth + col;
            if (y + row >= height) {
              // padding bottom
              p -= quadWidth * (y + 1 + row - height);
            }
            if (x + col >= quadWidth) {
              // padding right
              p -= x + col - quadWidth + 4;
            }
            r = imageData[p++];
            g = imageData[p++];
            b = imageData[p++];

            /* // calculate YUV values dynamically
            YDU[pos]=((( 0.29900)*r+( 0.58700)*g+( 0.11400)*b))-128; //-0x80
            UDU[pos]=(((-0.16874)*r+(-0.33126)*g+( 0.50000)*b));
            VDU[pos]=((( 0.50000)*r+(-0.41869)*g+(-0.08131)*b));
            */

            // use lookup table (slightly faster)
            YDU[pos] = (RGB_YUV_TABLE[r] + RGB_YUV_TABLE[g + 256 >> 0] + RGB_YUV_TABLE[b + 512 >> 0] >> 16) - 128;
            UDU[pos] = (RGB_YUV_TABLE[r + 768 >> 0] + RGB_YUV_TABLE[g + 1024 >> 0] + RGB_YUV_TABLE[b + 1280 >> 0] >> 16) - 128;
            VDU[pos] = (RGB_YUV_TABLE[r + 1280 >> 0] + RGB_YUV_TABLE[g + 1536 >> 0] + RGB_YUV_TABLE[b + 1792 >> 0] >> 16) - 128;
          }
          DCY = processDU(YDU, fdtbl_Y, DCY, YDC_HT, YAC_HT);
          DCU = processDU(UDU, fdtbl_UV, DCU, UVDC_HT, UVAC_HT);
          DCV = processDU(VDU, fdtbl_UV, DCV, UVDC_HT, UVAC_HT);
          x += 32;
        }
        y += 8;
      }

      ////////////////////////////////////////////////////////////////

      // Do the bit alignment of the EOI marker
      if (bytepos >= 0) {
        var fillbits = [];
        fillbits[1] = bytepos + 1;
        fillbits[0] = (1 << bytepos + 1) - 1;
        writeBits(fillbits);
      }
      writeWord(0xffd9); //EOI

      return new Uint8Array(byteout);
    };

}
