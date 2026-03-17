function base64ToUint8Array(base64) {
  const dataURLRegex = /^data:.+;base64,/;
  if (dataURLRegex.test(base64)) {
    base64 = base64.replace(dataURLRegex, "");
  }

  const binary_string = window.atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }

  return bytes;
}
