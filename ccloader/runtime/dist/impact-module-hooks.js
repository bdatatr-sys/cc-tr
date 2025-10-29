// based on https://github.com/CCDirectLink/DevModLoader/blob/7dd3c4ebee4b516b201205d0bb1c24913335b9f1/js/game/ig-interceptor.js
import * as impactInitHooks from './impact-init-hooks.js';
import { PatchList } from './patch-list.js';
export const patchList = new PatchList();
export function add(moduleName, callback) {
    patchList.add(moduleName, callback);
}
impactInitHooks.add(() => {
    let originalDefines = ig.defines;
    ig.defines = function (body) {
        let { name } = ig._current;
        if (name == null)
            return originalDefines.call(this, body);
        return originalDefines.call(this, function (...args) {
            body.apply(this, args);
            for (let callback of patchList.forPath(name))
                callback(name);
        });
    };
});
export const namespace = { patchList, add };
//# sourceMappingURL=impact-module-hooks.js.map