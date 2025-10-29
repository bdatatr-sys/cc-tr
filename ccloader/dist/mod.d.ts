import semver from '../common/vendor-libs/semver.js';
import { Manifest } from 'ultimate-crosscode-typedefs/file-types/mod-manifest';
import { Dependency, LoadingStage, ModID, Mod as ModPublic, PluginClass } from 'ultimate-crosscode-typedefs/modloader/mod';
export declare class Mod implements ModPublic {
    readonly baseDirectory: string;
    readonly manifest: Manifest;
    readonly legacyMode: boolean;
    readonly id: ModID;
    readonly version: semver.SemVer | null;
    readonly dependencies: ReadonlyMap<ModID, Dependency>;
    readonly assetsDirectory: string;
    assets: Set<string>;
    pluginClassInstance: PluginClass | null;
    constructor(baseDirectory: string, manifest: Manifest, legacyMode: boolean);
    findAllAssets(): Promise<void>;
    initClass(): Promise<void>;
    executeStage(stage: LoadingStage): Promise<void>;
    resolvePath(path: string): string;
}
//# sourceMappingURL=mod.d.ts.map