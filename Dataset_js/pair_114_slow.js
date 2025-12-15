var VAR_1 = "0",
  VAR_2,
  VAR_3 = ["th", "st", "nd", "rd", "th"];
if (VAR_1 > 3 && VAR_1 < 21) {
  VAR_2 = "th";
} else if (/1$/.test(VAR_1)) {
  VAR_2 = "st";
} else if (/2$/.test(VAR_1)) {
  VAR_2 = "nd";
} else if (/3$/.test(VAR_1)) {
  VAR_2 = "rd";
} else {
  VAR_2 = "th";
}
