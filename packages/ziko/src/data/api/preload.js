const preload=(url)=>{
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, false); 
    xhr.send();
    if (xhr.status === 200) {
      return xhr.responseText;
    } else {
      throw new Error(`Failed to fetch data from ${url}. Status: ${xhr.status}`);
    }
}
export {preload}