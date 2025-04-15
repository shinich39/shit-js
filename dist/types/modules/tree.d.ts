export type TreeNode = TreeRoot | TreeTag | TreeText | TreeComment;
export type TreeParent = TreeRoot | TreeTag;
export type TreeChild = TreeTag | TreeText | TreeComment;
export interface TreeRoot {
    type: "root";
    parent?: undefined;
    tag?: undefined;
    closer?: undefined;
    content?: undefined;
    attrs?: undefined;
    children: TreeChild[];
}
export interface TreeTag {
    type: "tag";
    parent: TreeParent;
    tag: string;
    closer?: string;
    content: undefined;
    attrs: Record<string, boolean | string>;
    children: TreeChild[];
}
export interface TreeText {
    type: "text";
    parent: TreeParent;
    tag?: undefined;
    closer?: undefined;
    content: string;
    attrs?: undefined;
    children?: undefined;
}
export interface TreeComment {
    type: "comment";
    parent: TreeParent;
    tag?: undefined;
    closer?: undefined;
    content: string;
    attrs?: undefined;
    children?: undefined;
}
declare function parse(str: string): TreeRoot;
declare function getChildren<T extends TreeParent, U>(root: T, callback: (child: TreeChild, index: number, root: T) => U): U[];
declare function findChild<T extends TreeParent>(root: T, callback: (child: TreeChild, index: number, root: T) => any): TreeChild | undefined;
declare function findChildren<T extends TreeParent>(root: T, callback: (child: TreeChild, index: number, root: T) => any): TreeChild[];
declare function getParents<T extends TreeChild, U>(leaf: T, callback: (parent: TreeParent, index: number, leaf: T) => U): U[];
declare function findParent<T extends TreeChild>(leaf: T, callback: (parent: TreeParent, index: number, leaf: T) => any): TreeNode | undefined;
declare function findParents<T extends TreeChild>(leaf: T, callback: (parent: TreeParent, index: number, leaf: T) => any): TreeParent[];
declare function stringify(node: TreeNode): string;
export declare class Tree {
    node: TreeNode;
    constructor(arg: string | TreeNode);
    getChildren<U>(callback: <T extends TreeParent>(child: TreeChild, index: number, root: T) => U): U[];
    findChild(callback: <T extends TreeParent>(child: TreeChild, index: number, root: T) => any): TreeChild | undefined;
    findChildren(callback: <T extends TreeParent>(child: TreeChild, index: number, root: T) => any): TreeChild[];
    getParents<U>(callback: <T extends TreeChild>(parent: TreeParent, index: number, leaf: T) => U): U[];
    findParent(callback: <T extends TreeChild>(parent: TreeParent, index: number, leaf: T) => any): TreeNode | undefined;
    findParents(callback: <T extends TreeChild>(parent: TreeParent, index: number, leaf: T) => any): TreeParent[];
    toString(): string;
    static parse: typeof parse;
    static stringify: typeof stringify;
    static getChildren: typeof getChildren;
    static findChild: typeof findChild;
    static findChildren: typeof findChildren;
    static getParents: typeof getParents;
    static findParent: typeof findParent;
    static findParents: typeof findParents;
}
export {};
//# sourceMappingURL=tree.d.ts.map