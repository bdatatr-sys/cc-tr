import { ImpactModuleHook } from 'ultimate-crosscode-typedefs/modloader-stdlib/impact-module-hooks';
import { PatchList } from './patch-list.js';
export declare const patchList: PatchList<ImpactModuleHook>;
export declare function add(moduleName: string | RegExp, callback: ImpactModuleHook): void;
export declare const namespace: typeof ccmod.impactModuleHooks;
//# sourceMappingURL=impact-module-hooks.d.ts.map