function __method_wrapper__() {
  test('shuntingYard()', () => {
    {
      // https://en.wikipedia.org/wiki/Shunting_yard_algorithm#Detailed_examples
      const rpn = shuntingYard('3 + 4 * 2 / ( 1 - 5 ) ^ 2 ^ 3'.split(' '));
      expect(rpn).toEqual([
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
      ]);
    }

    {
      // https://en.wikipedia.org/wiki/Shunting_yard_algorithm#Detailed_examples
      const rpn = shuntingYard('sin ( max ( 2 3 ) / 3 * 3.14 )'.split(' '));
      expect(rpn).toEqual(['2', '3', 'max', '3', '/', '3.14', '*', 'sin']);
    }

    // Parentheses mismatch
    expect(() => shuntingYard(['('])).toThrow('Parentheses mismatch');
    expect(() => shuntingYard([')'])).toThrow('Parentheses mismatch');
    expect(() => shuntingYard('1 - ( 2 * 3 ) )'.split(' '))).toThrow(
      'Parentheses mismatch'
    );
    expect(() => shuntingYard('1 - ( 2 * 3 ) ) + 4'.split(' '))).toThrow(
      'Parentheses mismatch'
    );

    // Ignore ','
    expect(shuntingYard('max ( 1 , 2 )'.split(' '))).toEqual(['1', '2', 'max']);

    // if the token is: ',':
    //   while the operator at the top of the operator stack is not a left parenthesis:
    //     pop the operator from the operator stack into the output queue
    expect(shuntingYard('max ( 0 + 1 , 2 )'.split(' '))).toEqual([
      '0',
      '1',
      '+',
      '2',
      'max',
    ]);

    // Misplaced ','
    expect(() => shuntingYard('1 , 2'.split(' '))).toThrow("Misplaced ','");
    expect(() => shuntingYard(', 1 / 2'.split(' '))).toThrow("Misplaced ','");
    expect(() => shuntingYard('1 , / 2'.split(' '))).toThrow("Misplaced ','");
    expect(() => shuntingYard('1 / , 2'.split(' '))).toThrow("Misplaced ','");
    expect(() => shuntingYard('1 / 2 ,'.split(' '))).toThrow("Misplaced ','");
    expect(() =>
      shuntingYard(
        'sin ( , max , ( , 2 , 3 , ) , / , 3 , * , 3.14 , )'.split(' ')
      )
    ).not.toThrow();

    // Edge cases
    expect(shuntingYard([''])).toEqual(['']);
    expect(shuntingYard([' '])).toEqual([' ']);
    expect(shuntingYard(['1'])).toEqual(['1']);
    expect(shuntingYard(['a'])).toEqual(['a']);
    expect(shuntingYard(['1a'])).toEqual(['1a']);
    expect(shuntingYard(['*'])).toEqual(['*']);
    expect(shuntingYard(['/'])).toEqual(['/']);

    // All together expression
    expect(
      shuntingYard(
        '( ( 3.1 + cos ( -4 ) / 2 ) * max ( -6 , 6 ) ^ sin ( 6 ) * 9 ) / tan ( log ( 8.8 + -2 ) % 7 ) + ( 6 * -1 - min ( 6 , -4.2 ) )'.split(
          ' '
        )
      )
    ).toEqual(
      '3.1 -4 cos 2 / + -6 6 max 6 sin ^ * 9 * 8.8 -2 + log 7 % tan / 6 -1 * 6 -4.2 min - +'.split(
        ' '
      )
    );
  });

}
