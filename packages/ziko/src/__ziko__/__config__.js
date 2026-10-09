export const __Config__ = {
    default:{
        target:null,
        autoMount:false,
    },
    setDefault:function(pairs){
        const keys = Object.keys(pairs);
        const values = Object.values(pairs);
        for(let i=0; i<keys.length; i++) this.default[keys[i]]=values[i];
    },
    init:()=>{
        // document.documentElement.setAttribute("data-engine","zikojs")
    },
    renderingMode :'spa',
    isSSC : false,
}