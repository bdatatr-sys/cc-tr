import { Config } from './config.js';
export declare function loadText(path: string): Promise<string>;
export declare function isReadable(path: string): Promise<boolean>;
export declare function findRecursively(dir: string): Promise<string[]>;
export declare function getModDirectoriesIn(dir: string, _config: Config): Promise<string[]>;
export declare function getInstalledExtensions(config: Config): Promise<string[]>;
//# sourceMappingURL=files.desktop.d.ts.map