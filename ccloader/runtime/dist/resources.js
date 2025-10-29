import * as resourcesPlain from './resources-plain.js';
import * as patchsteps from '../../common/vendor-libs/patch-steps-lib.js';
import * as utils from '../../common/dist/utils.js';
import { PatchList, ResourcePatchList } from './patch-list.js';
import * as paths from '../../common/dist/paths.js';
export const MOD_PROTOCOL = 'mod:';
export const MOD_PROTOCOL_PREFIX = `${MOD_PROTOCOL}//`;
export const assetOverridesTable = new Map();
export const textGenerators = new PatchList();
export const jsonPatches = new ResourcePatchList();
export const jsonGenerators = new PatchList();
export const imagePatches = new ResourcePatchList();
export const imageGenerators = new PatchList();
{
    let assetOverridesFromMods = new Map();
    for (let mod of modloader.loadedMods.values()) {
        for (let asset of mod.assets) {
            if (asset.endsWith('.json.patch')) {
                let patchedAsset = asset.slice(0, -6);
                registerPatchstepsPatch(mod, asset, patchedAsset);
                continue;
            }
            let modsWithThisAsset = utils.mapGetOrInsert(assetOverridesFromMods, asset, []);
            modsWithThisAsset.push(mod);
        }
    }
    for (let [asset, modsWithThisAsset] of assetOverridesFromMods) {
        if (modsWithThisAsset.length > 1) {
            console.warn(`Conflict between overrides for '${asset}' found in mods '${modsWithThisAsset
                .map((mod) => mod.id)
                .join("', '")}'. Using the override from mod '${modsWithThisAsset[0].id}'`);
        }
        let overridePath = `${modsWithThisAsset[0].assetsDirectory}${asset}`;
        assetOverridesTable.set(asset, overridePath);
    }
}
function registerPatchstepsPatch(mod, patchFileRelativePath, patchedAssetPath) {
    jsonPatches.add(patchedAssetPath, {
        dependencies: () => {
            return resourcesPlain.loadJSON(wrapPathIntoURL(`${mod.assetsDirectory}${patchFileRelativePath}`).href);
        },
        patcher: async (data, patchData) => {
            let debugState = new PatchstepsCustomDebugState(mod);
            debugState.addFile([/* fromGame */ false, patchFileRelativePath]);
            await patchsteps.patch(data, patchData, patchstepsResourceLoader, debugState);
            return data;
        },
    });
    function patchstepsResourceLoader(fromGame, url) {
        return fromGame === false
            ? resourcesPlain.loadJSON(wrapPathIntoURL(mod.resolvePath(url)).href)
            : loadJSON(url);
    }
}
export async function loadText(path, options) {
    var _a;
    options = options !== null && options !== void 0 ? options : {};
    let { resolvedPath, requestedAsset } = resolvePathAdvanced(path, options);
    if (((_a = options.allowGenerators) !== null && _a !== void 0 ? _a : true) && requestedAsset != null) {
        let generators = textGenerators.forPath(requestedAsset);
        if (generators.length > 0) {
            let ctx = { resolvedPath, requestedAsset, options };
            return runResourceGenerator('text file', path, generators, ctx);
        }
    }
    return resourcesPlain.loadText(wrapPathIntoURL(resolvedPath).href);
}
export async function loadJSON(path, options) {
    var _a;
    options = options !== null && options !== void 0 ? options : {};
    let { resolvedPath, requestedAsset } = resolvePathAdvanced(path, options);
    let data = null;
    let shouldFetchRealData = true;
    if (((_a = options.allowGenerators) !== null && _a !== void 0 ? _a : true) && requestedAsset != null) {
        let generators = jsonGenerators.forPath(requestedAsset);
        if (generators.length > 0) {
            let ctx = { resolvedPath, requestedAsset, options };
            data = await runResourceGenerator('JSON file', path, generators, ctx);
            shouldFetchRealData = false;
        }
    }
    if (shouldFetchRealData) {
        data = await resourcesPlain.loadJSON(wrapPathIntoURL(resolvedPath).href);
    }
    if (requestedAsset != null) {
        let patchers = jsonPatches.forPath(requestedAsset);
        if (patchers.length > 0) {
            let ctx = { resolvedPath, requestedAsset, options };
            data = await runResourcePatches('JSON file', path, data, patchers, ctx);
        }
    }
    return data;
}
export async function loadImage(path, options) {
    var _a;
    options = options !== null && options !== void 0 ? options : {};
    let { resolvedPath, requestedAsset } = resolvePathAdvanced(path, options);
    let data = null;
    let shouldFetchRealData = true;
    if (((_a = options.allowGenerators) !== null && _a !== void 0 ? _a : true) && requestedAsset != null) {
        let generators = imageGenerators.forPath(requestedAsset);
        if (generators.length > 0) {
            let ctx = { resolvedPath, requestedAsset, options };
            data = await runResourceGenerator('image', path, generators, ctx);
            shouldFetchRealData = false;
        }
    }
    if (shouldFetchRealData) {
        data = await resourcesPlain.loadImage(wrapPathIntoURL(resolvedPath).href);
    }
    if (requestedAsset != null) {
        let patchers = imagePatches.forPath(requestedAsset);
        if (patchers.length > 0) {
            if (!(data instanceof HTMLCanvasElement)) {
                data = imageToCanvas(data);
            }
            let ctx = { resolvedPath, requestedAsset, options };
            data = await runResourcePatches('image', path, data, patchers, ctx);
        }
    }
    switch (options.returnCanvas) {
        case 'always':
            if (!(data instanceof HTMLCanvasElement))
                data = imageToCanvas(data);
            break;
        case 'never':
            if (data instanceof HTMLCanvasElement)
                data = await canvasToImage(data);
            break;
        case 'if-patched':
            break;
    }
    return data;
    function imageToCanvas(image) {
        let canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        let ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0);
        return canvas;
    }
    function canvasToImage(canvas) {
        return resourcesPlain.loadImage(canvas.toDataURL('image/png'));
    }
}
async function runResourceGenerator(kind, path, matchingGenerators, context) {
    try {
        if (matchingGenerators.length === 1) {
            let generator = matchingGenerators[0];
            return generator(context);
        }
        else if (matchingGenerators.length > 1) {
            throw new Error(`Conflict between ${matchingGenerators.length} matching generators for '${path}' found`);
        }
        else {
            throw new Error('unreachable');
        }
    }
    catch (err) {
        if (utils.errorHasMessage(err)) {
            err.message = `Failed to generate ${kind} '${path}': ${err.message}`;
        }
        throw err;
    }
}
async function runResourcePatches(kind, path, data, patchers, context) {
    try {
        /* eslint-disable no-undefined */
        let allDependencies = await Promise.all(patchers.map((patcher) => patcher.dependencies != null ? patcher.dependencies(context) : undefined));
        for (let i = 0; i < patchers.length; i++) {
            let patcher = patchers[i];
            let deps = allDependencies[i];
            let newData = await patcher.patcher(data, deps, context);
            if (newData !== undefined)
                data = newData;
        }
        return data;
        /* eslint-enable no-undefined */
    }
    catch (err) {
        if (utils.errorHasMessage(err)) {
            err.message = `Failed to patch ${kind} '${path}': ${err.message}`;
        }
        throw err;
    }
}
export function resolvePath(uri, options) {
    return resolvePathAdvanced(uri, options).resolvedPath;
}
export function resolvePathToURL(path, options) {
    return wrapPathIntoURL(resolvePath(path, options)).href;
}
export function resolvePathAdvanced(uri, options) {
    var _a, _b;
    options = options !== null && options !== void 0 ? options : {};
    let resolvedPath;
    let requestedAsset = null;
    let modResourcePath = applyModURLProtocol(uri);
    if (modResourcePath != null) {
        resolvedPath = modResourcePath;
    }
    else {
        let normalizedPath = paths.normalize(uri);
        if (paths.isAbsolute(normalizedPath)) {
            // `jailRelative` could've been performed instead, but it has the same
            // effect as `stripRoot` on absolute paths here because the path has
            // already been normalized, therefore the more time-expensive function can
            // be avoided
            resolvedPath = paths.stripRoot(normalizedPath);
        }
        else {
            let gameAssetsPath = paths.stripRoot(getGameAssetsURL().pathname);
            resolvedPath = paths.jailRelative(paths.join(gameAssetsPath, normalizedPath));
            if (((_a = options.allowPatching) !== null && _a !== void 0 ? _a : true) && resolvedPath.startsWith(gameAssetsPath)) {
                requestedAsset = resolvedPath.slice(gameAssetsPath.length);
                if ((_b = options.allowAssetOverrides) !== null && _b !== void 0 ? _b : true) {
                    let overridePath = assetOverridesTable.get(requestedAsset);
                    if (overridePath != null) {
                        resolvedPath = overridePath;
                    }
                }
            }
        }
    }
    return { resolvedPath, requestedAsset };
}
export function wrapPathIntoURL(path) {
    let url = utils.cwdFilePathToURL(path, getGameAssetsURL().href);
    url.href += getCacheSuffix();
    return url;
}
export function getGameAssetsURL() {
    let str;
    if (typeof ig !== 'undefined') {
        str = ig.root;
    }
    else if (window.IG_ROOT != null) {
        str = window.IG_ROOT;
    }
    else {
        str = '';
    }
    return new URL(str, document.baseURI);
}
export function getCacheSuffix() {
    if (typeof ig !== 'undefined') {
        return ig.getCacheSuffix();
    }
    else if (window.IG_GAME_CACHE != null && window.IG_GAME_CACHE) {
        return `?nocache=${window.IG_GAME_CACHE}`;
    }
    else {
        return '';
    }
}
function applyModURLProtocol(fullURI) {
    if (!fullURI.startsWith(MOD_PROTOCOL_PREFIX))
        return null;
    try {
        let uri = fullURI.slice(MOD_PROTOCOL_PREFIX.length);
        if (uri.length === 0) {
            throw new Error('the URI is empty');
        }
        let modIDSeparatorIndex = uri.indexOf('/');
        if (modIDSeparatorIndex < 0) {
            throw new Error("'/' after the mod ID is missing");
        }
        let modID = uri.slice(0, modIDSeparatorIndex);
        if (modID.length === 0) {
            throw new Error('the mod ID is empty');
        }
        let filePath = uri.slice(modIDSeparatorIndex + 1);
        if (filePath.length === 0) {
            throw new Error('the file path is empty');
        }
        let mod = modloader.loadedMods.get(modID);
        if (mod == null) {
            throw new Error(`mod '${modID}' not found`);
        }
        return mod.resolvePath(filePath);
    }
    catch (err) {
        if (utils.errorHasMessage(err)) {
            err.message = `Invalid '${MOD_PROTOCOL_PREFIX}' URL '${fullURI}': ${err.message}`;
        }
        throw err;
    }
}
class PatchstepsCustomDebugState extends patchsteps.DebugState {
    constructor(currentMod) {
        super();
        this.currentMod = currentMod;
    }
    translateParsedPath(parsedPath) {
        if (parsedPath != null) {
            let [protocol, path] = parsedPath;
            // note that switch-case performs strict, i.e. `===`, comparisons
            switch (protocol) {
                case true:
                case 'game':
                    return resolvePath(path);
                case false:
                case 'mod':
                    return this.currentMod.resolvePath(path);
            }
        }
        // fallback to the default implementation on unknown paths and protocols
        return super.translateParsedPath(parsedPath);
    }
}
export const namespace = {
    plain: resourcesPlain.namespace,
    assetOverridesTable,
    textGenerators,
    jsonPatches,
    jsonGenerators,
    imagePatches,
    imageGenerators,
    loadText,
    loadJSON,
    loadImage,
    resolvePath,
    resolvePathToURL,
    resolvePathAdvanced,
    wrapPathIntoURL,
    getGameAssetsURL,
    getCacheSuffix,
};
//# sourceMappingURL=resources.js.map