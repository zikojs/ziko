export * from './call_with_optional_props.js';
export * from './parse_props.js';
export * from './checkers.js'

export function add_vendor_prefix(property) {
	const propertyUC = property.slice(0, 1).toUpperCase() + property.slice(1);
	const vendors = ['Webkit', 'Moz', 'O', 'ms'];
	for(let i = 0, len = vendors.length; i < len; i++) {
		const vendor = vendors[i];
		if(typeof (globalThis?.document?.body).style[vendor + propertyUC] !== 'undefined') return vendor + propertyUC;
	}
	return property;
}
export const normalize_css_value = value => typeof value === 'number' ? value+'px' : value;
export const add_class = (UIElement, name) => UIElement.element.className = UIElement.element.className.replace(/\s+$/gi, '') + ' ' + name;
export const remove_class =(UIElement, name) => UIElement.element.className = UIElement.element.className.replace(name, '');

// const addSuffixeToNumber=(value,suffixe="px")=>{
//   if(typeof value === "number") value+=suffixe;
//   if(value instanceof Array)value=value.map(n=>typeof n==="number"?n+=suffixe:n).join(" ");
//   return value;
// }

// const Id = (a) => document.getElementById(a);
// const Class = (a) => [...document.getElementsByClassName(a)];
// const $=(...selector)=>{
//   var ele=[]
//   for(let i=0;i<selector.length;i++){
//     if(typeof selector[i]=="string")ele.push(...document.querySelectorAll(selector[i]));
//     if(selector[i] instanceof UIElement)ele.push(selector[i].element)
//   }
//   return ele.length===1?ele[0]:ele;
// }

const style = (el, styles) => {if(el)Object.assign(el.style, styles)};

function script(src) {
  const Script = document?.createElement("script");
  Script.setAttribute("src", src);
  document.head.appendChild(Script);
}
function linkStyle(href) {
  const link = document?.createElement("link");
  link.setAttribute("rel", "stylesheet");
  link.setAttribute("href", href);
  document.head.appendChild(link);
}
const CloneElement = (UIElement) => {
  var clone = new UIElement.__proto__.constructor()
  //waitForUIElm(UIElement).then(e=>console.log(e)).then(()=>clone = new UIElement.__proto__.constructor())
  //let a = new UIElement.__proto__.constructor()
  return clone;
};
const cloneUI=UIElement=>{
  return Object.assign(Object.create(Object.getPrototypeOf(UIElement)),UIElement)
}
// function isPrimitive(value) {
//     return typeof value !== 'object' && typeof value !== 'function' || value === null;
// }
const waitElm=(UIElement)=>{
    return new Promise(resolve => {
        if (UIElement) {
            return resolve(UIElement);
        }
        const observer = new MutationObserver(() => {
            if (UIElement) {
                resolve(UIElement);
                observer.disconnect();
            }
        });
        observer.observe(document?.body, {
            childList: true,
            subtree: true
        });
    });
  }
export{
  // Id,
  // Class,
  style,
  script,
  linkStyle,
  CloneElement,
  cloneUI,
  // isPrimitive,
  // addSuffixeToNumber,
  waitElm
}