function test_font_metrics_based_line_sizing_split() {
  const pdf = new jsPDF("p", "in", "letter");
  const sizes: number[] = [12, 16, 20];
  const fonts = [
    ["Times", "Roman"],
    ["Helvetica", ""],
    ["Times", "Italic"]
  ];
  let font: string[];
  let size: number;
  let lines: any[];
  let verticalOffset = 0.5; // inches on a 8.5 x 11 inch sheet.
  const loremipsum = "Lorem ipsum dolor sit amet, ...";
  for (const i in fonts) {
    if (fonts.hasOwnProperty(i)) {
      font = fonts[i];
      size = sizes[i];
      lines = pdf
        .setFont(font[0], font[1])
        .setFontSize(size)
        .splitTextToSize(loremipsum, 7.5);
      pdf.text(lines, 0.5, verticalOffset + size / 72);
      verticalOffset += ((lines.length + 0.5) * size) / 72;
    }
  }
  pdf.save("Test.pdf");
}
