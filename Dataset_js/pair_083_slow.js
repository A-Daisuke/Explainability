var VAR_1 = {};
Object.defineProperty(VAR_1, "foo", {
  KEY_1: function () {
    return 42;
  },
  KEY_2: true,
});
var VAR_2;
for (var VAR_3 = 0; VAR_3 < 100; ++VAR_3) {
  VAR_2 = VAR_1.foo;
}
