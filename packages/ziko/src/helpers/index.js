export * from './register/index.js'
export * from './checkers/index.js'

const __ExtractAll__ =(obj)=> {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (!["__ExtractAll__","__RemoveAll__","ExtractAll","RemoveAll"].includes(key)) {
            globalThis[key] = obj[key];
        }
    }
}
const __RemoveAll__ =(obj)=> {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (key !== '__RemoveAll__') {
            delete globalThis[key];
        }
    }
}
export const mixin = (target, ...sources) => {
    sources.forEach(source => {
        Object.getOwnPropertyNames(source.prototype).forEach(name => {
            if (name !== 'constructor') {
                target[name] = source.prototype[name];
            }
        });
    });
}

// class A {
//     constructor(){
//         this.msg="from A";
//     }
//     a() {
//         console.log(this.msg);
//         return this;
//     }
// }

// class B{
//     constructor(){
//         this.msg="from B";
//     }
//     b() {
//         console.log(this.msg);
//         return this;
//     }
// }

// class AB {
//     constructor() {
//         this.msg="from AB"
//         mixin(this.__proto__, A, B);
//     }
// }

// ab=new AB()
export{
    __ExtractAll__,
    __RemoveAll__
}


