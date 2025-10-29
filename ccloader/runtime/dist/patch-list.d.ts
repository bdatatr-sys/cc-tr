import { PatchList as PatchListPublic, ResourcePatchList as ResourcePatchListPublic, ResourcePatcherSimple, ResourcePatcherWithDeps } from 'ultimate-crosscode-typedefs/modloader-stdlib/patch-list';
export declare class PatchList<P> implements PatchListPublic<P> {
    patternPatchers: Array<[RegExp, P]>;
    specificPatchers: Map<string, P[]>;
    forPath(path: string): P[];
    add(path: string | RegExp, patcher: P): void;
}
export declare class ResourcePatchList<Data, Ctx> extends PatchList<ResourcePatcherWithDeps<Data, unknown, Ctx>> implements ResourcePatchListPublic<Data, Ctx> {
    add<Data2 extends Data = Data, Deps = never>(path: string | RegExp, patcher: ResourcePatcherSimple<Data2, Deps, Ctx> | ResourcePatcherWithDeps<Data2, Deps, Ctx>): void;
}
export declare const namespace: typeof ccmod.patchList;
//# sourceMappingURL=patch-list.d.ts.map