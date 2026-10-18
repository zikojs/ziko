import { Parser } from "acorn"
import jsx from "acorn-jsx"

const JSXParser = Parser.extend(jsx())

export function parse(code) {
  return JSXParser.parse(code, {
    ecmaVersion: "latest",
    sourceType: "module"
  })
}
