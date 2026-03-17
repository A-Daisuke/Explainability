  function deepClone(obj) {
    // Handle null, undefined, and non-object values
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    // Handle Date
    if (obj instanceof Date) {
      return new Date(obj.getTime());
    }

    // Handle Array
    if (Array.isArray(obj)) {
      const clonedArr = [];
      for (let i = 0; i < obj.length; i++) {
        clonedArr.push(deepClone(obj[i]));
      }
      return clonedArr;
    }

    // Handle Objects
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) { // Ensure key is directly on obj
        clonedObj[key] = deepClone(obj[key]);
      }
    }

    return clonedObj;
  }
