function __method_wrapper__() {
test("DateTime.fromFormat() with setZone parses fixed offsets and sets it", () => {
  const formats = [
    ["Z", "-4"],
    ["ZZ", "-4:00"],
    ["ZZZ", "-0400"],
  ];

  for (const i in formats) {
    if (Object.prototype.hasOwnProperty.call(formats, i)) {
      const [format, example] = formats[i],
        dt = DateTime.fromFormat(
          `1982/05/25 09:10:11.445 ${example}`,
          `yyyy/MM/dd HH:mm:ss.SSS ${format}`,
          { setZone: true }
        );
      expect(dt.offset).toBe(-4 * 60);
      expect(dt.toUTC().hour).toBe(13);
      expect(dt.toUTC().minute).toBe(10);
    }
  }
});

}
