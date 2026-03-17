var copagesne_uint8array = function (buffers) {
  var total_size = 0;
  for (let i = 0; i < buffers.length; i++) {
    var buffer = buffers[i];
    total_size += buffer.length;
  }
  var total_buffer = new Uint8Array(total_size);
  var offset = 0;
  for (let i = 0; i < buffers.length; i++) {
    buffer = buffers[i];
    total_buffer.set(buffer, offset);
    offset += buffer.length;
  }
  return total_buffer;
};
