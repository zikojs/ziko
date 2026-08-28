import { Patterns } from "./patterns.js";
class Str{
    constructor(string){
        this.string=string;
    }
    isDigit() {
        return Patterns.isDigit.test(this.string);
    }
    static isDigit(string){
        return new Str(string).isDigit();
    }
    isNumber() {
        return !isNaN(this.string);
    }
    static isNumber(string){
        return new Str(string).isNumber();
    }
    isUrl(){
        return Patterns.isURL.test(this.string);
    }
    static isUrl(string){
        return new Str(string).isUrl();
    }
    isHexColor(){
        return Patterns.isHexColor.test(this.string);
    }
    static isHexColor(string){
        return new Str(string).isHexColor();
    }
    isIPv4(){
        return Patterns.isIPv4.test(this.string);
    }
    static isIPv4(string){
        return new Str(string).isIPv4();
    }
    isDate(){
        return Patterns.isDate.test(this.string);
    }
    static isDate(string){
        return new Str(string).isDate();
    }
    isMACAddress(){
        return Patterns.isMACAddress.test(this.string);
    }
    static isMACAddress(string){
        return new Str(string).isMACAddress();
    }
    isPascalCase(){
        if (this.string.length === 0) return false;
        const PascalCasePattern = /^[A-Z][a-zA-Z0-9]*$/;
        return PascalCasePattern.test(this.string);
    }
    static isPascalCase(string){
        return new Str(string).isPascalCase();
    }
    isCamelCase() {
        if (this.string.length === 0) return false;        
        const camelCasePattern = /^[a-z][a-zA-Z0-9]*$/;
        return camelCasePattern.test(this.string);
    }
    static isCamelCase(string){
        return new Str(string).isCamelCase();
    }
    isHyphenCase(){
        return this.string.split('-').length > 1;
    }
    static isHyphenCase(string){
        return new Str(string).isHyphenCase();
    }
    isSnakeCase(){
        return this.string.split('_').length > 1;
    }
    static isSnakeCase(string){
        return new Str(string).isSnakeCase();
    }
    isPalindrome(){
        const str=this.string.toLocaleLowerCase();
        let l=str.length,i;
        for(i=0;i<l/2;i++)if(str[i]!=str[l-i-1])return false;
        return true;
    }
    static isPalindrome(string){
        return new Str(string).isPalindrome();
    }
    static isAnagrams(word,words){
        word=word.split("").sort();
        words=words.split("").sort();
        return JSON.stringify(word)===JSON.stringify(words);
    }
    isIsogram(){
        return [...new Set(this.string.toLowerCase())].length===this.string.length; 
    }
    static isIsogram(string){
       return  new Str(string).isIsogram();
    }
    static camel2hyphencase(text) {
        return text.replace(/[A-Z]/g, match => '-' + match.toLowerCase());
    }
    static camel2snakecase(text) {
        return text.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
    }
    static camel2pascalcase(text) {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }
    static camel2constantcase(text) {
        return text.replace(/[A-Z]/g, match => '_' + match).toUpperCase();
    }
    static pascal2snakecase(text) {
        return text.replace(/([A-Z])/g, (match, offset) => offset ? '_' + match.toLowerCase() : match.toLowerCase());
    }
    static pascal2hyphencase(text) {
        return text.replace(/([A-Z])/g, (match, offset) => offset ? '-' + match.toLowerCase() : match.toLowerCase());
    }
    static pascal2camelcase(text) {
        return text.charAt(0).toLowerCase() + text.slice(1);
    }
    static pascal2constantcase(text) {
        return text.replace(/([A-Z])/g, (match, offset) => offset ? '_' + match : match).toUpperCase();
    }
    static snake2camelcase(text) {
        return text.replace(/(_\w)/g, match => match[1].toUpperCase());
    }
    static snake2hyphencase(text) {
        return text.replace(/_/g, "-");
    }
    static snake2pascalcase(text) {
        return text.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
    }
    static snake2constantcase(text) {
        return text.toUpperCase();
    }
    static hyphen2camelcase(text) {
        return text.replace(/-([a-z])/g, match => match[1].toUpperCase());
    }
    static hyphen2snakecase(text) {
        return text.replace(/-/g, '_');
    }
    static hyphen2pascalcase(text) {
        return text.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
    }
    static hyphen2constantcase(text) {
        return text.replace(/-/g, '_').toUpperCase();
    }
    static constant2camelcase(text) {
        return text.toLowerCase().replace(/_([a-z])/g, match => match[1].toUpperCase());
    }
    static constant2snakecase(text) {
        return text.toLowerCase();
    }
    static constant2pascalcase(text) {
        return text.toLowerCase().split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
    }
    static constant2hyphencase(text) {
        return text.toLowerCase().replace(/_/g, '-');
    }
}
const removeExtraSpace=str=>str.replace(/\s+/g,' ');
const count=(str,value)=>str.split("").filter(x => x==value).length;
const countWords=(str,value)=>str.split(" ").filter(x => x==value).length;

export{
    removeExtraSpace,
    count,
    countWords
}
const str=string=>new Str(string);
export{
    Str,
    str
}