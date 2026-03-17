function __method_wrapper__() {
  test('tokenize()', () => {
    // https://en.wikipedia.org/wiki/Shunting_yard_algorithm#Detailed_examples
    expect(tokenize('3 + 4 * 2 / (1 - 5) ^ 2 ^ 3')).toEqual(
      '3 + 4 * 2 / ( 1 - 5 ) ^ 2 ^ 3'.split(' ')
    );

    // https://en.wikipedia.org/wiki/Shunting_yard_algorithm#Detailed_examples
    expect(tokenize('sin(max(2, 3) / 3 * 3.14)')).toEqual(
      'sin ( max ( 2 , 3 ) / 3 * 3.14 )'.split(' ')
    );

    expect(tokenize('1+2')).toEqual(['1', '+', '2']);
    expect(tokenize('min(1,2)')).toEqual(['min', '(', '1', ',', '2', ')']);
    expect(tokenize('1.1+2.2')).toEqual(['1.1', '+', '2.2']);
    expect(tokenize('min(1.1,2.2)')).toEqual([
      'min',
      '(',
      '1.1',
      ',',
      '2.2',
      ')',
    ]);

    // Decimals
    expect(tokenize('1.1 + 2.2 - 3.3 * 4.4 / 5.5 % 6.6 ^ 7.7')).toEqual(
      '1.1 + 2.2 - 3.3 * 4.4 / 5.5 % 6.6 ^ 7.7'.split(' ')
    );

    // White spaces
    expect(tokenize('')).toEqual([]);
    expect(tokenize(' ')).toEqual([]);
    expect(tokenize(' 1  +  2 ')).toEqual(['1', '+', '2']);
    expect(tokenize('1 \n + \n 2')).toEqual(['1', '+', '2']);
    expect(tokenize('1 \t + \t 2')).toEqual(['1', '+', '2']);

    // Single number
    expect(tokenize('0')).toEqual(['0']);
    expect(tokenize('1')).toEqual(['1']);
    expect(tokenize('-0')).toEqual(['-0']);
    expect(tokenize('-1')).toEqual(['-1']);
    expect(tokenize('(1)')).toEqual(['(', '1', ')']);
    expect(tokenize('(-1)')).toEqual(['(', '-1', ')']);
    expect(tokenize('-(1)')).toEqual(['0', '-', '(', '1', ')']);

    // Starting with +/-
    expect(tokenize('+0')).toEqual(['+0']);
    expect(tokenize('+ 0')).toEqual(['0', '+', '0']);
    expect(tokenize('-0')).toEqual(['-0']);
    expect(tokenize('- 0')).toEqual(['0', '-', '0']);
    expect(tokenize('+1')).toEqual(['+1']);
    expect(tokenize('+ 1')).toEqual(['0', '+', '1']);
    expect(tokenize('-1')).toEqual(['-1']);
    expect(tokenize('- 1')).toEqual(['0', '-', '1']);
    expect(tokenize('+1 + 1')).toEqual(['+1', '+', '1']);
    expect(tokenize('+ 1 + 1')).toEqual(['0', '+', '1', '+', '1']);
    expect(tokenize('-1 + 1')).toEqual(['-1', '+', '1']);
    expect(tokenize('- 1 + 1')).toEqual(['0', '-', '1', '+', '1']);
    expect(tokenize('+')).toEqual(['0', '+']);
    expect(tokenize('-')).toEqual(['0', '-']);

    // Do not confuse '+1' / '-1' with 'x + 1' / 'x - 1' depending on the context
    expect(tokenize('(1+2)+1')).toEqual(['(', '1', '+', '2', ')', '+', '1']);
    expect(tokenize('(1+2)-1')).toEqual(['(', '1', '+', '2', ')', '-', '1']);
    expect(tokenize('1 + -2')).toEqual(['1', '+', '-2']);
    expect(tokenize('1+-2')).toEqual(['1', '+', '-2']);

    // Space in number
    expect(() => tokenize('1 2')).toThrow("Space in number: '1 2'");
    expect(() => tokenize('1  2')).toThrow("Space in number: '1 2'");
    expect(() => tokenize('0 + 1 / (2 3) * 4')).toThrow(
      "Space in number: '2 3'"
    );
    expect(() => tokenize('min(1 2)')).toThrow("Space in number: '1 2'");

    // Double '.' in number
    expect(() => tokenize('1+2.3.4')).toThrow("Double '.' in number: '2.3.'");
    expect(() => tokenize('1+2.3.4.5')).toThrow("Double '.' in number: '2.3.'");
    expect(() => tokenize('0 + 1 / 2.3.4 * 5')).toThrow(
      "Double '.' in number: '2.3.'"
    );
    expect(() => tokenize('min(1, 2.3.4)')).toThrow(
      "Double '.' in number: '2.3.'"
    );

    // Consecutive operators
    expect(tokenize('1++2')).toEqual(['1', '+', '+2']);
    expect(tokenize('1-+2')).toEqual(['1', '-', '+2']);
    expect(tokenize('1--2')).toEqual(['1', '-', '-2']);
    expect(() => tokenize('1++')).toThrow("Consecutive operators: '++'");
    expect(() => tokenize('1-+')).toThrow("Consecutive operators: '-+'");
    expect(() => tokenize('1--')).toThrow("Consecutive operators: '--'");
    expect(() => tokenize('1-*2')).toThrow("Consecutive operators: '-*'");
    expect(() => tokenize('0 + 1 / (2-*3) * 4')).toThrow(
      "Consecutive operators: '-*'"
    );
    expect(() => tokenize('min(1-*2, 3)')).toThrow(
      "Consecutive operators: '-*'"
    );

    // Other edge cases
    expect(tokenize('1,2')).toEqual(['1', ',', '2']);
    expect(tokenize('1+2+')).toEqual(['1', '+', '2', '+']); // :-(
    expect(() => tokenize('1+2a')).toThrow("Invalid characters: 'a'");
    expect(() => tokenize('10 Hello')).toThrow("Invalid characters: 'Hello'");
    expect(tokenize('1-.')).toEqual(['1', '-', '.']); // :-(
    expect(tokenize('*')).toEqual(['*']);
    expect(tokenize('/')).toEqual(['/']);

    // All together expression
    expect(
      tokenize(
        '((3.1 + cos(-4) / 2) * max(-6, 6) ^ sin(6) * 9) / tan(log(8.8 + -2) % 7) + (6 * -1 - min(6, -4.2))'
      )
    ).toEqual(
      '( ( 3.1 + cos ( -4 ) / 2 ) * max ( -6 , 6 ) ^ sin ( 6 ) * 9 ) / tan ( log ( 8.8 + -2 ) % 7 ) + ( 6 * -1 - min ( 6 , -4.2 ) )'.split(
        ' '
      )
    );
    expect(
      tokenize(
        '((3.1+cos(-4)/2)*max(-6,6)^sin(6)*9)/tan(log(8.8+-2)%7)+(6*-1-min(6,-4.2))'
      )
    ).toEqual(
      '( ( 3.1 + cos ( -4 ) / 2 ) * max ( -6 , 6 ) ^ sin ( 6 ) * 9 ) / tan ( log ( 8.8 + -2 ) % 7 ) + ( 6 * -1 - min ( 6 , -4.2 ) )'.split(
        ' '
      )
    );
  });

}
