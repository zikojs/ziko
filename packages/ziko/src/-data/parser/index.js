export function parseXML(xmlString) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    const rootNode = xmlDoc.documentElement;
    const result = parseNode(rootNode);
    return result;
  }
  
  function parseNode(node) {
    const obj = {
      type: node.nodeName,
      attributes: {},
      children: []
    };
    for (let i = 0; i < node.attributes.length; i++) {
      const attr = node.attributes[i];
      obj.attributes[attr.name] = attr.value;
    }
    for (let i = 0; i < node.childNodes.length; i++) {
      const child = node.childNodes[i];
      if (child.nodeType === Node.ELEMENT_NODE) {
        obj.children.push(parseNode(child));
      } else if (child.nodeType === Node.TEXT_NODE) {
        obj.text = child.textContent.trim();
      }
    }
    return obj;
  }
