function __method_wrapper__() {
                  cmap.forEach(function(charCode, token) {
                    var str = [];

                    for (var k = 0; k < token.length; k += 2) {
                      var w1 =
                        (token.charCodeAt(k) << 8) | token.charCodeAt(k + 1);

                      if ((w1 & 0xf800) !== 0xd800) {
                        str.push(w1);
                        continue;
                      }

                      k += 2;
                      var w2 =
                        (token.charCodeAt(k) << 8) | token.charCodeAt(k + 1);
                      str.push(((w1 & 0x3ff) << 10) + (w2 & 0x3ff) + 0x10000);
                    }

                    map[charCode] = String.fromCodePoint.apply(String, str);
                  });

}
