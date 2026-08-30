/**
 * Represents a parsed XML node.
 */
export interface XMLNode {
    /**
     * The XML tag name of the node.
     */
    type: string;

    /**
     * The attributes of the XML node.
     */
    attributes: Record<string, string>;

    /**
     * The child elements of the XML node.
     */
    children: XMLNode[];

    /**
     * The text content of the node, if available.
     */
    text?: string;
}

/**
 * Parses an XML string into a tree-like JavaScript object representation.
 *
 * @param xmlString - The XML document as a string.
 * @returns The parsed XML node tree.
 *
 * @example
 * ```ts
 * const xml = `<root><item id="1">Hello</item></root>`;
 * const tree = parseXML(xml);
 *
 * console.log(tree.type); // "root"
 * console.log(tree.children[0].attributes.id); // "1"
 * ```
 */
export declare function parseXML(xmlString: string): XMLNode;