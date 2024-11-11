declare const _default: {
    /**
     * @param {Element} node
     * @param {string} name
     * @param {boolean} once
     * @returns
     */
    [attribute]: (node: Element, name: string, once: boolean) => (value: any) => void;
    /**
     * Events listeners
     * @param {Element} node
     * @param {string} type
     * @param {boolean} once
     * @returns
     */
    "@": (node: Element, type: string, once: boolean) => (value: any) => void;
    /**
     * Attribute toggle
     * @param {Element} node
     * @param {string} name
     * @param {boolean} once
     * @returns
     */
    "?": (node: Element, name: string, once: boolean) => (value: any) => void;
    /**
     * Direct accessor
     * @param {Element} node
     * @param {string} prop
     * @param {boolean} once
     * @returns
     */
    ".": (node: Element, prop: string, once: boolean) => (value: any) => void;
    key: () => any;
    /**
     * Aria attributes as object literal
     * @param {Element} node
     * @returns
     */
    aria: (node: Element) => (props: any) => void;
    /**
     * Dataset attributes as object literal
     * @param {Element} node
     * @returns
     */
    data: ({ dataset }: Element) => (props: any) => void;
};
export default _default;
import { attribute } from '../utils.js';
