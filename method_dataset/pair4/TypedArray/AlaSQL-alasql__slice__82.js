function __method_wrapper__() {
if(typeof ArrayBuffer !== 'undefined' && !ArrayBuffer.prototype.slice) ArrayBuffer.prototype.slice = function(start, end) {
  if(start == null) start = 0;
  if(start < 0) { start += this.byteLength; if(start < 0) start = 0; }
  if(start >= this.byteLength) return new Uint8Array(0);
  if(end == null) end = this.byteLength;
  if(end < 0) { end += this.byteLength; if(end < 0) end = 0; }
  if(end > this.byteLength) end = this.byteLength;
  if(start > end) return new Uint8Array(0);
  var out = new ArrayBuffer(end - start);
  var view = new Uint8Array(out);
  var data = new Uint8Array(this, start, end - start)
  /* IE10 should have Uint8Array#set */
  if(view.set) view.set(data); else while(start <= --end) view[end - start] = data[end];
  return out;
};

}
