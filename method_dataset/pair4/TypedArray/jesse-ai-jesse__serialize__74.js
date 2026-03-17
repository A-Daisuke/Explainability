class __C__ {
    serialize() {
        let necessarySize = (+4 // beforeVersionId
            + 4 // afterVersionId
            + 1 // beforeEOL
            + 1 // afterEOL
            + SingleModelEditStackData._writeSelectionsSize(this.beforeCursorState)
            + SingleModelEditStackData._writeSelectionsSize(this.afterCursorState)
            + 4 // change count
        );
        for (const change of this.changes) {
            necessarySize += change.writeSize();
        }
        const b = new Uint8Array(necessarySize);
        let offset = 0;
        buffer.writeUInt32BE(b, this.beforeVersionId, offset);
        offset += 4;
        buffer.writeUInt32BE(b, this.afterVersionId, offset);
        offset += 4;
        buffer.writeUInt8(b, this.beforeEOL, offset);
        offset += 1;
        buffer.writeUInt8(b, this.afterEOL, offset);
        offset += 1;
        offset = SingleModelEditStackData._writeSelections(b, this.beforeCursorState, offset);
        offset = SingleModelEditStackData._writeSelections(b, this.afterCursorState, offset);
        buffer.writeUInt32BE(b, this.changes.length, offset);
        offset += 4;
        for (const change of this.changes) {
            offset = change.write(b, offset);
        }
        return b.buffer;
    }

}
