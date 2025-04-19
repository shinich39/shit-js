export type TreeNode = TreeRoot | TreeTag | TreeText | TreeComment;
export type TreeParent = TreeRoot | TreeTag;
export type TreeChild = TreeTag | TreeText | TreeComment;
export type TreeAttrs = Record<string, boolean | string>;
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
    content?: undefined;
    attrs: TreeAttrs;
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
declare function isParent(node: TreeNode): node is TreeParent;
declare function isChild(node: TreeNode): node is TreeChild;
declare function isRoot(node: TreeNode): node is TreeRoot;
declare function isTag(node: TreeNode): node is TreeTag;
declare function isText(node: TreeNode): node is TreeText;
declare function isComment(node: TreeNode): node is TreeComment;
export declare function parse(str: string): TreeRoot;
declare function mapChildren<T>(parent: TreeParent, callback: (child: TreeChild, depth: number, index: number, siblings: TreeChild[]) => T): T[];
declare function reduceChildren<T>(parent: TreeParent, callback: (accumulator: T, child: TreeChild, depth: number, index: number, siblings: TreeChild[]) => T, initialValue: T): T;
declare function findChild(parent: TreeParent, callback: (child: TreeChild, depth: number, index: number, siblings: TreeChild[]) => any): TreeChild | undefined;
declare function filterChildren(parent: TreeParent, callback: (child: TreeChild, depth: number, index: number, siblings: TreeChild[]) => any): TreeChild[];
declare function mapParents<T>(child: TreeChild, callback: (parent: TreeParent, depth: number, child: TreeChild) => T): T[];
declare function reduceParents<T>(child: TreeChild, callback: (accumulator: T, parent: TreeParent, depth: number, child: TreeChild) => T, initialValue: T): T;
declare function findParent(child: TreeChild, callback: (parent: TreeParent, depth: number, child: TreeChild) => any): TreeNode | undefined;
declare function filterParents(child: TreeChild, callback: (parent: TreeParent, depth: number, child: TreeChild) => any): TreeParent[];
declare function stringify(node: TreeNode): string;
declare function getContents(node: TreeNode): string[];
export declare class Tree {
    node: TreeNode;
    constructor(arg: string | TreeNode);
    isParent(): boolean;
    isChild(): boolean;
    isRoot(): boolean;
    isTag(): boolean;
    isText(): boolean;
    isComment(): boolean;
    map<T>(callback: (child: TreeChild, depth: number, index: number, siblings: TreeChild[]) => T): T[];
    reduce<T>(callback: (accumulator: T, child: TreeChild, depth: number, index: number, siblings: TreeChild[]) => T, initialValue: T): T;
    find(callback: (child: TreeChild, depth: number, index: number, siblings: TreeChild[]) => any): TreeChild | undefined;
    filter(callback: (child: TreeChild, depth: number, index: number, siblings: TreeChild[]) => any): TreeChild[];
    mapTop<T>(callback: (parent: TreeParent, depth: number, child: TreeChild) => T): T[];
    reduceTop<T>(callback: (accumulator: T, parent: TreeParent, depth: number, child: TreeChild) => T, initialValue: T): T;
    findTop(callback: (parent: TreeParent, depth: number, child: TreeChild) => any): TreeNode | undefined;
    filterTop(callback: (parent: TreeParent, depth: number, child: TreeChild) => any): TreeParent[];
    getContents(): string[];
    toString(): string;
    static isParent: typeof isParent;
    static isChild: typeof isChild;
    static isRoot: typeof isRoot;
    static isTag: typeof isTag;
    static isText: typeof isText;
    static isComment: typeof isComment;
    static parse: typeof parse;
    static stringify: typeof stringify;
    static getContents: typeof getContents;
    static map: typeof mapChildren;
    static reduce: typeof reduceChildren;
    static find: typeof findChild;
    static filter: typeof filterChildren;
    static mapTop: typeof mapParents;
    static reduceTop: typeof reduceParents;
    static findTop: typeof findParent;
    static filterTop: typeof filterParents;
}
export {};
//# sourceMappingURL=tree.d.ts.map