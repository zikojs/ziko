import { parseDocument } from "htmlparser2"; 
import * as acorn from "acorn"; 
import postcss from "postcss";

// Helper to generate a unique scope ID for each component
function generateScopeId() {
  return "ziko-" + Math.random().toString(36).substring(2, 8);
}

// Custom PostCSS plugin to wrap selectors with :where(.scope-id)
const scopeCssPlugin = (scopeId) => {
  return {
    postcssPlugin: "postcss-ziko-scoper",
    Rule(rule) {
      // Avoid re-scoping keyframes or already scoped rules
      if (rule.parent && rule.parent.name === "keyframes") return;

      rule.selectors = rule.selectors.map(selector => {
        // Transforms `div` into `:where(.ziko-a1b2c3) div`
        return `:where(.${scopeId}) ${selector}`;
      });
    }
  };
};

export async function HtmlToZikoJsIR(html, customPostcssPlugins = []) { 
  const document = parseDocument(html); 
  const tags = new Set(); 
  const data = []; 
  let props = {}; 

  const scopeId = generateScopeId();
  let isScopeAppliedToRoot = false;

  for (const node of document.children) {
    if (node.type === "comment") continue;

    switch (node.type) { 
      case "script": { 
        const rawScript = getTextContent(node); 
        const { props: extractedProps, script } = scriptToProps(rawScript); 

        props = { ...props, ...extractedProps }; 

        data.push({ 
          type: "script", 
          content: script 
        }); 
        break; 
      } 

      case "style": {
        const rawCss = getTextContent(node);
        
        // Scope the CSS rules using PostCSS
        const plugins = [scopeCssPlugin(scopeId), ...customPostcssPlugins];
        const result = await postcss(plugins).process(rawCss, { from: undefined });

        data.push({ 
          type: "style", 
          content: result.css 
        }); 
        break; 
      } 

      default: { 
        // Attach the scope class to the top-level HTML element
        if (node.type === "tag" && !isScopeAppliedToRoot) {
          node.attribs = node.attribs || {};
          node.attribs.class = node.attribs.class 
            ? `${node.attribs.class} ${scopeId}` 
            : scopeId;
          isScopeAppliedToRoot = true;
        }

        const content = nodeToZikoString(node, tags); 
        if (!content) break; 

        data.push({ 
          type: "template", 
          content 
        }); 
      } 
    } 
  } 

  return { scopeId, tags, props, data }; 
} 

export function scriptToProps(script) { 
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