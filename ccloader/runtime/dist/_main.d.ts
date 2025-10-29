import './error-screen.js';
import './resources-injections.js';
import './lang-file-patcher.js';
import './greenworks-fix.js';
export default class RuntimeModMainClass implements modloader.Mod.PluginClass {
    constructor(mod: modloader.Mod);
    onImpactInit(): void;
    postload(): Promise<void>;
}
//# sourceMappingURL=_main.d.ts.map