const VAR_1 = [
  " SELECT * FROM Foo",
  "select foo, bar FROM Baz JOIN Bazz ON Baz.id = Bazz.bazId",
  "INSERT INTO Foo VALUES (1, 2, 3)",
  "UPDATE Baz SET bar = 1729 WHERE active = 1",
  "DROP TABLE Foo",
];
const FUNCTION_1 = () =>
  VAR_1[Math.floor(Math.random() * VAR_1.length)];
const VAR_2 = FUNCTION_1();
const VAR_3 = VAR_2.split(" ")[0].toLowerCase() === "select";
