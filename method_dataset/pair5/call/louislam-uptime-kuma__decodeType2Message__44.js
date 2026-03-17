function decodeType2Message(str) {
    if (str === undefined) {
        throw new Error('Invalid argument');
    }
    //convenience
    if (Object.prototype.toString.call(str) !== '[object String]') {
        if (str.hasOwnProperty('headers') && str.headers.hasOwnProperty('www-authenticate')) {
            str = str.headers['www-authenticate'];
        }
        else {
            throw new Error('Invalid argument');
        }
    }
    var ntlmMatch = /^NTLM ([^,\s]+)/.exec(str);
    if (ntlmMatch) {
        str = ntlmMatch[1];
    }
    var buf = new Buffer.from(str, 'base64'), obj = {};
    //check signature
    if (buf.toString('ascii', 0, NTLMSIGNATURE.length) !== NTLMSIGNATURE) {
        throw new Error('Invalid message signature: ' + str);
    }
    //check message type
    if (buf.readUInt32LE(NTLMSIGNATURE.length) !== 2) {
        throw new Error('Invalid message type (no type 2)');
    }
    //read flags
    obj.flags = buf.readUInt32LE(20);
    obj.encoding = (obj.flags & flags.NTLMFLAG_NEGOTIATE_OEM) ? 'ascii' : 'ucs2';
    obj.version = (obj.flags & flags.NTLMFLAG_NEGOTIATE_NTLM2_KEY) ? 2 : 1;
    obj.challenge = buf.slice(24, 32);
    //read target name
    obj.targetName = (function () {
        var length = buf.readUInt16LE(12);
        //skipping allocated space
        var offset = buf.readUInt32LE(16);
        if (length === 0) {
            return '';
        }
        if ((offset + length) > buf.length || offset < 32) {
            throw new Error('Bad type 2 message');
        }
        return buf.toString(obj.encoding, offset, offset + length);
    })();
    //read target info
    if (obj.flags & flags.NTLMFLAG_NEGOTIATE_TARGET_INFO) {
        obj.targetInfo = (function () {
            var info = {};
            var length = buf.readUInt16LE(40);
            //skipping allocated space
            var offset = buf.readUInt32LE(44);
            var targetInfoBuffer = new Buffer.alloc(length);
            buf.copy(targetInfoBuffer, 0, offset, offset + length);
            if (length === 0) {
                return info;
            }
            if ((offset + length) > buf.length || offset < 32) {
                throw new Error('Bad type 2 message');
            }
            var pos = offset;
            while (pos < (offset + length)) {
                var blockType = buf.readUInt16LE(pos);
                pos += 2;
                var blockLength = buf.readUInt16LE(pos);
                pos += 2;
                if (blockType === 0) {
                    //reached the terminator subblock
                    break;
                }
                var blockTypeStr = void 0;
                switch (blockType) {
                    case 1:
                        blockTypeStr = 'SERVER';
                        break;
                    case 2:
                        blockTypeStr = 'DOMAIN';
                        break;
                    case 3:
                        blockTypeStr = 'FQDN';
                        break;
                    case 4:
                        blockTypeStr = 'DNS';
                        break;
                    case 5:
                        blockTypeStr = 'PARENT_DNS';
                        break;
                    default:
                        blockTypeStr = '';
                        break;
                }
                if (blockTypeStr) {
                    info[blockTypeStr] = buf.toString('ucs2', pos, pos + blockLength);
                }
                pos += blockLength;
            }
            return {
                parsed: info,
                buffer: targetInfoBuffer
            };
        })();
    }
    return obj;
}
