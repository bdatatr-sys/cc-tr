import { LocalizedString } from 'ultimate-crosscode-typedefs/file-types/mod-manifest';
export * from '../../../common/dist/utils.js';
export declare function getLocalizedString(str: LocalizedString | null | undefined): string | null | undefined;
export declare function getModTitle(mod: modloader.Mod): string;
export declare function addEnumMember<N extends string>(enumObj: {
    [k in N]: number;
}, name: N): number;
//# sourceMappingURL=utils.d.ts.map