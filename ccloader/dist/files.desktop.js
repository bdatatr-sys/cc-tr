var _a, _b, _c, _d;
import * as utils from '../common/dist/utils.js';
const fs = (_b = (_a = window.require) === null || _a === void 0 ? void 0 : _a.call(window, 'fs')) === null || _b === void 0 ? void 0 : _b.promises;
const fsconst = (_d = (_c = window.require) === null || _c === void 0 ? void 0 : _c.call(window, 'fs')) === null || _d === void 0 ? void 0 : _d.constants;
export async function loadText(path) {
    return fs.readFile(path, 'utf8');
}
export async function isReadable(path) {
    try {
        await fs.access(path, fsconst.R_OK);
        return true;
    }
    catch (_err) {
        return false;
    }
}
export async function findRecursively(dir) {
    if (dir.endsWith('/'))
        dir = dir.slice(0, -1);
    let fileList = [];
    await findRecursivelyInternal(dir, '', fileList);
    return fileList;
}
async function findRecursivelyInternal(currentDir, relativePrefix, fileList) {
    let contents;
    try {
        contents = await fs.readdir(currentDir);
    }
    catch (err) {
        if (utils.errorHasCode(err) && err.code === 'ENOENT')
            return;
        throw err;
    }
    await Promise.all(contents.map(async (name) => {
        let fullPath = `${currentDir}/${name}`;
        let stat = await fs.stat(fullPath);
        if (stat.isDirectory()) {
            await findRecursivelyInternal(fullPath, `${relativePrefix}${name}/`, fileList);
        }
        else {
            fileList.push(`${relativePrefix}${name}`);
        }
    }));
}
export async function getModDirectoriesIn(dir, _config) {
    if (dir.endsWith('/'))
        dir = dir.slice(0, -1);
    let allContents;
    try {
        allContents = await fs.readdir(dir);
    }
    catch (err) {
        if (utils.errorHasCode(err) && err.code === 'ENOENT') {
            console.warn(`Directory '${dir}' not found, did you forget to create it?`);
            return [];
        }
        throw err;
    }
    let modDirectories = [];
    await Promise.all(allContents.map(async (name) => {
        let fullPath = `${dir}/${name}`;
        // the `withFileTypes` option of `readdir` can't be used here because it
        // doesn't dereference symbolic links similarly to `stat`
        let stat = await fs.stat(fullPath);
        if (stat.isDirectory())
            modDirectories.push(fullPath);
    }));
    return modDirectories;
}
// Replicates the behavior of `ig.ExtensionList#loadExtensionsNWJS`.
export async function getInstalledExtensions(config) {
    var _a;
    let igRoot = (_a = config.impactConfig.IG_ROOT) !== null && _a !== void 0 ? _a : '';
    let igDebug = Boolean(config.impactConfig.IG_GAME_DEBUG);
    let extensionsDir = `${igRoot}${igDebug ? 'data' : 'assets'}/extension`;
    let allContents;
    try {
        allContents = await fs.readdir(extensionsDir);
    }
    catch (err) {
        // Older versions of the game simply don't have the support for extensions.
        if (utils.errorHasCode(err) && err.code === 'ENOENT')
            return [];
        throw err;
    }
    let extensionIds = [];
    await Promise.all(allContents.map(async (name) => {
        // No idea why this is checked by the game.
        if (name.startsWith('.'))
            return;
        if (igDebug) {
            // The debug mode is interesting: it seems that when it is enabled,
            // only extension manifests are loaded from `data/extension/`, while
            // the files of the extensions reside inside game's normal directory
            // structure. So, extension directories with assets are created only
            // when the game is compiled for release.
            if (name.endsWith('.json')) {
                extensionIds.push(name.slice(0, -5));
            }
            return;
        }
        try {
            // The game also checks if the containing directory exists before
            // checking if there is a file inside, but it is redundant.
            await fs.access(`${extensionsDir}/${name}/${name}.json`);
        }
        catch (_err) {
            return;
        }
        extensionIds.push(name);
    }));
    return extensionIds;
}
//# sourceMappingURL=files.desktop.js.map