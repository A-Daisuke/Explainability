function __method_wrapper__() {
  it("ASCII printable characters to pdf name", ()=>{
    expect(toPDFName(" ")).toBe("#20");
    expect(toPDFName("!")).toBe("!");
    expect(toPDFName("#")).toBe("#23");
    expect(toPDFName("$")).toBe("$");
    expect(toPDFName("%")).toBe("#25");
    expect(toPDFName("&")).toBe("&");
    expect(toPDFName("'")).toBe("'");
    expect(toPDFName("(")).toBe("#28");
    expect(toPDFName(")")).toBe("#29");
    expect(toPDFName("*")).toBe("*");
    expect(toPDFName("+")).toBe("+");
    expect(toPDFName(",")).toBe(",");
    expect(toPDFName("-")).toBe("-");
    expect(toPDFName(".")).toBe(".");
    expect(toPDFName("/")).toBe("#2f");
    expect(toPDFName("0123456789")).toBe("0123456789");
    expect(toPDFName(":")).toBe(":");
    expect(toPDFName(";")).toBe(";");
    expect(toPDFName("<")).toBe("#3c");
    expect(toPDFName("=")).toBe("=");
    expect(toPDFName(">")).toBe("#3e");
    expect(toPDFName("?")).toBe("?");
    expect(toPDFName("@")).toBe("@");
    expect(toPDFName("ABCDEFGHIJKLMNOPQRSTUVWXYZ")).toBe("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    expect(toPDFName("[")).toBe("#5b");
    expect(toPDFName("\\")).toBe("\\");
    expect(toPDFName("]")).toBe("#5d");
    expect(toPDFName("^")).toBe("^");
    expect(toPDFName("_")).toBe("_");
    expect(toPDFName("`")).toBe("`");
    expect(toPDFName("abcdefghijklmnopqrstuvwxyz")).toBe("abcdefghijklmnopqrstuvwxyz");
    expect(toPDFName("{")).toBe("#7b");
    expect(toPDFName("|")).toBe("|");
    expect(toPDFName("}")).toBe("#7d");
    expect(toPDFName("~")).toBe("~");
    expect(toPDFName("\u007f")).toBe("#7f");
  });

}
