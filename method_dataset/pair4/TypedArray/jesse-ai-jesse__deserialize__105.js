function __method_wrapper__() {
    static deserialize(source) {
        const b = new Uint8Array(source);
        let offset = 0;
        const beforeVersionId = buffer.readUInt32BE(b, offset);
        offset += 4;
        const afterVersionId = buffer.readUInt32BE(b, offset);
        offset += 4;
        const beforeEOL = buffer.readUInt8(b, offset);
        offset += 1;
        const afterEOL = buffer.readUInt8(b, offset);
        offset += 1;
        const beforeCursorState = [];
        offset = SingleModelEditStackData._readSelections(b, offset, beforeCursorState);
        const afterCursorState = [];
        offset = SingleModelEditStackData._readSelections(b, offset, afterCursorState);
        const changeCount = buffer.readUInt32BE(b, offset);
        offset += 4;
        const changes = [];
        for (let i = 0; i < changeCount; i++) {
            offset = TextChange.read(b, offset, changes);
        }
        return new SingleModelEditStackData(beforeVersionId, afterVersionId, beforeEOL, afterEOL, beforeCursorState, afterCursorState, changes);
    }

}
