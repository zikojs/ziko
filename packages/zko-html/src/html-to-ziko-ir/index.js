import { parseDocument } from "htmlparser2";
import * as acorn from "acorn";

export function HtmlToZikoJsIR(html) {
  const document = parseDocument(html);
  const tags = new Set();
  const data = [];
  let props = {};

  document.children
    .filter(node => node.type !== "comment")
    .forEach(node => {
      switch (node.type) {
        case "script": {
          const rawScript = getTextContent(node);
          const { props: extractedProps, script } = scriptToProps(rawScript);

          // Merge extracted props into root props object
          props = { ...props, ...extractedProps };

          data.push({
            type: "script",
            content: script
          });
          break;
        }

        case "style":
          data.push({
            type: "style",
            content: getTextContent(node)
          });
          break;

        default: {
          const content = nodeToZikoString(node, tags);
          if (!content) return;

          data.push({
            type: "template",
            content
          });
        }
      }
    });

  return { tags, props, data };
}

export function scriptToProps(script) {
  // Normalize mismatched string quotes (e.g., "test' -> "test")
  const sanitizedScript = script.replace(/(["'])(.*?)(["'])/g, (match, open, body, close) => {
    return `${open}${body}${open}`;
  });

  let ast;
  try {
    ast = acorn.parse(sanitizedScript, {
      ecmaVersion: "latest",
      sourceType: "module"
    });
  } catch (e) {
    return { props: {}, script };
  }

  const props = {};
  const ranges = [];

  for (const node of ast.body) {
    // 1. Export named declarations: export let title = "test"
    if (
      node.type === "ExportNamedDeclaration" &&
      node.declaration?.type === "VariableDeclaration"
    ) {
      for (const declarator of node.declaration.declarations) {
        if (declarator.id.type === "Identifier") {
          props[declarator.id.name] = declarator.init
            ? sanitizedScript.slice(declarator.init.start, declarator.init.end)
            : undefined;
        }
      }
      ranges.push([node.start, node.end]);
      continue;
    }

    // 2. HTML.Props destructuring: const { title = "test", description } = HTML.Props
    if (node.type === "VariableDeclaration") {
      for (const declarator of node.declarations) {
        const isHtmlProps =
          declarator.init?.type === "MemberExpression" &&
          declarator.init.object?.name === "HTML" &&
          declarator.init.property?.name === "Props";

        if (isHtmlProps && declarator.id.type === "ObjectPattern") {
          for (const prop of declarator.id.properties) {
            if (prop.type === "Property") {
              const key = prop.key.name;

              if (prop.value.type === "AssignmentPattern") {
                const defaultValue = sanitizedScript.slice(
                  prop.value.right.start,
                  prop.value.right.end
                );
                props[key] = defaultValue;
              } else {
                props[key] = undefined;
              }
            }
          }
          ranges.push([node.start, node.end]);
        }
      }
    }
  }

  // Remove the extracted prop statements from script string
  let rest = sanitizedScript;
  for (let i = ranges.length - 1; i >= 0; i--) {
    const [start, end] = ranges[i];
    rest = rest.slice(0, start) + rest.slice(end);
  }

  return {
    props,
    script: rest.trim()
  };
}

function getTextContent(node) {
  return node.children
    ? node.children
        .filter(child => child.type === "text")
        .map(child => child.data)
        .join("")
        .trim()
    : "";
}

function nodeToZikoString(node, tags) {
  switch (node.type) {
    case "text": {
      const value = node.data;
      if (!value.trim()) return null;
      return parseText(value);
    }

    case "tag": {
      const tag = node.name;
      tags.add(tag);

      const props = Object.entries(node.attribs ?? {})
        .map(([key, value]) => {
          if (value === "") {
            return `${JSON.stringify(key)}: true`;
          }

          return `${JSON.stringify(key)}: ${parseAttributeValue(value)}`;
        })
        .join(", ");

      const children = (node.children ?? [])
        .map(child => nodeToZikoString(child, tags))
        .filter(Boolean);

      const args = [];

      if (props) {
        args.push(`{ ${props} }`);
      }

      args.push(...children);

      return `${tag}(${args.join(", ")})`;
    }

    default:
      return null;
  }
}

function parseAttributeValue(value) {
  const regex = /\{([a-zA-Z_$][\w$]*(?:\.[\w$]+)*)\}/g;

  if (!regex.test(value)) {
    return JSON.stringify(value);
  }

  regex.lastIndex = 0;

  let result = "";
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(value))) {
    result += value.slice(lastIndex, match.index);
    result += `\${${match[1]}}`;
    lastIndex = regex.lastIndex;
  }

  result += value.slice(lastIndex);

  return `\`${result}\``;
}

function parseText(value) {
  const parts = [];
  const regex = /\{([a-zA-Z_$][\w$]*(?:\.[\w$]+)*)\}/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(value))) {
    const text = value.slice(lastIndex, match.index);

    if (text.trim()) {
      parts.push(JSON.stringify(text));
    }

    parts.push(match[1]);
    lastIndex = regex.lastIndex;
  }

  const remaining = value.slice(lastIndex);

  if (remaining.trim()) {
    parts.push(JSON.stringify(remaining));
  }

  return parts.length === 1 ? parts[0] : parts.join(", ");
}