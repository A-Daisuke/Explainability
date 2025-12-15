var VAR_1 = [
  ...Array(1000).fill(null),
  ...Array(100).fill("foo"),
  ...Array(100).fill(null),
  ...Array(100).fill("bar"),
  ...Array(1000).fill(null),
];
function FUNCTION_2(VAR_5) {
  var VAR_6 = VAR_5.findIndex((VAR_7) => VAR_7 !== null);
  var VAR_8 = VAR_6 > -1 ? VAR_5.slice(VAR_6) : [];
  return VAR_8.reduceRight((VAR_9, VAR_10) => {
    if (VAR_9.length || VAR_10 !== null) {
      VAR_9.unshift(VAR_10);
    }
    return VAR_9;
  }, []);
}
FUNCTION_2(VAR_1);
