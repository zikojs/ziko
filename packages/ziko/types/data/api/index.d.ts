// fetchdom.d.ts

/**
 * Fetches a URL and parses it into a DOM Document asynchronously.
 * @param url The URL to fetch. Defaults to 'https://github.com/zakarialaoui10'.
 * @returns A Promise resolving to the root element of the parsed DOM.
 */
export function fetchdom(url?: string): Promise<Element>;

/**
 * Fetches a URL synchronously (using `preload`) and parses it into a DOM Document.
 * @param url The URL to fetch. Defaults to 'https://github.com/zakarialaoui10'.
 * @returns The root element of the parsed DOM.
 */
export function fetchdomSync(url?: string): Element;
