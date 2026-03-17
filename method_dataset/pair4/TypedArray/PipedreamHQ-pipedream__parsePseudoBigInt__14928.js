    function parsePseudoBigInt(stringValue) {
        var log2Base;
        switch (stringValue.charCodeAt(1)) {
            case 98:
            case 66:
                log2Base = 1;
                break;
            case 111:
            case 79:
                log2Base = 3;
                break;
            case 120:
            case 88:
                log2Base = 4;
                break;
            default:
                var nIndex = stringValue.length - 1;
                var nonZeroStart = 0;
                while (stringValue.charCodeAt(nonZeroStart) === 48) {
                    nonZeroStart++;
                }
                return stringValue.slice(nonZeroStart, nIndex) || "0";
        }
        var startIndex = 2, endIndex = stringValue.length - 1;
        var bitsNeeded = (endIndex - startIndex) * log2Base;
        var segments = new Uint16Array((bitsNeeded >>> 4) + (bitsNeeded & 15 ? 1 : 0));
        for (var i = endIndex - 1, bitOffset = 0; i >= startIndex; i--, bitOffset += log2Base) {
            var segment = bitOffset >>> 4;
            var digitChar = stringValue.charCodeAt(i);
            var digit = digitChar <= 57
                ? digitChar - 48
                : 10 + digitChar -
                    (digitChar <= 70 ? 65 : 97);
            var shiftedDigit = digit << (bitOffset & 15);
            segments[segment] |= shiftedDigit;
            var residual = shiftedDigit >>> 16;
            if (residual)
                segments[segment + 1] |= residual;
        }
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
