function __method_wrapper__() {
  it("getContext contextAttributes", () => {
    var doc = new jsPDF();
    doc.canvas.getContext("2d", { pageWrapYEnabled: true });
    expect(doc.context2d.pageWrapYEnabled).toEqual(true);
    doc.canvas.height = 300;
    expect(doc.context2d.pageWrapY).toEqual(301);
    doc.canvas.getContext("2d", { pageWrapYEnabled: false });
    expect(doc.context2d.pageWrapYEnabled).toEqual(false);

    var doc = new jsPDF();
    doc.canvas.getContext("2d", { pageWrapXEnabled: true });
    expect(doc.context2d.pageWrapXEnabled).toEqual(true);
    doc.canvas.width = 150;
    expect(doc.context2d.pageWrapX).toEqual(151);
    doc.canvas.getContext("2d", { pageWrapXEnabled: false });
    expect(doc.context2d.pageWrapXEnabled).toEqual(false);
    doc.canvas.getContext("2d", { abcdefgh: true });
    expect(doc.context2d.hasOwnProperty("abcdefgh")).toEqual(false);
  });

}
