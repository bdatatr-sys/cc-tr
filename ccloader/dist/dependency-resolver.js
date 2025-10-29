import * as utils from '../common/dist/utils.js';
import * as modDataStorage from './mod-data-storage.js';
import { KNOWN_EXTENSION_IDS } from './game.js';
export function sortModsInLoadOrder(runtimeMod, installedMods) {
    // note that maps preserve insertion order as defined in the ECMAScript spec
    let sortedMods = new Map();
    sortedMods.set(runtimeMod.id, runtimeMod);
    let unsortedModsList = [];
    for (let mod of installedMods.values()) {
        if (mod !== runtimeMod)
            unsortedModsList.push(mod);
    }
    unsortedModsList.sort((mod1, mod2) => utils.compare(mod1.id, mod2.id));
    while (unsortedModsList.length > 0) {
        // dependency cycles can be detected by checking if we removed any
        // dependencies in this iteration, although see the comment below
        let dependencyCyclesExist = true;
        for (let i = 0; i < unsortedModsList.length;) {
            let mod = unsortedModsList[i];
            if (!modHasUnsortedInstalledDependencies(mod, sortedMods, installedMods)) {
                unsortedModsList.splice(i, 1);
                sortedMods.set(mod.id, mod);
                dependencyCyclesExist = false;
            }
            else {
                i++;
            }
        }
        if (dependencyCyclesExist) {
            // Detection of **exactly** which mods caused this isn't implemented yet
            // because 2767mr said it isn't worth the effort (to which I agreed) for
            // now, but if you know how to do that - please implement. For anyone
            // interested google "circular dependency detection" or "detect graph edge
            // cycles" and you'll most likely find something useful for our case.
            throw new Error(`Detected a dependency cycle, most likely in the following mods: ${unsortedModsList
                .map((mod) => mod.id)
                .join(', ')}`);
        }
    }
    return sortedMods;
}
function modHasUnsortedInstalledDependencies(mod, sortedMods, installedMods) {
    for (let depId of mod.dependencies.keys()) {
        if (!sortedMods.has(depId) && installedMods.has(depId))
            return true;
    }
    return false;
}
export function verifyModDependencies(mod, installedMods, virtualPackages, installedExtensions, enabledExtensions, loadedMods) {
    let problems = [];
    for (let [depId, dep] of mod.dependencies) {
        if (depId === mod.id) {
            problems.push("a mod can't depend on itself");
        }
        else {
            let problem = checkDependencyConstraint(depId, dep, installedMods, virtualPackages, installedExtensions, enabledExtensions, loadedMods);
            if (problem != null)
                problems.push(problem);
        }
    }
    return problems;
}
function checkDependencyConstraint(depId, depConstraint, installedMods, virtualPackages, installedExtensions, enabledExtensions, loadedMods) {
    let depTitle = depId;
    let depVersion = null;
    let depIsInstalled = false;
    let depIsEnabled = false;
    let depIsLoaded = false;
    if (virtualPackages.has(depId)) {
        depVersion = virtualPackages.get(depId);
        depIsInstalled = true;
        depIsEnabled = true;
        depIsLoaded = true;
    }
    else if (installedExtensions.has(depId) || KNOWN_EXTENSION_IDS.has(depId)) {
        depTitle = `extension '${depId}'`;
        depIsInstalled = installedExtensions.has(depId);
        if (depIsInstalled) {
            depVersion = installedExtensions.get(depId);
            depIsEnabled = enabledExtensions.has(depId);
            depIsLoaded = depIsEnabled;
        }
    }
    else {
        depTitle = `mod '${depId}'`;
        depIsInstalled = installedMods.has(depId);
        if (depIsInstalled) {
            let depMod = installedMods.get(depId);
            depVersion = depMod.version;
            depIsEnabled = modDataStorage.isModEnabled(depId);
            depIsLoaded = loadedMods.has(depId);
        }
    }
    let { optional } = depConstraint;
    if (!depIsInstalled) {
        return optional ? null : `${depTitle} is not installed`;
    }
    if (depVersion == null) {
        return optional ? null : `${depTitle} doesn't have a version`;
    }
    if (!depIsEnabled) {
        return optional ? null : `${depTitle} is disabled`;
    }
    if (!depIsLoaded) {
        return optional ? null : `${depTitle} is not loaded`;
    }
    if (!depConstraint.version.test(depVersion)) {
        return `version of ${depTitle} (${depVersion}) is not in range '${depConstraint.version}'`;
    }
    return null;
}
//# sourceMappingURL=dependency-resolver.js.map