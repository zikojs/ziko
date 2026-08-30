const json2css=(json, indentLevel = 0)=>{
    json = trimKeys(json);
    let cssText = '';
    const indent = '  '.repeat(indentLevel); 

    for (let selector in json) {
        if (typeof json[selector] === 'object') {
            cssText += `${indent}${selector} {\n`;
            const properties = json[selector];
            for (let property in properties) {
                if (typeof properties[property] === 'object') {
                    cssText += json2css({ [property]: properties[property] }, indentLevel + 1);
                } else {
                    cssText += `${indent}  ${property.replace(/[A-Z]/g, match => '-' + match.toLowerCase())}: ${properties[property]};\n`;
                }
            }

            cssText += `${indent}}\n`; 
        }
    }

    return cssText;
}
function trimKeys(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return obj; 
    }

    return Object.keys(obj).reduce((acc, key) => {
        const trimmedKey = key.trim();
        acc[trimmedKey] = trimKeys(obj[key]);
        return acc;
    }, Array.isArray(obj) ? [] : {});
}
export{
    json2css
}