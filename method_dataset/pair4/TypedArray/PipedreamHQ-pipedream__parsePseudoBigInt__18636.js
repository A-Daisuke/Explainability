    function parsePseudoBigInt(stringValue) {
        var log2Base;
        switch (stringValue.charCodeAt(1)) { // "x" in "0x123"
            case 98 /* b */:
            case 66 /* B */: // 0b or 0B
                log2Base = 1;
                break;
            case 111 /* o */:
            case 79 /* O */: // 0o or 0O
                log2Base = 3;
                break;
            case 120 /* x */:
            case 88 /* X */: // 0x or 0X
                log2Base = 4;
                break;
            default: // already in decimal; omit trailing "n"
                var nIndex = stringValue.length - 1;
                // Skip leading 0s
                var nonZeroStart = 0;
                while (stringValue.charCodeAt(nonZeroStart) === 48 /* _0 */) {
                    nonZeroStart++;
                }
                return stringValue.slice(nonZeroStart, nIndex) || "0";
        }
        // Omit leading "0b", "0o", or "0x", and trailing "n"
        var startIndex = 2, endIndex = stringValue.length - 1;
        var bitsNeeded = (endIndex - startIndex) * log2Base;
        // Stores the value specified by the string as a LE array of 16-bit integers
        // using Uint16 instead of Uint32 so combining steps can use bitwise operators
        var segments = new Uint16Array((bitsNeeded >>> 4) + (bitsNeeded & 15 ? 1 : 0));
        // Add the digits, one at a time
        for (var i = endIndex - 1, bitOffset = 0; i >= startIndex; i--, bitOffset += log2Base) {
            var segment = bitOffset >>> 4;
            var digitChar = stringValue.charCodeAt(i);
            // Find character range: 0-9 < A-F < a-f
            var digit = digitChar <= 57 /* _9 */
                ? digitChar - 48 /* _0 */
                : 10 + digitChar -
                    (digitChar <= 70 /* F */ ? 65 /* A */ : 97 /* a */);
            var shiftedDigit = digit << (bitOffset & 15);
            segments[segment] |= shiftedDigit;
            var residual = shiftedDigit >>> 16;
            if (residual)
                segments[segment + 1] |= residual; // overflows segment
        }
        // Repeatedly divide segments by 10 and add remainder to base10Value
        var base10Value = "";
        var firstNonzeroSegment = segments.length - 1;
        var segmentsRemaining = true;
        while (segmentsRemaining) {
            var mod10 = 0;
            segmentsRemaining = false;
            for (var segment = firstNonzeroSegment; segment >= 0; segment--) {
                var newSegment = mod10 << 16 | segments[segment];
                var segmentValue = (newSegment / 10) | 0;
                segments[segment] = segmentValue;
                mod10 = newSegment - segmentValue * 10;
                if (segmentValue && !segmentsRemaining) {
                    firstNonzeroSegment = segment;
                    segmentsRemaining = true;
                }
            }
            base10Value = mod10 + base10Value;
        }
        return base10Value;
    }
