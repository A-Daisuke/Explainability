var VAR_1 = [];
for (var VAR_2 = 0; VAR_2 < 100000; VAR_2++) {
  VAR_1.push("hello world");
}
var VAR_3 = new Map();
for (var VAR_4 = 0; VAR_2 < 100000; VAR_2++) {
  VAR_3.set(VAR_2, "hello world");
}
for (var VAR_5 of VAR_3.values()) {
  VAR_5.trim();
}
