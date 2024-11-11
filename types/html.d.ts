export { render };
export const html: (t: TemplateStringsArray | string[], ...v: any[]) => import("./tag.js").Fragment | Node | import("./tag.js").TagResult;
export const svg: (t: TemplateStringsArray | string[], ...v: any[]) => import("./tag.js").Fragment | Node | import("./tag.js").TagResult;
import { render } from './tag.js';
