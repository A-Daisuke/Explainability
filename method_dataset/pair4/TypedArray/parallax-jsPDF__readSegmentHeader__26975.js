          function readSegmentHeader(data, start) {
            var segmentHeader = {};
            segmentHeader.number = (0, _util.readUint32)(data, start);
            var flags = data[start + 4];
            var segmentType = flags & 0x3f;

            if (!SegmentTypes[segmentType]) {
              throw new Jbig2Error("invalid segment type: " + segmentType);
            }

            segmentHeader.type = segmentType;
            segmentHeader.typeName = SegmentTypes[segmentType];
            segmentHeader.deferredNonRetain = !!(flags & 0x80);
            var pageAssociationFieldSize = !!(flags & 0x40);
            var referredFlags = data[start + 5];
            var referredToCount = (referredFlags >> 5) & 7;
            var retainBits = [referredFlags & 31];
            var position = start + 6;

            if (referredFlags === 7) {
              referredToCount =
                (0, _util.readUint32)(data, position - 1) & 0x1fffffff;
              position += 3;
              var bytes = (referredToCount + 7) >> 3;
              retainBits[0] = data[position++];

              while (--bytes > 0) {
                retainBits.push(data[position++]);
              }
            } else if (referredFlags === 5 || referredFlags === 6) {
              throw new Jbig2Error("invalid referred-to flags");
            }

            segmentHeader.retainBits = retainBits;
            var referredToSegmentNumberSize =
              segmentHeader.number <= 256
                ? 1
                : segmentHeader.number <= 65536
                ? 2
                : 4;
            var referredTo = [];
            var i, ii;

            for (i = 0; i < referredToCount; i++) {
              var number =
                referredToSegmentNumberSize === 1
                  ? data[position]
                  : referredToSegmentNumberSize === 2
                  ? (0, _util.readUint16)(data, position)
                  : (0, _util.readUint32)(data, position);
              referredTo.push(number);
              position += referredToSegmentNumberSize;
            }

            segmentHeader.referredTo = referredTo;

            if (!pageAssociationFieldSize) {
              segmentHeader.pageAssociation = data[position++];
            } else {
              segmentHeader.pageAssociation = (0, _util.readUint32)(
                data,
                position
              );
              position += 4;
            }

            segmentHeader.length = (0, _util.readUint32)(data, position);
            position += 4;

            if (segmentHeader.length === 0xffffffff) {
              if (segmentType === 38) {
                var genericRegionInfo = readRegionSegmentInformation(
                  data,
                  position
                );
                var genericRegionSegmentFlags =
                  data[position + RegionSegmentInformationFieldLength];
                var genericRegionMmr = !!(genericRegionSegmentFlags & 1);
                var searchPatternLength = 6;
                var searchPattern = new Uint8Array(searchPatternLength);

                if (!genericRegionMmr) {
                  searchPattern[0] = 0xff;
                  searchPattern[1] = 0xac;
                }

                searchPattern[2] = (genericRegionInfo.height >>> 24) & 0xff;
                searchPattern[3] = (genericRegionInfo.height >> 16) & 0xff;
                searchPattern[4] = (genericRegionInfo.height >> 8) & 0xff;
                searchPattern[5] = genericRegionInfo.height & 0xff;

                for (i = position, ii = data.length; i < ii; i++) {
                  var j = 0;

                  while (
                    j < searchPatternLength &&
                    searchPattern[j] === data[i + j]
                  ) {
                    j++;
                  }

                  if (j === searchPatternLength) {
                    segmentHeader.length = i + searchPatternLength;
                    break;
                  }
                }

                if (segmentHeader.length === 0xffffffff) {
                  throw new Jbig2Error("segment end was not found");
                }
              } else {
                throw new Jbig2Error("invalid unknown segment length");
              }
            }

            segmentHeader.headerEnd = position;
            return segmentHeader;
          }
