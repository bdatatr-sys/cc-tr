import * as utils from '../common/dist/utils.js';
import semver from '../common/vendor-libs/semver.js';
export interface Config {
    gameAssetsDir: string;
    modsDirs: string[];
    stylesheetURLs: string[];
    scriptURLs: string[];
    gameScriptURL: string;
    impactConfig: Record<string, unknown>;
    onGameDOMCreated: () => utils.MaybePromise<void>;
}
export interface ConfigModule {
    default: (config: Config, context: ConfigModuleContext) => utils.MaybePromise<void>;
}
export interface ConfigModuleContext {
    modloaderVersion: semver.SemVer;
}
export declare function load(modloaderVersion: semver.SemVer): Promise<Config>;
//# sourceMappingURL=config.d.ts.map