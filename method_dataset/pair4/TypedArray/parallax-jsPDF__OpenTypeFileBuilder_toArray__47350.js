const __obj__ = {
            toArray: function OpenTypeFileBuilder_toArray() {
              var sfnt = this.sfnt;
              var tables = this.tables;
              var tablesNames = Object.keys(tables);
              tablesNames.sort();
              var numTables = tablesNames.length;
              var i, j, jj, table, tableName;
              var offset = OTF_HEADER_SIZE + numTables * OTF_TABLE_ENTRY_SIZE;
              var tableOffsets = [offset];

              for (i = 0; i < numTables; i++) {
                table = tables[tablesNames[i]];
                var paddedLength = ((table.length + 3) & ~3) >>> 0;
                offset += paddedLength;
                tableOffsets.push(offset);
              }

              var file = new Uint8Array(offset);

              for (i = 0; i < numTables; i++) {
                table = tables[tablesNames[i]];
                writeData(file, tableOffsets[i], table);
              }

              if (sfnt === "true") {
                sfnt = (0, _util.string32)(0x00010000);
              }

              file[0] = sfnt.charCodeAt(0) & 0xff;
              file[1] = sfnt.charCodeAt(1) & 0xff;
              file[2] = sfnt.charCodeAt(2) & 0xff;
              file[3] = sfnt.charCodeAt(3) & 0xff;
              writeInt16(file, 4, numTables);
              var searchParams = OpenTypeFileBuilder.getSearchParams(
                numTables,
                16
              );
              writeInt16(file, 6, searchParams.range);
              writeInt16(file, 8, searchParams.entry);
              writeInt16(file, 10, searchParams.rangeShift);
              offset = OTF_HEADER_SIZE;

              for (i = 0; i < numTables; i++) {
                tableName = tablesNames[i];
                file[offset] = tableName.charCodeAt(0) & 0xff;
                file[offset + 1] = tableName.charCodeAt(1) & 0xff;
                file[offset + 2] = tableName.charCodeAt(2) & 0xff;
                file[offset + 3] = tableName.charCodeAt(3) & 0xff;
                var checksum = 0;

                for (
                  j = tableOffsets[i], jj = tableOffsets[i + 1];
                  j < jj;
                  j += 4
                ) {
                  var quad = (0, _util.readUint32)(file, j);
                  checksum = (checksum + quad) >>> 0;
                }

                writeInt32(file, offset + 4, checksum);
                writeInt32(file, offset + 8, tableOffsets[i]);
                writeInt32(file, offset + 12, tables[tableName].length);
                offset += OTF_TABLE_ENTRY_SIZE;
              }

              return file;
            },

};
