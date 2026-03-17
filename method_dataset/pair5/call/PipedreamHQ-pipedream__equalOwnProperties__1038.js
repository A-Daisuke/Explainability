    function equalOwnProperties(left, right, equalityComparer) {
        if (equalityComparer === void 0) { equalityComparer = equateValues; }
        if (left === right)
            return true;
        if (!left || !right)
            return false;
        for (var key in left) {
            if (hasOwnProperty.call(left, key)) {
                if (!hasOwnProperty.call(right, key))
                    return false;
                if (!equalityComparer(left[key], right[key]))
                    return false;
            }
        }
        for (var key in right) {
            if (hasOwnProperty.call(right, key)) {
                if (!hasOwnProperty.call(left, key))
                    return false;
            }
        }
        return true;
    }
