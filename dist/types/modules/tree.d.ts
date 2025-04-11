export type TTree = {
    map: WeakSet<TNode>;
    nodes: TNode[];
};
export type TNode = TText | TComment | TTag;
export type TTag = {
    parent?: TTag;
    depth: number;
    type: "tag";
    tag: string;
    closer?: string;
    attrs: Record<string, boolean | string>;
    children: TNode[];
};
export type TText = {
    parent?: TTag;
    depth: number;
    type: "text";
    content: string;
};
export type TComment = {
    parent?: TTag;
    depth: number;
    type: "comment";
    content: string;
};
export declare class Tree implements TTree {
    map: WeakSet<TNode>;
    nodes: TNode[];
    constructor(str: string);
    set(targetNode: TTag, ...newNodes: TNode[]): boolean;
    add(targetNode: TTag, ...newNodes: TNode[]): boolean;
    remove(targetNode: TNode): boolean;
    toString(): string;
    static parse(str: string): TNode[];
    static stringify(nodes: TNode[]): string;
}
//# sourceMappingURL=tree.d.ts.map