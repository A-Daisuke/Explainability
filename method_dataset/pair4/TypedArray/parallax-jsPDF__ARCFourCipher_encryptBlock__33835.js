function __method_wrapper__() {
            encryptBlock: function ARCFourCipher_encryptBlock(data) {
              var i,
                n = data.length,
                tmp,
                tmp2;
              var a = this.a,
                b = this.b,
                s = this.s;
              var output = new Uint8Array(n);

              for (i = 0; i < n; ++i) {
                a = (a + 1) & 0xff;
                tmp = s[a];
                b = (b + tmp) & 0xff;
                tmp2 = s[b];
                s[a] = tmp2;
                s[b] = tmp;
                output[i] = data[i] ^ s[(tmp + tmp2) & 0xff];
              }

              this.a = a;
              this.b = b;
              return output;
            }

}
