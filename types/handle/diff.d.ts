declare function _default(node: Element, hint: HINT, once: boolean): ((curr: Node[]) => void) | ((curr: string | null) => void) | ((curr: Node) => void);
export default _default;
export type HINT = 1 | 2 | 4;
