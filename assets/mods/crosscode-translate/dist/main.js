export default class {
    constructor() { }
    postload(mod) {
        if (sc.ua == null)
            sc.ua = {};
        sc.ua.version = mod.version.toString();
    }
}
//# sourceMappingURL=main.js.map