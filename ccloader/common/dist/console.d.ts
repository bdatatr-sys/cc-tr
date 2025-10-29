export declare enum LogLevel {
    LOG = 2,
    WARN = 1,
    ERROR = 0
}
export declare type LogLevelName = keyof typeof LogLevel;
export declare type LogLevelsDict<T = boolean> = Record<LogLevelName, T>;
export declare const LOG_LEVEL_NAMES: readonly LogLevelName[];
export declare const DEFAULT_LOG_LEVELS: LogLevelsDict;
export declare function setLogLevels(levels: LogLevelsDict): void;
export declare function inject(): void;
//# sourceMappingURL=console.d.ts.map