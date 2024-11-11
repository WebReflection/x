export function render(where: ParentNode, what: () => TagResult): ParentNode;
export function tag(SVG: boolean, attr: any, diff: (node: Element, hint: import("./handle/diff.js").HINT, once: boolean) => ((curr: Node[]) => void) | ((curr: string | null) => void) | ((curr: Node) => void), text: (node: HTMLElement, once: boolean) => (curr: any | null) => void): (t: TemplateStringsArray | string[], ...v: any[]) => Fragment | Node | TagResult;
export type Fragment = import("./classes/fragment.js").default;
export type HoleDetails = import("./classes/key-value.js").HoleDetails;
export type TagResult = import("./classes/key-value.js").TagResult;
