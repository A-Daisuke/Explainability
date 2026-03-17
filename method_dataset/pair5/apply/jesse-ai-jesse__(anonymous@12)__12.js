function __method_wrapper__() {
    return function () {
        if (didCall) {
            return result;
        }
        didCall = true;
        if (fnDidRunCallback) {
            try {
                result = fn.apply(_this, arguments);
            }
            finally {
                fnDidRunCallback();
            }
        }
        else {
            result = fn.apply(_this, arguments);
        }
        return result;
    };

}
