import semver from '../common/vendor-libs/semver.js';
import { Config } from './config.js';
export declare const KNOWN_EXTENSION_IDS: ReadonlySet<string>;
export declare function loadVersion(config: Config): Promise<{
    version: semver.SemVer;
    hotfix: number;
}>;
export declare function buildNecessaryDOM(config: Config): Promise<void>;
export declare function loadMainScript(config: Config, eventReceiver: {
    onImpactInit(): void;
}): Promise<() => void>;
export declare function getStartFunction(): Promise<() => void>;
export declare function getDelegateActivationFunction(): Promise<() => void>;
//# sourceMappingURL=game.d.ts.map