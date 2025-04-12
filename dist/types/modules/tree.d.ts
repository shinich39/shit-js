export type TreeNode = TreeRoot | TreeTag | TreeText | TreeComment;
export type TreeParent = TreeRoot | TreeTag;
export type TreeChild = TreeTag | TreeText | TreeComment;
export interface TreeRoot {
    type: "root";
    depth: number;
    children: TreeChild[];
}
export interface TreeTag {
    type: "tag";
    parent: TreeParent;
    depth: number;
    tag: string;
    closer?: string;
    attrs: Record<string, boolean | string>;
    children: TreeChild[];
}
export interface TreeText {
    type: "text";
    parent: TreeParent;
    depth: number;
    content: string;
}
export interface TreeComment {
    type: "comment";
    parent: TreeParent;
    depth: number;
    content: string;
}
declare function _parse(str: string): TreeRoot;
declare function _map(root: TreeRoot, callback: (node: TreeNode, index: number, root: TreeRoot) => void): void;
declare function _find(root: TreeRoot, callback: (node: TreeNode, index: number, root: TreeRoot) => any): TreeNode | undefined;
declare function _filter(root: TreeRoot, callback: (node: TreeNode, index: number, root: TreeRoot) => any): TreeNode[];
declare function _stringify(root: TreeRoot): string;
export declare class Tree {
    root: TreeRoot;
    constructor(arg: string | TreeRoot);
    map(callback: (node: TreeNode, index: number, root: TreeRoot) => void): void;
    find(callback: (node: TreeNode, index: number, root: TreeRoot) => any): TreeNode | undefined;
    filter(callback: (node: TreeNode, index: number, root: TreeRoot) => any): TreeNode[];
    toString(): string;
    static parse: typeof _parse;
    static map: typeof _map;
    static find: typeof _find;
    static filter: typeof _filter;
    static stringify: typeof _stringify;
}
export {};
//# sourceMappingURL=tree.d.ts.map