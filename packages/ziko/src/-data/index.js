export * from "./api"
export * from "./converter"
export * from "./parser"
export * from "./string-dep"

import * as Api from "./api"
import * as Converter from "./converter"
import * as Parser from "./parser"
import * as String from "./string-dep"

const Data = {
    ...Api,
    ...Converter,
    ...Parser,
    ...String
}
export default Data