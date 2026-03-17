function __method_wrapper__() {
  it('Is Same', () => {
    expect(moment('2010-10-20').isSame('2010-10-21')).toBeFalsy();
    expect(new Date(2010, 9, 20) === new Date(2010, 9, 21)).toBeFalsy();
    expect(
      date.isSameDay(new Date(2010, 9, 20), new Date(2010, 9, 21))
    ).toBeFalsy();
    expect(dayjs('2010-10-20').isSame('2010-10-21')).toBeFalsy();
    expect(
      +DateTime.fromISO('2010-10-20') === +DateTime.fromISO('2010-10-21')
    ).toBeFalsy();

    expect(moment('2010-10-20').isSame('2010-10-21', 'month')).toBeTruthy();
    expect(
      new Date(2010, 9, 20).valueOf() === new Date(2010, 9, 20).valueOf()
    ).toBeTruthy();
    expect(
      new Date(2010, 9, 20).getTime() === new Date(2010, 9, 20).getTime()
    ).toBeTruthy();
    expect(
      new Date(2010, 9, 20).valueOf() === new Date(2010, 9, 20).getTime()
    ).toBeTruthy();
    expect(
      new Date(2010, 9, 20).toDateString().substring(4, 7) ===
        new Date(2010, 9, 21).toDateString().substring(4, 7)
    ).toBeTruthy();
    expect(
      date.isSameMonth(new Date(2010, 9, 20), new Date(2010, 9, 21))
    ).toBeTruthy();
    expect(
      DateTime.fromISO('2010-10-20').hasSame(
        DateTime.fromISO('2010-10-21'),
        'month'
      )
    ).toBeTruthy();
  });

}
