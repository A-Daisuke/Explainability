function matchesMimeType_normalized(normalizedPattern, normalizedMimeTypes) {
    // Anything wildcard
    if (normalizedPattern === '*/*') {
        return normalizedMimeTypes.length > 0;
    }
    // Exact match
    if (normalizedMimeTypes.includes(normalizedPattern)) {
        return true;
    }
    // Wildcard, such as `image/*`
    const wildcard = normalizedPattern.match(/^([a-z]+)\/([a-z]+|\*)$/i);
    if (!wildcard) {
        return false;
    }
    const [_, type, subtype] = wildcard;
    if (subtype === '*') {
        return normalizedMimeTypes.some(mime => mime.startsWith(type + '/'));
    }
    return false;
}
