import path from "node:path";
import { createFilter } from "vite";
import { compile } from "@zikojs/jsx";

export default function ZikoJSX({
  marker = "",
  include = ["**/*"],
  exclude,
} = {}) {
  const extensions = [".jsx", ".tsx"];
  let includeFilter;
  let root;

  const cleanId = (id) => id.replace(/\\/g, "/").split("?")[0].split("#")[0];

  const isJSXFile = (id) => {
    const clean = cleanId(id);
    if (includeFilter && !includeFilter(clean)) return false;
    return extensions.some((ext) =>
      marker
        ? clean.endsWith(`${marker}${ext}`)
        : clean.endsWith(ext)
    );
  };

  return {
    name: "ziko-jsx-loader",
    enforce: "pre",

    configResolved(config) {
      root = path.resolve(config.root).replace(/\\/g, "/");
      includeFilter = createFilter(include, exclude, { resolve: root });
    },

    async transform(src, id) {
      if (!isJSXFile(id)) return null;

      const code = await compile(src);
      return {
        code,
        map: null,
      };
    },

    handleHotUpdate({ file, server }) {
      if (!isJSXFile(file)) return;

      server.ws.send({
        type: "custom",
        event: "custom-update",
        data: {
          file,
          timestamp: Date.now(),
        },
      });

      return [file];
    },
  };
}