function __method_wrapper__() {
  it('Minimum of the given dates', () => {
    const array = [
      new Date(2017, 4, 13),
      new Date(2018, 2, 12),
      new Date(2016, 0, 10),
      new Date(2016, 0, 9),
    ];
    const n = new Date(Math.min.apply(null, array));
    expect(n).toEqual(new Date(2016, 0, 9));

    const m = moment.min(array.map(a => moment(a)));
    const d = date.min(array);
    expect(m.valueOf()).toBe(d.getTime());
    expect(d).toEqual(new Date(2016, 0, 9));

    const luxon = DateTime.min(
      ...array.map(a => DateTime.fromJSDate(a))
    ).toJSDate();
    expect(luxon).toEqual(new Date(2016, 0, 9));
  });

}
