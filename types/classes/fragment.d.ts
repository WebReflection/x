/** @extends {DocumentFragment} for real! */
export default class Fragment extends DocumentFragment {
    /**
     * @param {Node | Fragment} node
     * @param {1 | 0 | -0 | -1} op
     * @returns {Node | Fragment}
     */
    static diff: (node: Node | Fragment, op: 1 | 0 | -0 | -1) => Node | Fragment;
    /** @param {DocumentFragment} fragment */
    constructor(fragment: DocumentFragment);
    get firstChild(): ChildNode;
    get childNodes(): ChildNode[];
    remove(): void;
    /** @param {Node} node */
    replaceWith(node: Node): void;
    valueOf(): this;
    #private;
}
