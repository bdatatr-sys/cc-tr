import semver from '../common/vendor-libs/semver.js';
import * as paths from '../common/dist/paths.js';
import * as utils from '../common/dist/utils.js';
import * as filesDesktop from './files.desktop.js';
export class Mod {
    constructor(baseDirectory, manifest, legacyMode) {
        var _a, _b;
        this.baseDirectory = baseDirectory;
        this.manifest = manifest;
        this.legacyMode = legacyMode;
        this.version = null;
        this.assets = new Set();
        this.pluginClassInstance = null;
        if (!this.baseDirectory.endsWith('/'))
            this.baseDirectory += '/';
        this.id = this.manifest.id;
        if (this.manifest.version != null) {
            try {
                this.version = new semver.SemVer(this.manifest.version);
            }
            catch (err) {
                if (utils.errorHasMessage(err)) {
                    // TODO: put a link to semver docs here
                    err.message = `mod version '${this.manifest.version}' is not a valid semver version: ${err.message}`;
                }
                throw err;
            }
        }
        let dependencies = new Map();
        if (this.manifest.dependencies != null) {
            for (let [depId, dep] of Object.entries(this.manifest.dependencies)) {
                if (typeof dep === 'string')
                    dep = { version: dep };
                let depVersionRange;
                try {
                    depVersionRange = new semver.Range(dep.version);
                }
                catch (err) {
                    if (utils.errorHasMessage(err)) {
                        err.message = `dependency version constraint '${dep.version}' for mod '${depId}' is not a valid semver range: ${err.message}`;
                    }
                    throw err;
                }
                dependencies.set(depId, {
                    version: depVersionRange,
                    optional: (_a = dep.optional) !== null && _a !== void 0 ? _a : false,
                });
            }
        }
        this.dependencies = dependencies;
        this.assetsDirectory = this.resolvePath(`${(_b = this.manifest.assetsDir) !== null && _b !== void 0 ? _b : 'assets'}/`);
    }
    async findAllAssets() {
        let assets = [];
        if (this.manifest.assets != null) {
            assets = this.manifest.assets.map((path) => paths.jailRelative(path));
        }
        else if (utils.PLATFORM_TYPE === utils.PlatformType.DESKTOP) {
            assets = await filesDesktop.findRecursively(this.assetsDirectory);
        }
        this.assets = new Set(assets);
    }
    async initClass() {
        let script = this.manifest.plugin;
        if (script == null)
            return;
        let scriptFullPath = this.resolvePath(script);
        let module;
        try {
            module = await import(utils.cwdFilePathToURL(scriptFullPath).href);
        }
        catch (err) {
            if (utils.errorHasMessage(err)) {
                err.message = `Error while importing '${scriptFullPath}': ${err.message}`;
            }
            throw err;
        }
        if (!utils.hasKey(module, 'default')) {
            throw new Error(`Module '${scriptFullPath}' has no default export`);
        }
        let ModPluginClass = module.default;
        this.pluginClassInstance = new ModPluginClass(this);
    }
    async executeStage(stage) {
        let pluginCls = this.pluginClassInstance;
        if (pluginCls != null) {
            if (!this.legacyMode) {
                if (stage in pluginCls)
                    await pluginCls[stage](this);
            }
            else {
                let legacyPluginCls = pluginCls;
                let methodName = stage === 'poststart' ? 'main' : stage;
                if (methodName in legacyPluginCls)
                    await legacyPluginCls[methodName]();
            }
        }
        let script = this.manifest[stage];
        if (script == null)
            return;
        let scriptFullPath = this.resolvePath(script);
        await import(utils.cwdFilePathToURL(scriptFullPath).href);
    }
    resolvePath(path) {
        return paths.join(this.baseDirectory, paths.jailRelative(path));
    }
}
//# sourceMappingURL=mod.js.map