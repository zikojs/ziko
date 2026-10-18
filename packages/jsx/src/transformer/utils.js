function jsxNameToId(name) {
  if (name.type === "JSXIdentifier") {
    let id = name.name.replace(/[^A-Za-z0-9_$]/g, "_");
    if (/^[0-9]/.test(id)) id = "_" + id;
    return { type: "Identifier", name: id };
  }
  throw new Error("Unsupported JSX name")
}

function transformAttributes(attrs) {
  if (!attrs.length) return null

  return {
    type: "ObjectExpression",
    properties: attrs.map(attr => ({
      type: "Property",
      key: { type: "Identifier", name: attr.name.name },
      value: attr.value
        ? attr.value.type === "Literal"
          ? attr.value
          : attr.value.expression
        : { type: "Literal", value: true },
      kind: "init"
    }))
  }
}

function transformChild(child) {
  if (!child) return null

  switch (child.type) {
    case "JSXText": {
      const text = child.value.trim()
      if (!text) return null
      return { type: "Literal", value: text }
    }

    case "JSXExpressionContainer":
      return child.expression

    case "JSXElement":
      return transformJSX(child)

    default:
      return child
  }
}

export function transformJSX(node) {
  const tag = jsxNameToId(node.openingElement.name)

  const attrs = transformAttributes(node.openingElement.attributes)
  const children = node.children
    .map(transformChild)
    .filter(Boolean)

  return {
    type: "CallExpression",
    callee: tag,
    arguments: [
      ...(attrs ? [attrs] : []),
      ...children
    ]
  }
}