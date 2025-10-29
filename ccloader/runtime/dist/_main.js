import * as paths from '../../common/dist/paths.js';
import { stdlibNamespace as utils } from '../../common/dist/utils.js';
import requireFixed from '../../common/dist/require.js';
import semver from '../../common/vendor-libs/semver.js';
import * as patchStepsLib from '../../common/vendor-libs/patch-steps-lib.js';
import { namespace as patchList } from './patch-list.js';
import { namespace as impactInitHooks } from './impact-init-hooks.js';
import { namespace as impactModuleHooks } from './impact-module-hooks.js';
import { namespace as resources } from './resources.js';
import './error-screen.js';
import './resources-injections.js';
import './lang-file-patcher.js';
import './greenworks-fix.js';
export default class RuntimeModMainClass {
    constructor(mod) {
        if (window.ccmod == null)
            window.ccmod = {};
        Object.assign(window.ccmod, {
            implementor: modloader.name,
            implementation: mod.id,
            paths,
            utils,
            require: requireFixed,
            semver,
            patchStepsLib,
            patchList,
            impactInitHooks,
            impactModuleHooks,
            resources,
        });
    }
    onImpactInit() {
        for (let cb of impactInitHooks.callbacks)
            cb();
    }
    async postload() {
        await import('./_postload.js');
    }
}
//# sourceMappingURL=_main.js.map