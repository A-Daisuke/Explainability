class __C__ {
    readArray(size, type) {
      const bytes = typedArrays[type].BYTES_PER_ELEMENT * size;
      const offset = this.byteOffset + this.offset;
      const slice = this.buffer.slice(offset, offset + bytes);
      if (this.littleEndian === hostBigEndian && type !== 'uint8' && type !== 'int8') {
        const slice = new Uint8Array(this.buffer.slice(offset, offset + bytes));
        slice.reverse();
        const returnArray = new typedArrays[type](slice.buffer);
        this.offset += bytes;
        returnArray.reverse();
        return returnArray;
      }
      const returnArray = new typedArrays[type](slice);
      this.offset += bytes;
      return returnArray;
    }

}
