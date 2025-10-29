import * as filesBrowser from './files.browser.js';
export { isReadable, loadText } from './files.browser.js';
export async function getModDirectoriesIn(dir, config) {
    if (dir === `${config.gameAssetsDir}mods/`) {
        try {
            let modsDirEntries = JSON.parse(CrossAndroidModListProvider.getModListAsJson());
            let modSubdirs = [];
            for (let modDirName of modsDirEntries) {
                if (modDirName.endsWith('/')) {
                    modSubdirs.push(`${dir}/${modDirName.slice(0, -1)}`);
                }
            }
            return modSubdirs;
        }
        catch (err) {
            console.error('Failed to get the list of mods from CrossAndroid:', err);
        }
    }
    return filesBrowser.getModDirectoriesIn(dir, config);
}
export async function getInstalledExtensions(config) {
    try {
        return JSON.parse(CrossAndroidExtensionListProvider.getExtensionListAsJson());
    }
    catch (err) {
        console.error('Failed to get the list of extensions from CrossAndroid:', err);
    }
    return filesBrowser.getInstalledExtensions(config);
}
//# sourceMappingURL=files.android.js.map