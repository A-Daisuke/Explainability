function __method_wrapper__() {
  test('reversePolishNotation()', () => {
    // https://rosettacode.org/wiki/Parsing/RPN_calculator_algorithm#JavaScript
    expect(
      evalReversePolishNotation([
        '3',
        '4',
        '2',
        '*',
        '1',
        '5',
        '-',
        '2',
        '3',
        '^',
        '^',
        '/',
        '+',
      ])
    ).toEqual(3 + (4 * 2) / (1 - 5) ** (2 ** 3));
    expect(
      evalReversePolishNotation([
        '3',
        '4',
        '2',
        '*',
        '1',
        '5',
        '-',
        '2',
        '3',
        '^',
        '^',
        '/',
        '+',
      ])
    ).toEqual(3.000_122_070_312_5);

    // https://en.wikipedia.org/wiki/Shunting_yard_algorithm#Detailed_examples
    expect(
      evalReversePolishNotation(['2', '3', 'max', '3', '/', '3.14', '*', 'sin'])
    ).toEqual(Math.sin((Math.max(2, 3) / 3) * 3.14));
    expect(
      evalReversePolishNotation(['2', '3', 'max', '3', '/', '3.14', '*', 'sin'])
    ).toEqual(0.001_592_652_916_486_828_2);

    // Edge cases
    expect(evalReversePolishNotation([''])).toEqual(0); // :-(
    expect(evalReversePolishNotation([' '])).toEqual(0); // :-(
    expect(evalReversePolishNotation(['1'])).toEqual(1);
    expect(evalReversePolishNotation(['a'])).toBeNaN();
    expect(evalReversePolishNotation(['1a'])).toBeNaN();
    expect(evalReversePolishNotation(['*'])).toBeNaN();
    expect(evalReversePolishNotation(['/'])).toBeNaN();
    expect(() => evalReversePolishNotation(['1', '2'])).toThrow(
      'Insufficient operators'
    );

    // All together expression
    expect(
      evalReversePolishNotation(
        '3.1 -4 cos 2 / + -6 6 max 6 sin ^ * 9 * 8.8 -2 + log 7 % tan / 6 -1 * 6 -4.2 min - +'.split(
          ' '
        )
      )
    ).toEqual(
      eval(
        '((3.1 + Math.cos(-4) / 2) * Math.max(-6, 6) ** Math.sin(6) * 9) / Math.tan(Math.log(8.8 + -2) % 7) + (6 * -1 - Math.min(6, -4.2))'
      )
    );
  });

}
