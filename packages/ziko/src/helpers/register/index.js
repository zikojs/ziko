import { register_to_class } from "./register-to-class.js";
import { register_to_instance } from "./register-to-instance.js"; // Not Overridable
export const register = (target, ...mixins) => {
  console.log(target)
  // return register_to_class(target, ...mixins)
  if(typeof target === 'function') register_to_class(target, ...mixins)
  else register_to_instance(target, ...mixins)
  }