import { ModEntry } from 'ultimate-crosscode-typedefs/file-types/mod-data-storage/v1';
import { ModID } from 'ultimate-crosscode-typedefs/modloader/mod';
export declare const FILE_NAME = "cc-mod-settings.json";
export declare const fileDir: string | null;
export declare const data: Map<string, ModEntry>;
export declare function readImmediately(): Promise<void>;
export declare function writeImmediately(): Promise<void>;
export declare function write(): Promise<void>;
export declare function isModEnabled(id: ModID): boolean;
export declare function setModEnabled(id: ModID, enabled: boolean): void;
export declare const namespace: typeof modloader.modDataStorage;
//# sourceMappingURL=mod-data-storage.d.ts.map