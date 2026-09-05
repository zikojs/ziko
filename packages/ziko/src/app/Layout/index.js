import { tags } from '../../dom/tags/index.js'
import { call_with_optional_props } from '../../dom/internal-utils/call_with_optional_props.js'

const { meta, link, script } = tags;

export class UILayout {

  constructor(
    {
      title,
      icon,
      description,
      lang,
      links = [],
      script: scripts = [],
      meta: metas = [],
    } = {},
    ...ui
  ) {
    this.options = {
      title,
      icon,
      description,
      lang,
      links,
      meta: metas,
      script: scripts,
    };

    this.ui = ui;
    this.render()
  }

  render() {
    if (typeof document === "undefined") {
      return {
        ...this.options,
        body: this.ui,
      };
    }

    const {
      title,
      icon,
      description,
      lang,
      links,
      meta: metas,
      script: scripts,
    } = this.options;

    if (title) {
      document.title = title;
    }

    if (lang) {
      document.documentElement.lang = lang;
    }

    if (icon) {
      document.head.appendChild(
        link({
          rel: "icon",
          href: icon,
        })
      );
    }

    if (description) {
      document.head.appendChild(
        meta({
          name: "description",
          content: description,
        })
      );
    }

    for (const attrs of links) {
      document.head.appendChild(link(attrs));
    }

    for (const attrs of metas) {
      document.head.appendChild(meta(attrs));
    }

    for (const attrs of scripts) {
      document.head.appendChild(script(attrs));
    }
  }

  mount(target){
    this.ui.forEach(el => el.mount(target));
    return this
  }

}

export const Layout = call_with_optional_props(UILayout)