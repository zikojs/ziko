import * as acorn from "acorn";

export function scriptToProps(script) {
  const ast = acorn.parse(script, {
    ecmaVersion: "latest",
    sourceType: "module"
  });

  const props = {};
  const ranges = [];

  for (const node of ast.body) {
    let declaration = null;

    // Supports:
    // export const ...
    if (
      node.type === "ExportNamedDeclaration" &&
      node.declaration?.type === "VariableDeclaration"
    ) {
      declaration = node.declaration;
      ranges.push([node.start, node.end]);
    }

    // Supports:
    // const ...
    else if (node.type === "VariableDeclaration") {
      declaration = node;
      ranges.push([node.start, node.end]);
    }

    if (!declaration) continue;

    for (const declarator of declaration.declarations) {
      if (declarator.id.type !== "ObjectPattern") {
        continue;
      }

      // Optional safety check:
      // only process `= HTML.Props`
      if (!isHTMLProps(declarator.init)) {
        continue;
      }

      for (const property of declarator.id.properties) {
        if (property.type === "RestElement") {
          continue;
        }

        if (property.type !== "Property") {
          continue;
        }

        const propName = getPropertyName(property.key);
        if (!propName) continue;

        props[propName] = property.value;
      }
    }
  }

  let rest = script;

  for (let i = ranges.length - 1; i >= 0; i--) {
    const [start, end] = ranges[i];
    rest = rest.slice(0, start) + rest.slice(end);
  }

  return {
    props,
    script: rest.trim()
  };
}

function isHTMLProps(node) {
  return (
    node?.type === "MemberExpression" &&
    !node.computed &&
    node.object.type === "Identifier" &&
    node.object.name === "HTML" &&
    node.property.type === "Identifier" &&
    node.property.name === "Props"
  );
}

function getPropertyName(node) {
  if (node.type === "Identifier") {
    return node.name;
  }

  if (node.type === "Literal" && typeof node.value === "string") {
    return node.value;
  }

  return null;
}