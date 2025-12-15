var VAR_4,
  VAR_1 = "0",
  VAR_2,
  VAR_3 = ["th", "st", "nd", "rd", "th"];
VAR_4 = VAR_1.slice(-1);
if (VAR_1 > 3 && VAR_1 < 21) {
  VAR_2 = "th";
} else if (VAR_4 == 1) {
  VAR_2 = "st";
} else if (VAR_4 == 2) {
  VAR_2 = "nd";
} else if (VAR_4 == 3) {
  VAR_2 = "rd";
} else {
  VAR_2 = "th";
}
