import { Parser } from "acorn";
import jsx from "acorn-jsx";
import * as walk from "acorn-walk";
import escodegen from "escodegen";

const JSXParser = Parser.extend(jsx());

// --- Parser ---
export function parse(code) {
  return JSXParser.parse(code, {
    ecmaVersion: "latest",
    sourceType: "module"
  });
}

function jsxNameToId(name) {
  if (name.type === "JSXIdentifier") {
    let id = name.name.replace(/[^A-Za-z0-9_$]/g, "_");
    if (/^[0-9]/.test(id)) id = "_" + id;
    return { type: "Identifier", name: id };
  }
  throw new Error("Unsupported JSX name");
}

function transformAttributes(attrs) {
  if (!attrs.length) return null;

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
  };
}

/**
 * JSX whitespace rules:
 * - Collapse whitespace
 * - Ignore indentation-only nodes
 * - Trim start if first child
 * - Trim end if last child
 */
function transformChild(child, index, siblings) {
  if (!child) return null;

  switch (child.type) {
    case "JSXText": {
      const raw = child.value;

      // Collapse whitespace
      let text = raw.replace(/\s+/g, " ");

      // Drop indentation-only nodes
      if (text.trim() === "") return null;

      const hasNewline = raw.includes("\n");

      if (hasNewline) {
        // Block text → trim fully
        text = text.trim();
      } else {
        // Inline text → trim by position
        if (index === 0) text = text.trimStart();
        if (index === siblings.length - 1) text = text.trimEnd();
      }

      return { type: "Literal", value: text };
    }

    case "JSXExpressionContainer":
      return child.expression;

    case "JSXElement":
      return transformJSX(child);

    default:
      return child;
  }
}


function transformJSX(node) {
  const tag = jsxNameToId(node.openingElement.name);
  const attrs = transformAttributes(node.openingElement.attributes);

  const children = node.children
    .map((child, i, arr) => transformChild(child, i, arr))
    .filter(Boolean);

  return {
    type: "CallExpression",
    callee: tag,
    arguments: [
      ...(attrs ? [attrs] : []),
      ...children
    ]
  };
}

// --- Transformer ---
export function transform(ast) {
  const baseWithJSX = Object.assign({}, walk.base, {
    JSXElement(node, state, visit) {
      if (node.openingElement)
        visit(node.openingElement, state, "JSXOpeningElement");
      for (let i = 0; i < (node.children || []).length; i++)
        visit(node.children[i], state);
      if (node.closingElement)
        visit(node.closingElement, state, "JSXClosingElement");
    },
    JSXOpeningElement(node, state, visit) {
      if (node.name) visit(node.name, state);
      for (let i = 0; i < (node.attributes || []).length; i++)
        visit(node.attributes[i], state);
    },
    JSXClosingElement(node, state, visit) {
      if (node.name) visit(node.name, state);
    },
    JSXExpressionContainer(node, state, visit) {
      if (node.expression) visit(node.expression, state, "Expression");
    },
    JSXAttribute(node, state, visit) {
      if (node.name) visit(node.name, state);
      if (node.value) visit(node.value, state);
    },
    JSXText() {},
    JSXIdentifier() {}
  });

  const scopeTags = new Map();

  walk.ancestor(ast, {
    JSXElement(node, state, ancestors) {
      Object.assign(node, transformJSX(node));

      const tagName = node.callee?.name;
      if (!tagName) return;

      // Ignore components (Capitalized)
      if (!/^[a-z]/.test(tagName)) return;

      const scope = ancestors.slice().reverse().find(a =>
        a.type === "ArrowFunctionExpression" ||
        a.type === "FunctionDeclaration" ||
        a.type === "FunctionExpression" ||
        a.type === "Program"
      );

      const set = scopeTags.get(scope) || new Set();
      set.add(tagName);
      scopeTags.set(scope, set);
    }
  }, baseWithJSX);

  for (const [scope, tags] of scopeTags) {
    const tagNames = [...tags];
    if (!tagNames.length) continue;

    const decl = {
      type: "VariableDeclaration",
      kind: "const",
      declarations: [{
        type: "VariableDeclarator",
        id: {
          type: "ObjectPattern",
          properties: tagNames.map(n => ({
            type: "Property",
            key: { type: "Identifier", name: n },
            value: { type: "Identifier", name: n },
            shorthand: true
          }))
        },
        init: { type: "Identifier", name: "tags" }
      }]
    };

    if (scope.type === "Program") {
      scope.body.unshift(decl);
    } else {
      if (scope.body.type !== "BlockStatement") {
        scope.body = {
          type: "BlockStatement",
          body: [{ type: "ReturnStatement", argument: scope.body }]
        };
        scope.expression = false;
      }
      scope.body.body.unshift(decl);
    }
  }

  // Ensure import { tags } from "ziko/dom"
  if (ast.type === "Program" && scopeTags.size) {
    const hasImport = ast.body.some(n =>
      n.type === "ImportDeclaration" &&
      n.specifiers.some(s => s.local?.name === "tags")
    );

    if (!hasImport) {
      ast.body.unshift({
        type: "ImportDeclaration",
        specifiers: [{
          type: "ImportSpecifier",
          imported: { type: "Identifier", name: "tags" },
          local: { type: "Identifier", name: "tags" }
        }],
        source: { type: "Literal", value: "ziko/dom" }
      });
    }
  }

  return ast;
}

// --- Compiler ---
export function compile(code) {
  const ast = parse(code);
  transform(ast);
  return escodegen.generate(ast);
}

// // // --- Test ---
// const code = `
// export default function Hello(){
//     return <h1> Hello world </h1>
// }
// // const App = ({ text = "world" } = {}) => (
// //   <div class="box">
// //     <Comp a="kk" />
// //     Hello
// //     <h1>Hello   {text}</h1>
// //     <span>hello {text}</span>
// //     <custom-el></custom-el>
// //   </div>
// // )
// `;

// console.log(compile(code));
