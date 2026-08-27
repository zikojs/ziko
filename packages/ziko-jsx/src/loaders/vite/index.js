import { compile } from "../../index.js";

export default function ZikoJSX() {
  return {
    name: "ziko-jsx-loader",
    enforce: 'pre',
    async transform(src, id) {
    if (!id.endsWith(".jsx") && !id.endsWith(".tsx")) return null;
        const code = await compile(src);
        console.log(code)
        return {
          code,
          map: null,
        };
    },

    handleHotUpdate({ file, server }) {
      if (file.endsWith(".jsx") || file.endsWith(".jsx")) {
        server.ws.send({
          type: "custom",
          event: "custom-update",
          data: {
            file,
            timestamp: Date.now(),
          },
        });

        return [file];
      }
    },
  };
}