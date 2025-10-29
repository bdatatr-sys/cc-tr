import * as paths from './paths.js';
export var PlatformType;
(function (PlatformType) {
    PlatformType["DESKTOP"] = "DESKTOP";
    PlatformType["ANDROID"] = "ANDROID";
    PlatformType["BROWSER"] = "BROWSER";
})(PlatformType || (PlatformType = {}));
export const PLATFORM_TYPE = (() => {
    if (typeof nw !== 'undefined') {
        return PlatformType.DESKTOP;
    }
    let params = new URLSearchParams(window.location.search);
    if (params.has('crossandroid')) {
        return PlatformType.ANDROID;
    }
    return PlatformType.BROWSER;
})();
export function showDevTools(window = nw.Window.get()) {
    return new Promise((resolve) => 
    // eslint-disable-next-line no-undefined
    window.showDevTools(undefined, () => resolve()));
}
export function showBackgroundPageDevTools() {
    return new Promise((resolve) => chrome.developerPrivate.openDevTools({
        renderViewId: -1,
        renderProcessId: -1,
        extensionId: chrome.runtime.id,
    }, () => resolve()));
}
export function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
export function compare(a, b) {
    return a > b ? 1 : a < b ? -1 : 0;
}
/* eslint-disable @typescript-eslint/no-explicit-any */
// TODO: mention somewhere in docs that modification of `TypeError`'s `message`
// doesn't work.
export function errorHasMessage(error) {
    return typeof error.message === 'string';
}
export function errorHasCode(error) {
    return typeof error.code === 'string';
}
/* eslint-enable @typescript-eslint/no-explicit-any */
export function wrapPromiseResult(promise) {
    return promise.then((value) => ({ type: 'resolved', value }), (reason) => ({ type: 'rejected', reason }));
}
export function hasKey(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
}
export function mapGetOrInsert(map, key, defaultValue) {
    if (map.has(key)) {
        return map.get(key);
    }
    else {
        map.set(key, defaultValue);
        return defaultValue;
    }
}
export function cwdFilePathToURL(path, base = document.baseURI) {
    let url = new URL(base);
    // Implicitly percent-encodes and doesn't trim path on the ends.
    url.pathname = path;
    url.search = '';
    url.hash = '';
    return url;
}
export function cwdFilePathFromURL(url) {
    // Why use decodeURIComponent here instead of decodeURI, you might ask? You
    // see, the crucial difference between the two is that decodeURIComponent
    // decodes every percent-encoded character without exceptions, while
    // decodeURI, as the ES262 specification says, does not decode "escape
    // sequences that could not have been introduced by encodeURI", which, in
    // practice, means that it doesn't decode percent-encodings of these
    // characters: ;/?:@&=+$,# . Now, how is this behavior useful in practice?
    // Perhaps the intended usecase is to make URLs look nicer by decoding stuff
    // like Unicode characters, yet preserving the validity and meaning of the
    // original URL. But it may lead to obscure bugs in handling file paths
    // because, albeit seldom used, all of the mentioned characters, with the
    // exception of slash, are valid in filenames on UNIX, and, except colon and
    // question mark, the rest is also valid on Windows, and so those characters
    // will be kept undecoded. Here are some specification links:
    // <https://tc39.es/ecma262/multipage/global-object.html#sec-decodeuri-encodeduri>
    // <https://tc39.es/ecma262/multipage/global-object.html#sec-decodeuricomponent-encodeduricomponent>
    return paths.stripRoot(decodeURIComponent(url.pathname));
}
export function html(tagName, options) {
    let element = document.createElement(tagName);
    if (options.attrs != null) {
        for (let [k, v] of Object.entries(options.attrs)) {
            if (v != null) {
                element.setAttribute(k, v);
            }
        }
    }
    if (options.id != null) {
        element.id = options.id;
    }
    if (options.class != null) {
        element.classList.add(...options.class);
    }
    if (options.style != null) {
        for (let [k, v] of Object.entries(options.style)) {
            if (v != null) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                element.style[k] = v;
            }
        }
    }
    if (options.children != null) {
        element.append(...options.children);
    }
    return element;
}
export const stdlibNamespace = {
    PlatformType,
    PLATFORM_TYPE,
    showDevTools,
    showBackgroundPageDevTools,
    wait,
    compare,
    wrapPromiseResult,
    hasKey,
    mapGetOrInsert,
};
//# sourceMappingURL=utils.js.map