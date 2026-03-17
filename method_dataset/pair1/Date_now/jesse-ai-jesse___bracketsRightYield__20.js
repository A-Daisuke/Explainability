function __method_wrapper__() {
    static _bracketsRightYield(resolve, round, model, pos, ranges) {
        const counts = new Map();
        const t1 = Date.now();
        while (true) {
            if (round >= BracketSelectionRangeProvider._maxRounds) {
                resolve();
                break;
            }
            if (!pos) {
                resolve();
                break;
            }
            const bracket = model.bracketPairs.findNextBracket(pos);
            if (!bracket) {
                resolve();
                break;
            }
            const d = Date.now() - t1;
            if (d > BracketSelectionRangeProvider._maxDuration) {
                setTimeout(() => BracketSelectionRangeProvider._bracketsRightYield(resolve, round + 1, model, pos, ranges));
                break;
            }
            if (bracket.bracketInfo.isOpeningBracket) {
                const key = bracket.bracketInfo.bracketText;
                // wait for closing
                const val = counts.has(key) ? counts.get(key) : 0;
                counts.set(key, val + 1);
            }
            else {
                const key = bracket.bracketInfo.getOpeningBrackets()[0].bracketText;
                // process closing
                let val = counts.has(key) ? counts.get(key) : 0;
                val -= 1;
                counts.set(key, Math.max(0, val));
                if (val < 0) {
                    let list = ranges.get(key);
                    if (!list) {
                        list = new LinkedList();
                        ranges.set(key, list);
                    }
                    list.push(bracket.range);
                }
            }
            pos = bracket.range.getEndPosition();
        }
    }

}
