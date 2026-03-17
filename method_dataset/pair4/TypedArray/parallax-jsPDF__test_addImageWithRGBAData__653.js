function test_addImageWithRGBAData() {
  const doc = new jsPDF();
  const rgbaData = new Uint8ClampedArray(16);
  const imageData = {
    data: rgbaData,
    width: 2,
    height: 2
  };

  doc.addImage({
    imageData: imageData,
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    compression: "FAST"
  });
}
