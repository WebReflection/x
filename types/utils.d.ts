export const attribute: unique symbol;
/**
 * @param {any} Map
 * @returns
 */
export function direct(Map: any): {
    new (): {
        [x: string]: any;
        /**
         * @template T
         * @param {string|WeakKey} key
         * @param {T} value
         * @returns {T}
         */
        set<T>(key: string | WeakKey, value: T): T;
    };
    [x: string]: any;
};
export const isArray: (arg: any) => arg is any[];
/**
 * @param {any} value
 * @returns
 */
export function isObject(value: any): boolean;
export const keys: {
    (o: object): string[];
    (o: {}): string[];
};
export const empty: never[];
