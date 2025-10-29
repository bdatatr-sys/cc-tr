export * from '../../../common/dist/utils.js';
export function getLocalizedString(str) {
    var _a;
    if (str == null || typeof str === 'string')
        return str;
    return (_a = str[ig.currentLang]) !== null && _a !== void 0 ? _a : str.en_US;
}
export function getModTitle(mod) {
    var _a;
    return (_a = getLocalizedString(mod.manifest.title)) !== null && _a !== void 0 ? _a : mod.id;
}
export function addEnumMember(enumObj, name) {
    let number = Object.keys(enumObj).length;
    enumObj[name] = number;
    return number;
}
//# sourceMappingURL=utils.js.map