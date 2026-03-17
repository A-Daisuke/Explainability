  var encode = function encode(cp, data, ofmt) {
    if(cp === last_cp && last_enc) { return last_enc(data, ofmt); }
    if(cpecache[cp]) { last_enc = cpecache[last_cp=cp]; return last_enc(data, ofmt); }
    if(has_buf && Buffer.isBuffer(data)) data = data.toString('utf8');
    var len = data.length;
    var out = has_buf ? Buffer.allocUnsafe(4*len) : [], w=0, i=0, j = 0, ww=0;
    var C = cpt[cp], E, M = "";
    var isstr = typeof data === 'string';
    if(C && (E=C.enc)) for(i = 0; i < len; ++i, ++j) {
      w = E[isstr? data.charAt(i) : data[i]];
      if(w > 255) {
        out[j] = w>>8;
        out[++j] = w&255;
      } else out[j] = w&255;
    }
    else if((M=magic[cp])) switch(M) {
      case "utf8":
        if(has_buf && isstr) { out = Buffer_from(data, M); j = out.length; break; }
        for(i = 0; i < len; ++i, ++j) {
          w = isstr ? data.charCodeAt(i) : data[i].charCodeAt(0);
          if(w <= 0x007F) out[j] = w;
          else if(w <= 0x07FF) {
            out[j]   = 192 + (w >> 6);
            out[++j] = 128 + (w&63);
          } else if(w >= 0xD800 && w <= 0xDFFF) {
            w -= 0xD800;
            ww = (isstr ? data.charCodeAt(++i) : data[++i].charCodeAt(0)) - 0xDC00 + (w << 10);
            out[j]   = 240 + ((ww>>>18) & 0x07);
            out[++j] = 144 + ((ww>>>12) & 0x3F);
            out[++j] = 128 + ((ww>>>6) & 0x3F);
            out[++j] = 128 + (ww & 0x3F);
          } else {
            out[j]   = 224 + (w >> 12);
            out[++j] = 128 + ((w >> 6)&63);
            out[++j] = 128 + (w&63);
          }
        }
        break;
      case "ascii":
        if(has_buf && typeof data === "string") { out = Buffer_from(data, M); j = out.length; break; }
        for(i = 0; i < len; ++i, ++j) {
          w = isstr ? data.charCodeAt(i) : data[i].charCodeAt(0);
          if(w <= 0x007F) out[j] = w;
          else throw new Error("bad ascii " + w);
        }
        break;
      case "utf16le":
        if(has_buf && typeof data === "string") { out = Buffer_from(data, M); j = out.length; break; }
        for(i = 0; i < len; ++i) {
          w = isstr ? data.charCodeAt(i) : data[i].charCodeAt(0);
          out[j++] = w&255;
          out[j++] = w>>8;
        }
        break;
      case "utf16be":
        for(i = 0; i < len; ++i) {
          w = isstr ? data.charCodeAt(i) : data[i].charCodeAt(0);
          out[j++] = w>>8;
          out[j++] = w&255;
        }
        break;
      case "utf32le":
        for(i = 0; i < len; ++i) {
          w = isstr ? data.charCodeAt(i) : data[i].charCodeAt(0);
          if(w >= 0xD800 && w <= 0xDFFF) w = 0x10000 + ((w - 0xD800) << 10) + (data[++i].charCodeAt(0) - 0xDC00);
          out[j++] = w&255; w >>= 8;
          out[j++] = w&255; w >>= 8;
          out[j++] = w&255; w >>= 8;
          out[j++] = w&255;
        }
        break;
      case "utf32be":
        for(i = 0; i < len; ++i) {
          w = isstr ? data.charCodeAt(i) : data[i].charCodeAt(0);
          if(w >= 0xD800 && w <= 0xDFFF) w = 0x10000 + ((w - 0xD800) << 10) + (data[++i].charCodeAt(0) - 0xDC00);
          out[j+3] = w&255; w >>= 8;
          out[j+2] = w&255; w >>= 8;
          out[j+1] = w&255; w >>= 8;
          out[j] = w&255;
          j+=4;
        }
        break;
      case "utf7":
        for(i = 0; i < len; i++) {
          var c = isstr ? data.charAt(i) : data[i].charAt(0);
          if(c === "+") { out[j++] = 0x2b; out[j++] = 0x2d; continue; }
          if(SetD.indexOf(c) > -1) { out[j++] = c.charCodeAt(0); continue; }
          var tt = encode(1201, c);
          out[j++] = 0x2b;
          out[j++] = BM.charCodeAt(tt[0]>>2);
          out[j++] = BM.charCodeAt(((tt[0]&0x03)<<4) + ((tt[1]||0)>>4));
          out[j++] = BM.charCodeAt(((tt[1]&0x0F)<<2) + ((tt[2]||0)>>6));
          out[j++] = 0x2d;
        }
        break;
      default: throw new Error("Unsupported magic: " + cp + " " + magic[cp]);
    }
    else throw new Error("Unrecognized CP: " + cp);
    out = out.slice(0,j);
    if(!has_buf) return (ofmt == 'str') ? (out).map(sfcc).join("") : out;
    if(!ofmt || ofmt === 'buf') return out;
    if(ofmt !== 'arr') return out.toString('binary');
    return [].slice.call(out);
  };
