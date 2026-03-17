function __method_wrapper__() {
  it("black pixel", () => {
    var blackpixel = new Uint8ClampedArray([0, 0, 0, 255]);
    var blackpixelData = {
      data: blackpixel,
      width: 1,
      height: 1
    };

    const doc = new jsPDF({
      orientation: "p",
      unit: "pt",
      format: "a4",
      floatPrecision: 2
    });
    doc.addImage(blackpixelData, "RGBA", 15, 40, 1, 1);

    comparePdf(doc.output(), "blackpixel_rgba.pdf", "addimage");
  });

}
