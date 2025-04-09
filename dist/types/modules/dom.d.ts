export type ShitNode = {
    parent?: ShitNode;
    depth: number;
    type: "text";
    content: string;
    tag?: undefined | null;
    closer?: undefined | null;
    attributes: Record<string, any>;
    children: ShitNode[];
    [key: string]: any;
} | {
    parent?: ShitNode;
    depth: number;
    type: "tag";
    content?: undefined | null;
    tag: string;
    closer?: string;
    attributes: Record<string, any>;
    children: ShitNode[];
    [key: string]: any;
} | {
    parent?: ShitNode;
    depth: number;
    type: "comment";
    content: string;
    tag?: undefined | null;
    closer?: undefined | null;
    attributes: Record<string, any>;
    children: ShitNode[];
    [key: string]: any;
};
export declare function parseDOM(str: string): ShitNode[];
export declare function stringifyDOM(nodes: ShitNode[]): string;
//# sourceMappingURL=dom.d.ts.map