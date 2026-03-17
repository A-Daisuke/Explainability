function __method_wrapper__() {
  it('Maximum of the given dates', () => {
    const array = [
      new Date(2017, 4, 13),
      new Date(2018, 2, 12),
      new Date(2016, 0, 10),
      new Date(2016, 0, 9),
    ];
    const m = moment.max(array.map(a => moment(a)));
    const d = date.max(array);
    expect(m.valueOf()).toBe(d.getTime());
    expect(d).toEqual(new Date(2018, 2, 12));

    const n = new Date(Math.max.apply(null, array));
    expect(n).toEqual(new Date(2018, 2, 12));

    const luxon = DateTime.max(
      ...array.map(a => DateTime.fromJSDate(a))
    ).toJSDate();
    expect(luxon).toEqual(new Date(2018, 2, 12));
  });

}
