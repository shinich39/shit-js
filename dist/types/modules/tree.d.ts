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
declare function isParent(node: TreeNode): node is TreeParent;
declare function isChild(node: TreeNode): node is TreeChild;
declare function parse(str: string): TreeRoot;
declare function getChildren<T>(parent: TreeParent, callback: (child: TreeChild, depth: number, index: number, siblings: TreeChild[]) => T): T[];
declare function accChildren<T>(parent: TreeParent, callback: (accumulator: T, child: TreeChild, depth: number, index: number, siblings: TreeChild[]) => T, initialValue: T): T;
declare function findChild(parent: TreeParent, callback: (child: TreeChild, depth: number, index: number, siblings: TreeChild[]) => any): TreeChild | undefined;
declare function findChildren(parent: TreeParent, callback: (child: TreeChild, depth: number, index: number, siblings: TreeChild[]) => any): TreeChild[];
declare function getParents<T>(child: TreeChild, callback: (parent: TreeParent, depth: number, child: TreeChild) => T): T[];
declare function accParents<T>(child: TreeChild, callback: (accumulator: T, parent: TreeParent, depth: number, child: TreeChild) => T, initialValue: T): T;
declare function findParent(child: TreeChild, callback: (parent: TreeParent, depth: number, child: TreeChild) => any): TreeNode | undefined;
declare function findParents(child: TreeChild, callback: (parent: TreeParent, depth: number, child: TreeChild) => any): TreeParent[];
declare function stringify(node: TreeNode): string;
declare function getContents(node: TreeNode): string[];
export declare class Tree {
    node: TreeNode;
    constructor(arg: string | TreeNode);
    isParent(): boolean;
    isChild(): boolean;
    getChildren<T>(callback: (child: TreeChild, depth: number, index: number, siblings: TreeChild[]) => T): T[];
    accChildren<T>(callback: (accumulator: T, child: TreeChild, depth: number, index: number, siblings: TreeChild[]) => T, initialValue: T): T;
    findChild(callback: (child: TreeChild, depth: number, index: number, siblings: TreeChild[]) => any): TreeChild | undefined;
    findChildren(callback: (child: TreeChild, depth: number, index: number, siblings: TreeChild[]) => any): TreeChild[];
    getParents<T>(callback: (parent: TreeParent, depth: number, child: TreeChild) => T): T[];
    accParents<T>(callback: (accumulator: T, parent: TreeParent, depth: number, child: TreeChild) => T, initialValue: T): T;
    findParent(callback: (parent: TreeParent, depth: number, child: TreeChild) => any): TreeNode | undefined;
    findParents(callback: (parent: TreeParent, depth: number, child: TreeChild) => any): TreeParent[];
    getContents(): string[];
    toString(): string;
    static isParent: typeof isParent;
    static isChild: typeof isChild;
    static parse: typeof parse;
    static stringify: typeof stringify;
    static getContents: typeof getContents;
    static getChildren: typeof getChildren;
    static accChildren: typeof accChildren;
    static findChild: typeof findChild;
    static findChildren: typeof findChildren;
    static getParents: typeof getParents;
    static accParents: typeof accParents;
    static findParent: typeof findParent;
    static findParents: typeof findParents;
}
export {};
//# sourceMappingURL=tree.d.ts.map