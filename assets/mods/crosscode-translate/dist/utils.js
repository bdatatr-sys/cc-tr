"use strict";
// why the hell do I have to copy the entire signature, TypeScript?
sc.ua.objectFromEntries = (entries) => entries.reduce((obj, [key, value]) => {
    obj[key] = value;
    return obj;
}, {}); // eslint-disable-line @typescript-eslint/prefer-reduce-type-parameter
sc.ua.insertAfterOrAppend = (array, beforeIndex, ...items) => {
    if (beforeIndex >= 0)
        array.splice(beforeIndex + 1, 0, ...items);
    else
        array.push(...items);
};
//# sourceMappingURL=utils.js.map