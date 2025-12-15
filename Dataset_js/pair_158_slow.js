var VAR_1 = "foo",
  VAR_2 = "bar",
  VAR_3 = "FOO",
  VAR_4 = "BAR";
var VAR_5 = /(foo|bar)/,
  VAR_6 = {
    KEY_1: 1,
    KEY_2: 1,
  };
var VAR_7 = /(foo|bar)/i,
  VAR_8 = {
    KEY_3: 1,
    KEY_4: 1,
    KEY_5: 1,
    KEY_6: 1,
  };
var VAR_9 = "foo",
  VAR_10 = "baz",
  VAR_11 = "Foo";
VAR_9 == VAR_1 || VAR_9 == VAR_2 || VAR_9 == VAR_3 || VAR_9 == VAR_4;
VAR_10 == VAR_1 || VAR_10 == VAR_2 || VAR_10 == VAR_3 || VAR_10 == VAR_4;
VAR_11 == VAR_1 || VAR_11 == VAR_2 || VAR_11 == VAR_3 || VAR_11 == VAR_4;
