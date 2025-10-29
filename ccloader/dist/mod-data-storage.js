// Inspired by:
// https://github.com/dmitmel/crosscode-readable-saves/blob/ed25ab8b061f0a75acf54bc2485fead47523fc2e/src/postload.ts#L78-L284
// https://github.com/CCDirectLink/ccbot-backup/blob/ddc5475081fc2367feba929da9270a88abfc1bc9/src/dynamic-data.ts#L19-L143
var _a, _b, _c;
// If an rwlock-based implementation is ever desired, see:
// https://github.com/Wizcorp/locks/blob/master/lib/ReadWriteLock.js
// https://github.com/71104/rwlock/blob/master/src/lock.js
import * as utils from '../common/dist/utils.js';
const fs = (_b = (_a = window.require) === null || _a === void 0 ? void 0 : _a.call(window, 'fs')) === null || _b === void 0 ? void 0 : _b.promises;
const pathsNative = (_c = window.require) === null || _c === void 0 ? void 0 : _c.call(window, 'path');
export const FILE_NAME = 'cc-mod-settings.json';
export const fileDir = (function getFilePath() {
    // NOTE: It has been observed that the current implementation very rarely
    // (but not at a negligible rate) corrupts the settings file by filling it
    // with zeroes. For some reason even writing to a temporary file first and
    // then renaming it to the real file doesn't help either, so a more advanced
    // implementation, similar to the one from the original game for example, is
    // necessary. Until then writing mod settings to the filesystem separately is
    // disabled.
    return null;
    if (typeof nw === 'undefined')
        return null;
    // taken from https://github.com/dmitmel/crosscode-readable-saves/blob/ed25ab8b061f0a75acf54bc2485fead47523fc2e/src/postload.ts#L289-L298
    let saveDirPath = nw.App.dataPath;
    // On Windows `nw.App.dataPath` is `%LOCALAPPDATA%\CrossCode\User Data\Default`,
    // yet the game writes the savegame to `%LOCALAPPDATA%\CrossCode` when
    // possible, so I reproduce this behavior. Notice that this implementation
    // IS BROKEN when `%LOCALAPPDATA%` contains the `\User Data\Default`
    // substring, but eh, whatever, this is the exact piece of code the stock
    // game uses.
    let userDataIndex = saveDirPath.indexOf('\\User Data\\Default');
    if (userDataIndex >= 0)
        saveDirPath = saveDirPath.slice(0, userDataIndex);
    return saveDirPath;
})();
export const data = new Map();
let queuedWritesPromise = null;
let queuedWritesFlag = false;
export async function readImmediately() {
    data.clear();
    if (fileDir != null) {
        let rawData;
        try {
            rawData = await fs.readFile(pathsNative.join(fileDir, FILE_NAME));
        }
        catch (err) {
            if (utils.errorHasCode(err) && err.code === 'ENOENT')
                return;
            throw err;
        }
        deserialize(rawData);
    }
    else {
        readFromLocalStorage();
    }
}
export async function writeImmediately() {
    if (fileDir != null) {
        let rawData = serialize();
        let filePath = pathsNative.join(fileDir, FILE_NAME);
        let tmpFilePath = pathsNative.join(fileDir, `~${FILE_NAME}`);
        await fs.writeFile(tmpFilePath, rawData);
        await fs.rename(tmpFilePath, filePath);
    }
    else {
        writeToLocalStorage();
    }
}
export async function write() {
    if (queuedWritesPromise == null) {
        let queuedWritesResolve = null;
        queuedWritesPromise = new Promise((resolve) => {
            queuedWritesResolve = resolve;
        });
        do {
            queuedWritesFlag = false;
            try {
                await writeImmediately();
            }
            catch (err) {
                console.error('Error while writing mod data and settings:', err);
                // TODO: can, and, more importantly, should, the error be thrown out of
                // this function?
            }
        } while (queuedWritesFlag);
        queuedWritesPromise = null;
        queuedWritesResolve();
    }
    else {
        queuedWritesFlag = true;
        await queuedWritesPromise;
    }
}
function deserialize(rawData) {
    let jsonData = JSON.parse(rawData.toString('utf8'));
    if (jsonData.version !== 1) {
        throw new Error(`Unsupported format version '${jsonData.version}'`);
    }
    for (let [modID, modEntry] of Object.entries(jsonData.data)) {
        data.set(modID, modEntry);
    }
}
function readFromLocalStorage() {
    for (let [key, value] of Object.entries(localStorage)) {
        let match = /^modEnabled-(.+)$/.exec(key);
        if (match != null && match.length === 2) {
            let modID = match[1];
            data.set(modID, { enabled: value !== 'false' });
        }
    }
}
function serialize() {
    let jsonData = { version: 1, data: {} };
    for (let [modID, modEntry] of data) {
        jsonData.data[modID] = modEntry;
    }
    return Buffer.from(JSON.stringify(jsonData), 'utf8');
}
function writeToLocalStorage() {
    for (let [modID, modEntry] of data) {
        localStorage.setItem(`modEnabled-${modID}`, modEntry.enabled ? 'true' : 'false');
    }
}
export function isModEnabled(id) {
    var _a, _b;
    return (_b = (_a = data.get(id)) === null || _a === void 0 ? void 0 : _a.enabled) !== null && _b !== void 0 ? _b : true;
}
export function setModEnabled(id, enabled) {
    utils.mapGetOrInsert(data, id, { enabled }).enabled = enabled;
}
export const namespace = {
    FILE_NAME,
    fileDir,
    data,
    readImmediately,
    writeImmediately,
    write,
    isModEnabled,
    setModEnabled,
};
//# sourceMappingURL=mod-data-storage.js.map