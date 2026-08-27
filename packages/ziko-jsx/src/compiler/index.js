import escodegen from 'escodegen'
export function compile(code, parse, transform) {
  const ast = parse(code)
  transform(ast)
  return escodegen.generate(ast)
}