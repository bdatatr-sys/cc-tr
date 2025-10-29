import * as utils from '../../common/dist/utils.js';
export class PatchList {
    constructor() {
        this.patternPatchers = [];
        this.specificPatchers = new Map();
    }
    forPath(path) {
        let patchers = [];
        for (let i = 0, len = this.patternPatchers.length; i < len; i++) {
            let [pattern, patcher] = this.patternPatchers[i];
            if (pattern.test(path))
                patchers.push(patcher);
        }
        let specificForThisPath = this.specificPatchers.get(path);
        if (specificForThisPath != null)
            patchers.push(...specificForThisPath);
        return patchers;
    }
    add(path, patcher) {
        if (typeof path === 'string') {
            let list = utils.mapGetOrInsert(this.specificPatchers, path, []);
            list.push(patcher);
        }
        else {
            this.patternPatchers.push([path, patcher]);
        }
    }
}
export class ResourcePatchList extends PatchList {
    add(path, patcher) {
        if (typeof patcher === 'function')
            patcher = { patcher };
        super.add(path, patcher);
    }
}
export const namespace = { PatchList, ResourcePatchList };
//# sourceMappingURL=patch-list.js.map