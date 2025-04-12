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
declare function parseDOM(str: string): TreeNode[];
declare function stringifyDOM(root: TreeRoot): string;
export declare class Tree {
    static parse: typeof parseDOM;
    static stringify: typeof stringifyDOM;
}
export {};
//# sourceMappingURL=tree.d.ts.map