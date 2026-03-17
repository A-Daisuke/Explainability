class __C__ {
  static skipWhitespaces() {
    while (this.currentCharacterCode <= 32) this.parserPosition++;
    // Comments go everywhere whitespaces go and must be skipped as if it were whitespace
    if (this.currentCharacter === '/') {
      this.parserPosition++;
      if (this.currentCharacter === '/') {
        // //-style comments
        this.skipUntil('\n');
      } else if (this.currentCharacter === '*') {
        // /* */-style comments
        do {
          this.skipUntil('*');
        } while (this.currentCharacter !== '/');
        this.parserPosition++;
      } else console.warn(`Unexpected slash.`);
      this.skipWhitespaces();
    }
  }

}
