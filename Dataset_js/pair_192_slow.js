var VAR_1 = [];
var VAR_2 = {
  KEY_1: "A",
  KEY_2: [40, -55, 40, -30, 10, -30, 10, -55, 40, -55],
  KEY_3: [
    {
      KEY_4: "color",
      KEY_5: ["red", "green"],
    },
    {
      KEY_6: "animal",
      KEY_7: ["koala"],
    },
    {
      KEY_8: "weight",
      KEY_9: 50,
      KEY_10: 100,
    },
  ],
};
for (var VAR_3 = 0; VAR_3 < 1000; ++VAR_3) {
  VAR_1.push(VAR_2);
}
var VAR_4 = VAR_1.length;
var VAR_5 = 0;
while (VAR_5 < VAR_4) {
  var VAR_6 = JSON.parse(JSON.stringify(VAR_1[VAR_5]));
  ++VAR_5;
}
