export const complex_constructor = (Complex, a, b) => {
    let _a, _b;
  if (a instanceof Complex) {
    _a = a.a;
    _b = a.b;
  } 
  else if (typeof a === "object") {
    if ("a" in a && "b" in a) {
      _a = a.a;
      _b = a.b;
    } 
    else if ("a" in a && "z" in a) {
      _a = a.a;
      _b = Math.sqrt(a.z ** 2 - a.a ** 2);
    } 
    else if ("a" in a && "phi" in a) {
      _a = a.a;
      _b = a.a * Math.tan(a.phi);
    } 
    else if ("b" in a && "z" in a) {
      _b = a.b;
      _a = Math.sqrt(a.z ** 2 - a.b ** 2);
    } 
    else if ("b" in a && "phi" in a) {
      _b = b;
      _a = a.b / Math.tan(a.phi);
    } 
    else if ("z" in a && "phi" in a) {
      _a = +a.z * Math.cos(a.phi).toFixed(15);
      _b = +a.z * Math.sin(a.phi).toFixed(15);
    }
  } 
  else if (typeof a === "number" && typeof b === "number") {
    _a = +a.toFixed(32);
    _b = +b.toFixed(32);
  }
  return [_a, _b]
};
