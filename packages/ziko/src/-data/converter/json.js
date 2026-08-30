const _objects2arr=data=>data instanceof Array?[Object.keys(data[0]),...data.map(n=>Object.values(n))]:[Object.keys(data)];
const _objects2csv=(data,delimiter)=>_objects2arr(data).map(n=>n.join(delimiter)).join("\n")
const json2arr=json=>json instanceof Object?_objects2arr(json):_objects2arr(JSON.parse(json));
const json2csv=(json,delimiter=",")=>json instanceof Object?_objects2csv(json,delimiter):_objects2csv(JSON.parse(json),delimiter);
const json2csvFile=(json,delimiter)=>{
    const str=json2csv(json,delimiter);
    const blob=new Blob([str], { type: 'text/csv;charset=utf-8;' });
    return{
       str,
       blob,
       url:URL.createObjectURL(blob)
    }
}
const _processObject=(obj, indent)=>{
    const yml = [];
    if (Array.isArray(obj)) {
        obj.forEach(item => {
            if (typeof item === 'object' && item !== null) {
                yml.push(`${indent}-`);
                const nestedLines = _processObject(item, `${indent}  `);
                yml.push(...nestedLines);
            } else yml.push(`${indent}- ${item}`);
        });
    } else {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const value = obj[key];
                if (typeof value === 'object' && value !== null) {
                    yml.push(`${indent}${key}:`);
                    const nestedLines = _processObject(value, `${indent}  `);
                    yml.push(...nestedLines);
                } else {
                    yml.push(`${indent}${key}: ${value}`);
                }
            }
        }
    }
    return yml;
}
const _object2yml=(object,indent="")=>_processObject(object,indent).join('\n')
const json2yml=(json,indent)=>json instanceof Object?_object2yml(json,indent):_object2yml(JSON.parse(json),indent)
const json2ymlFile=(json,indent)=>{
    const str=json2yml(json,indent);
    const blob=new Blob([str], { type: 'text/yml;charset=utf-8;' });
    return{
       str,
       blob,
       url:URL.createObjectURL(blob)
    }
}
const json2xml=(json, indent = 1)=>{
    let xml = '';
    for (const key in json) {
      if (json.hasOwnProperty(key)) {
        const value = json[key];
        xml += '\n' + ' '.repeat(indent) + `<${key}>`;
        (typeof value === 'object') ? xml += json2xml(value, indent + 2) : xml += `${value}`;
        xml += `</${key}>`;
      }
    }
    return xml.trim();
  }
const json2xmlFile=(json,indent)=>{
    const str=json2xml(json,indent);
    const blob=new Blob([str], { type: 'text/xml;charset=utf-8;' });
    return{
       str,
       blob,
       url:URL.createObjectURL(blob)
    }
}
export{
    json2arr,
    json2csv,
    json2csvFile,
    json2yml,
    json2ymlFile,
    json2xml,
    json2xmlFile
}
