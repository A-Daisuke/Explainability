function __method_wrapper__() {
    toIndentRanges() {
        const limit = this._foldingRangesLimit.limit;
        if (this._length <= limit) {
            this._foldingRangesLimit.update(this._length, false);
            const startIndexes = new Uint32Array(this._length);
            const endIndexes = new Uint32Array(this._length);
            for (let i = 0; i < this._length; i++) {
                startIndexes[i] = this._startIndexes[i];
                endIndexes[i] = this._endIndexes[i];
            }
            return new FoldingRegions(startIndexes, endIndexes, this._types);
        }
        else {
            this._foldingRangesLimit.update(this._length, limit);
            let entries = 0;
            let maxLevel = this._nestingLevelCounts.length;
            for (let i = 0; i < this._nestingLevelCounts.length; i++) {
                const n = this._nestingLevelCounts[i];
                if (n) {
                    if (n + entries > limit) {
                        maxLevel = i;
                        break;
                    }
                    entries += n;
                }
            }
            const startIndexes = new Uint32Array(limit);
            const endIndexes = new Uint32Array(limit);
            const types = [];
            for (let i = 0, k = 0; i < this._length; i++) {
                const level = this._nestingLevels[i];
                if (level < maxLevel || (level === maxLevel && entries++ < limit)) {
                    startIndexes[k] = this._startIndexes[i];
                    endIndexes[k] = this._endIndexes[i];
                    types[k] = this._types[i];
                    k++;
                }
            }
            return new FoldingRegions(startIndexes, endIndexes, types);
        }
    }

}
