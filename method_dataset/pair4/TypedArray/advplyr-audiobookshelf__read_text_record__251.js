class __C__ {
  read_text_record(i) {
    var flags = this.mobi_header.extra_flags;
    var begin = this.reclist[i].offset;
    var end = this.reclist[i + 1].offset;

    var data = new Uint8Array(this.buffer.slice(begin, end));
    var ex = this.get_record_extrasize(data, flags);

    data = new Uint8Array(this.buffer.slice(begin, end - ex));
    if (this.palm_header.compression === 2) {
      var buffer = uncompression_lz77(data);
      return buffer.shrink();
    } else {
      return data;
    }
  }

}
