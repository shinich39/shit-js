export type AstNode = {
    type: "root";
    children: AstNode[];
} | {
    type: "text";
    value: string;
} | {
    type: "element";
    name: string;
    attributes: AstAttributes;
    children: AstNode[];
} | {
    type: "comment";
    value: string;
} | {
    type: "doctype";
    value: string;
} | {
    type: "pi";
    name: string;
    value: string;
} | {
    type: "cdata";
    value: string;
};
export type AstNodeLike = {
    type: "root";
    children: (string | Ast | AstNodeLike)[];
} | {
    type: "text";
    value: string;
} | {
    type: "element";
    name: string;
    attributes: AstAttributes;
    children: (string | Ast | AstNodeLike)[];
} | {
    type: "comment";
    value: string;
} | {
    type: "doctype";
    value: string;
} | {
    type: "pi";
    name: string;
    value: string;
} | {
    type: "cdata";
    value: string;
};
export type AstType = "root" | "text" | "element" | "comment" | "doctype" | "pi" | "cdata";
export type AstAttributes = Record<string, string | boolean>;
declare function parseStr(str: string): {
    root: Extract<AstNode, {
        type: "root";
    }>;
    nodes: AstNode[];
};
/**
 * Abstract Syntax Tree (AST)
 *
 * @example
 * const ast = new Ast(`<div>abc</div>`);
 * atr.type; // "root"
 * atr.children; // [{ type: "element", name: "div", attributes: {}, children: [ ... ] }]
 * atr.children[0].children; // [{ type: "text", value: "abc" }]
 */
export declare class Ast {
    parent?: Ast;
    type: AstType;
    name: string;
    value: string;
    attributes: AstAttributes;
    children: Ast[];
    constructor(src?: string | Ast | AstNodeLike, parent?: Ast);
    static parse: typeof parseStr;
    static create: (src: string | Ast | AstNodeLike, parent?: Ast) => Ast;
    isRoot(): boolean;
    isText(): boolean;
    isElement(): boolean;
    isVoidElement(): boolean;
    isComment(): boolean;
    isDoctype(): boolean;
    isCdata(): boolean;
    isPi(): boolean;
    isStyle(): boolean;
    isScript(): boolean;
    getParent(): Ast | undefined;
    hasParent(): boolean;
    _walk(callback: (node: Ast, index: number, siblings: Ast[]) => void | "skip" | "break"): void;
    /**
     * @example
     * const ancestors = target.getAncestors(); // Ast[]
     * ancestors.indexOf(target); // -1
     * ancestors.indexOf(target.parent); // 0
     */
    getAncestors(): Ast[];
    /**
     * @example
     * const descendants = target.getDescendants(); // Ast[]
     * const grandchild = target.children[0].children[0];
     * descendants.includes(grandchild); // true
     */
    getDescendants(): Ast[];
    hasChildren(): boolean;
    getSiblings(): Ast[];
    getPrevSibling(): Ast | undefined;
    getNextSibling(): Ast | undefined;
    hasSibling(): boolean;
    getAttribute(key: string): string | boolean | undefined;
    setAttribute(key: string, value: string | boolean): void;
    setAttributes(attrs: AstAttributes): void;
    hasAttribute(key: string): boolean;
    getText(): string;
    getTexts(): string[];
    getRoot(this: Ast): Ast | undefined;
    getDepth(this: Ast): number;
    replace(...nodes: (string | Ast | AstNodeLike)[]): void;
    append(...nodes: (string | Ast | AstNodeLike)[]): void;
    prepend(...nodes: (string | Ast | AstNodeLike)[]): void;
    before(...nodes: (string | Ast | AstNodeLike)[]): void;
    after(...nodes: (string | Ast | AstNodeLike)[]): void;
    forEach(callback: (node: Ast, index: number, siblings: Ast[]) => void): void;
    find(callback: (node: Ast, index: number, siblings: Ast[]) => unknown): Ast | undefined;
    some(callback: (node: Ast, index: number, siblings: Ast[]) => unknown): boolean;
    filter(callback: (node: Ast, index: number, siblings: Ast[]) => unknown): Ast[];
    map<T>(callback: (node: Ast, index: number, siblings: Ast[]) => T): T[];
    reduce<T>(callback: (previousValue: T, node: Ast, index: number, siblings: Ast[]) => T, initialValue: T): T;
    remove(): void;
    removeChild(node: Ast): void;
    removeChildren(nodes: Ast[]): void;
    /**
     * @example
     * const ast = new Ast(`<div>abc</div>`);
     * ast.toString(); // "<div>abc</div>"
     */
    toString(): string;
    /**
     * @example
     * const root = new Ast(`<div>abc</div>`);
     * root.toObject();
     * // {
     * //   type: "root",
     * //   children: [
     * //     {
     * //       type: "element",
     * //       name: "div",
     * //       attributes: {},
     * //       children: [
     * //         {
     * //           type: "text",
     * //           value: "abc",
     * //         }
     * //       ]
     * //     }
     * //   ]
     * // };
     */
    toObject(): AstNode;
}
export {};
//# sourceMappingURL=ast.d.ts.map