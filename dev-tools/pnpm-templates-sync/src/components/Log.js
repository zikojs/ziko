import { tags } from "ziko/dom";
const {
    div, h1, span, h2, section, pre, table, tbody, tr, td
} = tags

export function Log(pckg){
    return div(
        pckg
    ).style({color : "green"})
}
export function PrepreLog(pckg){
    return div(
        span('✓ Prepared : ').style({color : 'green'}),
        span(pckg).style({color : 'blue'})
    )
}
export function RestoreLog(pckg){
    return div(
        span('✓ Restored : ').style({color : 'gold'}),
        span(pckg).style({color : 'blue'})
    )
}