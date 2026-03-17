function getRandomBytes(elem, length) {

  // Retrieve and parse custom parameters from the element
  let params = $(elem).attr("my-customparams")?.split(',').map(param => param.trim());
  if (params && params.length >= 1) {
    var targetElementID = params[0];  // Get the target element's ID
  }

  let targetElement = $('#' + targetElementID);

  // Generate random bytes
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);

  // Convert bytes to hexadecimal string
  let hexString = Array.from(array, byte => 
    byte.toString(16).padStart(2, '0')
  ).join('');

  // Format hexadecimal string with hyphens
  let formattedHex = hexString.match(/.{1,2}/g).join('-');

  console.log(formattedHex);
  // console.log($(`#${targetInput}`).val());

  // Set the formatted key value to the input field
  targetElement.val(formattedHex);
}
