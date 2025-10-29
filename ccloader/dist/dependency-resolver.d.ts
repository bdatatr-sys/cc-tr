import { Mod } from './mod.js';
import semver from '../common/vendor-libs/semver.js';
import { ModID } from 'ultimate-crosscode-typedefs/modloader/mod';
declare type ModsMap = Map<ModID, Mod>;
declare type ReadonlyModsMap = ReadonlyMap<ModID, Mod>;
declare type ReadonlyVirtualPackagesMap = ReadonlyMap<ModID, semver.SemVer>;
declare type ReadonlyExtensionsMap = ReadonlyMap<ModID, semver.SemVer>;
export declare function sortModsInLoadOrder(runtimeMod: Mod, installedMods: ReadonlyModsMap): ModsMap;
export declare function verifyModDependencies(mod: Mod, installedMods: ReadonlyModsMap, virtualPackages: ReadonlyVirtualPackagesMap, installedExtensions: ReadonlyExtensionsMap, enabledExtensions: ReadonlyExtensionsMap, loadedMods: ReadonlyModsMap): string[];
export {};
//# sourceMappingURL=dependency-resolver.d.ts.map