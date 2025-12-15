export type DomType = "root" | "tag" | "text" | "comment" | "script" | "style";
export type DomAttrs = Record<string, string | null | undefined>;
export type DomImpl = {
    parent?: DomImpl;
    type: DomType;
    tag?: string;
    closer?: string;
    content?: string;
    attributes?: DomAttrs;
    children?: DomImpl[];
};
declare function parseStr(str: string): {
    type: "root";
    children: DomImpl[];
};
export declare const parseDom: (src: string | DomImpl | Dom, parent?: Dom) => Dom;
export declare class Dom implements DomImpl {
    parent?: Dom;
    type: DomType;
    tag: string;
    closer?: string;
    content: string;
    attributes: DomAttrs;
    children: Dom[];
    constructor(src?: string | DomImpl | Dom, parent?: Dom);
    init(src: string | DomImpl | Dom, parent?: Dom): void;
    createChildren(args: (string | DomImpl | Dom)[]): Dom[];
    isRoot(): boolean;
    isComment(): boolean;
    isStyle(): boolean;
    isScript(): boolean;
    isText(): boolean;
    isTag(): boolean;
    getParent(): Dom | undefined;
    hasParent(): boolean;
    /**
     * Get all parent elements from target to root
     */
    getParents(): Dom[];
    /**
     * Get all children regardless of depth
     */
    getChildren(): Dom[];
    hasChildren(): boolean;
    getSiblings(): Dom[];
    hasSiblings(): boolean;
    getTag(): string;
    setTag(value: string): void;
    hasTag(): boolean;
    getCloser(): string | undefined;
    setCloser(value: string | null | undefined): void;
    hasCloser(): boolean;
    getContent(): string;
    setContent(value: string): void;
    hasContent(): boolean;
    getContents(): string[];
    getAttribute(key: string): string | null | undefined;
    setAttribute(key: string, value: string | null | undefined): void;
    hasAttribute(key: string): boolean;
    getAttributes(): DomAttrs;
    setAttributes(attrs: DomAttrs): void;
    hasAttributes(attrs: DomAttrs): boolean;
    getRoot(this: Dom): Dom | undefined;
    getDepth(this: Dom): number;
    append(...args: (string | DomImpl | Dom)[]): void;
    prepend(...args: (string | DomImpl | Dom)[]): void;
    before(...args: (string | DomImpl | Dom)[]): void;
    after(...args: (string | DomImpl | Dom)[]): void;
    forEach(callback: (child: Dom, index: number, children: Dom[]) => void): void;
    find(callback: (child: Dom, index: number, children: Dom[]) => any): Dom | undefined;
    findLast(callback: (parent: Dom, index: number, parents: Dom[]) => any): Dom | undefined;
    filter(callback: (child: Dom, index: number, children: Dom[]) => any): Dom[];
    map<T>(callback: (child: Dom, index: number, children: Dom[]) => T): T[];
    reduce<T>(callback: (previousValue: T, currentValue: Dom, currentIndex: number, array: Dom[]) => T, initialValue: T): T;
    reduceRight<T>(callback: (previousValue: T, currentValue: Dom, currentIndex: number, array: Dom[]) => T, initialValue: T): T;
    remove(): void;
    removeChild(arg: Dom): void;
    removeChildren(...args: Dom[]): void;
    /**
     * Get html string
     */
    toString(): string;
    /**
     * Get children array contains this element
     */
    toArray(): Dom[];
    static parse: typeof parseStr;
}
export {};
//# sourceMappingURL=dom.d.ts.map