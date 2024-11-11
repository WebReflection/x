export function render(where: ParentNode, what: () => TagResult): ParentNode;
export function tag(SVG: boolean, attr: any, diff: (node: Element, hint: import("./handle/diff.js").HINT, once: boolean) => ((curr: Node[]) => void) | ((curr: string | null) => void) | ((curr: Node) => void), text: (node: HTMLElement, once: boolean) => (curr: any | null) => void): (t: TemplateStringsArray | string[], ...v: any[]) => Fragment | Node | TagResult;
export type Fragment = import("./classes/fragment.js").default;
export type HoleDetails = import("./classes/key-value.js").HoleDetails;
export type TagResult = import("./classes/key-value.js").TagResult;
export type Update = {
    2: (node: Element, once: boolean, kv: import("./classes/key-value.js").AttributeDetails) => any;
    8: (node: Comment, once: boolean, hint: import("./handle/diff.js").HINT) => (node: Element, hint: import("./handle/diff.js").HINT, once: boolean) => ((curr: Node[]) => void) | ((curr: string | null) => void) | ((curr: Node) => void);
    1: (node: HTMLElement, once: boolean) => (curr: any | null) => void;
};
