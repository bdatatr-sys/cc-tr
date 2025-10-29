import { MaybePromise, PromiseResult } from 'ultimate-crosscode-typedefs/modloader-stdlib/utils';
export { MaybePromise };
export declare enum PlatformType {
    DESKTOP = "DESKTOP",
    ANDROID = "ANDROID",
    BROWSER = "BROWSER"
}
export declare const PLATFORM_TYPE: PlatformType;
export declare function showDevTools(window?: nw.Window): Promise<void>;
export declare function showBackgroundPageDevTools(): Promise<void>;
export declare function wait(ms: number): Promise<void>;
export declare function compare<T>(a: T, b: T): number;
export declare function errorHasMessage(error: any): error is {
    message: string;
};
export declare function errorHasCode(error: any): error is {
    code: string;
};
export declare function wrapPromiseResult<T>(promise: Promise<T>): Promise<PromiseResult<T>>;
export declare function hasKey(obj: unknown, key: PropertyKey): boolean;
export declare function mapGetOrInsert<K, V>(map: Map<K, V>, key: K, defaultValue: V): V;
export declare function cwdFilePathToURL(path: string, base?: string): URL;
export declare function cwdFilePathFromURL(url: URL): string;
export declare function html<K extends keyof HTMLElementTagNameMap>(tagName: K, options: {
    attrs?: {
        [attr: string]: string | null | undefined;
    } | null;
    id?: string | null;
    class?: string[] | null;
    style?: {
        [P in keyof CSSStyleDeclaration]?: Extract<CSSStyleDeclaration[P], string | number> | null;
    };
    children?: Array<string | Node> | null;
}): HTMLElementTagNameMap[K];
export declare const stdlibNamespace: {
    PlatformType: typeof PlatformType;
    PLATFORM_TYPE: PlatformType;
    showDevTools: typeof showDevTools;
    showBackgroundPageDevTools: typeof showBackgroundPageDevTools;
    wait: typeof wait;
    compare: typeof compare;
    wrapPromiseResult: typeof wrapPromiseResult;
    hasKey: typeof hasKey;
    mapGetOrInsert: typeof mapGetOrInsert;
};
//# sourceMappingURL=utils.d.ts.map