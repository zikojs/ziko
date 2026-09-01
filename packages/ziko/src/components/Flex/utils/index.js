export function set_vertical(direction){
  direction == 1
    ? this.style({ flexDirection: "column" })
    : direction == -1 && this.style({ flexDirection: "column-reverse" });
  return this;
}
export function set_horizontal(direction){
    direction == 1
        ? this.style({ flexDirection: "row" })
        : direction == -1 && this.style({ flexDirection: "row-reverse" });
    return this;
}
export function map_pos_x(align){
    let pos = ["flex-start", "center", "flex-end"];
    if (typeof align === "number") align = pos[align + 1];
    return align;
}
export function map_pos_y(align){
    return map_pos_x(-align);
}