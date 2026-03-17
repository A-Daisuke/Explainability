function __method_wrapper__() {
  it('Time from now', () => {
    const month3 = 1000 * 3600 * 24 * 30 * 3; // ms * hour * day * month * 3
    const timeDistance = new Date().getTime() - month3;

    moment.relativeTimeThreshold(
      'd',
      new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()
    );
    const m = moment(timeDistance).fromNow();
    const n = new Intl.RelativeTimeFormat().format(-3, 'month');
    const d = date.formatDistanceStrict(new Date(timeDistance), new Date(), {
      addSuffix: true,
    });
    const day = dayjs(timeDistance).fromNow(); // plugin
    expect(m).toBe(d);
    expect(m).toBe(day);
    expect(m).toBe(n);
  });

}
