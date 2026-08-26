export const is_camelcase = (text = '') =>{
    if (text.length === 0) return false; 
    const camelCasePattern = /^[a-z][a-zA-Z0-9]*$/;
    return camelCasePattern.test(text);
}
export const is_hyphencase = (text = '') => text.split('-').length > 0;
export const is_snakeCase = (text = '') => text.split('_').length > 0;
export const is_pascalcalse = (text = '') => {
    if (text.length === 0) return false;
    const PascalCasePattern = /^[A-Z][a-zA-Z0-9]*$/;
    return PascalCasePattern.test(text);
}

export const is_palindrome = text =>{
    const str = text.toLocaleLowerCase();
    let l = str.length,i;
    for(i=0;i<l/2;i++)if(str[i]!=str[l-i-1])return false;
    return true;
}

export const is_anagram = (word, words) =>{
        word=word.split("").sort();
        words=words.split("").sort();
        return JSON.stringify(word)===JSON.stringify(words);    
}

export const is_isogram = (text = '') => [...new Set(text.toLowerCase())].length === text.length;