var _a;
import * as utils from './utils.js';
const nodejsUtil = (_a = window.require) === null || _a === void 0 ? void 0 : _a.call(window, 'util');
export var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["LOG"] = 2] = "LOG";
    LogLevel[LogLevel["WARN"] = 1] = "WARN";
    LogLevel[LogLevel["ERROR"] = 0] = "ERROR";
})(LogLevel || (LogLevel = {}));
export const LOG_LEVEL_NAMES = ['LOG', 'WARN', 'ERROR'];
export const DEFAULT_LOG_LEVELS = {
    LOG: false,
    WARN: true,
    ERROR: true,
};
function logLevelsToBitFlags(levels) {
    let flags = 0;
    for (let level of LOG_LEVEL_NAMES) {
        let enabled = levels[level];
        flags |= Number(enabled) << LogLevel[level];
    }
    return flags;
}
function logLevelsFromBitFlags(flags) {
    let levels = {};
    for (let level of LOG_LEVEL_NAMES) {
        let bit = LogLevel[level];
        levels[level] = Boolean(flags & (1 << bit));
    }
    return levels;
}
function getLogLevels() {
    let flagsStr = localStorage.getItem('logFlags');
    if (flagsStr != null) {
        let flags = parseInt(flagsStr, 10);
        if (Number.isSafeInteger(flags)) {
            return logLevelsFromBitFlags(flags);
        }
    }
    return Object.assign({}, DEFAULT_LOG_LEVELS);
}
export function setLogLevels(levels) {
    localStorage.setItem('logFlags', String(logLevelsToBitFlags(levels)));
}
const EVENTS_BLOCKED_BY_CONSOLE = [
    'mousewheel',
    'contextmenu',
    'mousedown',
    'mouseup',
    'mousemove',
    'touchstart',
    'touchend',
    'touchmove',
    'keydown',
    'keyup',
    'keypress',
];
const LOG_LEVEL_APPEARENCE_DURATIONS = {
    LOG: 2000,
    WARN: 5000,
    ERROR: 15000,
};
let rootElement;
export function inject() {
    let logLevels = getLogLevels();
    rootElement = utils.html('div', {
        id: 'ccloader-console',
        class: ['ccloader-overlay', 'ccloader-vbox', 'ccloader-vscroll'],
    });
    for (let eventType of EVENTS_BLOCKED_BY_CONSOLE) {
        rootElement.addEventListener(eventType, (event) => event.stopPropagation());
    }
    document.body.append(rootElement);
    function hookConsoleMethod(name, level) {
        let old = console[name];
        console[name] = function (...message) {
            let result = old.apply(this, message);
            log(level, ...message);
            return result;
        };
    }
    if (logLevels.ERROR) {
        hookConsoleMethod('error', LogLevel.ERROR);
    }
    if (logLevels.WARN) {
        hookConsoleMethod('warn', LogLevel.WARN);
    }
    if (logLevels.LOG) {
        hookConsoleMethod('log', LogLevel.LOG);
        hookConsoleMethod('info', LogLevel.LOG);
    }
}
function log(level, ...message) {
    let levelName = LogLevel[level];
    let el = utils.html('div', {
        class: ['ccloader-message', `ccloader-${levelName}`],
        children: [`[${LogLevel[level]}] ${formatMessage(...message)}`],
    });
    rootElement.append(el);
    let removeTimeout = setTimeout(() => {
        el.remove();
    }, LOG_LEVEL_APPEARENCE_DURATIONS[levelName]);
    el.addEventListener('click', (event) => {
        event.stopPropagation();
        event.preventDefault();
        el.remove();
        clearTimeout(removeTimeout);
    });
    rootElement.scrollTo(0, rootElement.scrollHeight);
}
function formatMessage(...message) {
    if (nodejsUtil != null) {
        let formatFn = nodejsUtil.format;
        return formatFn(...message);
    }
    else {
        return message.map((m) => String(m)).join(' ');
    }
}
//# sourceMappingURL=console.js.map