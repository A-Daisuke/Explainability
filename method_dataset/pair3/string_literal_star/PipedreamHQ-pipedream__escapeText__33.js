function escapeText(text) {
  const chars = [
    "\\",
    "|",
    "{",
    "}",
    "@",
    "[",
    "]",
    "(",
    ")",
    "<",
    ">",
    "#",
    "*",
    "_",
    "~",
  ];
  for (const char of chars) {
    const escapedChar = "\\" + char;
    const regex = new RegExp(`\\${char}`, "g");
    text = text.replace(regex, escapedChar);
  }
  return text;
}
