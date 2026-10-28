export declare class UINode {
    cache: {
        node: Node;
    };

    constructor(node: Node);

    isUINode(): true;

    get node(): Node;
}
