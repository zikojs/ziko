import { tags } from "../../dom"
const svg2str=svg=>(new XMLSerializer()).serializeToString(svg);
const svg2ascii=svg=>btoa(svg2str(svg));
const svg2imgUrl=svg=>'data:image/svg+xml;base64,'+svg2ascii(svg);
const svg2img=(svg,render=true)=>tags.img(svg2imgUrl(svg)).mount(render);
export{
    svg2str,
    svg2ascii,
    svg2imgUrl,
    svg2img
}