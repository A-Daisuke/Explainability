function __method_wrapper__() {
    static from(cookieStr) {
        const options = {
            name: undefined,
            value: undefined,
            path: undefined,
            domain: undefined,
            expires: undefined,
            maxAge: undefined,
            secure: undefined,
            httpOnly: undefined,
            sameSite: undefined,
            creationDate: Date.now()
        };
        const unparsed = cookieStr.slice().trim();
        const attrAndValueList = unparsed.split(";");
        const keyValuePairString = trimTerminator(attrAndValueList.shift() || "").trim();
        const keyValuePairEqualsIndex = keyValuePairString.indexOf("=");
        if (keyValuePairEqualsIndex < 0) {
            return new Cookie();
        }
        const name = keyValuePairString.slice(0, keyValuePairEqualsIndex);
        const value = trimWrappingDoubleQuotes(keyValuePairString.slice(keyValuePairEqualsIndex + 1));
        if (!(isValidName(name) && isValidValue(value))) {
            return new Cookie();
        }
        options.name = name;
        options.value = value;
        while(attrAndValueList.length){
            const cookieAV = attrAndValueList.shift()?.trim();
            if (!cookieAV) {
                continue;
            }
            const avSeperatorIndex = cookieAV.indexOf("=");
            let attrKey, attrValue;
            if (avSeperatorIndex === -1) {
                attrKey = cookieAV;
                attrValue = "";
            } else {
                attrKey = cookieAV.substr(0, avSeperatorIndex);
                attrValue = cookieAV.substr(avSeperatorIndex + 1);
            }
            attrKey = attrKey.trim().toLowerCase();
            if (attrValue) {
                attrValue = attrValue.trim();
            }
            switch(attrKey){
                case "expires":
                    if (attrValue) {
                        const expires = new Date(attrValue).getTime();
                        if (expires && !isNaN(expires)) {
                            options.expires = expires;
                        }
                    }
                    break;
                case "max-age":
                    if (attrValue) {
                        const maxAge = parseInt(attrValue, 10);
                        if (!isNaN(maxAge)) {
                            options.maxAge = maxAge;
                        }
                    }
                    break;
                case "domain":
                    if (attrValue) {
                        const domain = parseURL(attrValue).host;
                        if (domain) {
                            options.domain = domain;
                        }
                    }
                    break;
                case "path":
                    if (attrValue) {
                        options.path = attrValue.startsWith("/") ? attrValue : "/" + attrValue;
                    }
                    break;
                case "secure":
                    options.secure = true;
                    break;
                case "httponly":
                    options.httpOnly = true;
                    break;
                case "samesite":
                    {
                        const lowerCasedSameSite = attrValue.toLowerCase();
                        switch(lowerCasedSameSite){
                            case "strict":
                                options.sameSite = "Strict";
                                break;
                            case "lax":
                                options.sameSite = "Lax";
                                break;
                            case "none":
                                options.sameSite = "None";
                                break;
                            default:
                                break;
                        }
                        break;
                    }
                default:
                    break;
            }
        }
        return new Cookie(options);
    }

}
