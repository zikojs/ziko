const parseInlineElements = text => {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
        .replace(/\*(.*?)\*/g, '<em>$1</em>')              
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')  
        .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1">') 
        .replace(/`([^`]+)`/g, '<code>$1</code>'); // Inline Code
};

const parseTable = line => {
    const cells = line.split('|').map(cell => cell.trim()).filter(cell => cell !== '');
    const tableRow = cells.map(cell => `<td>${parseInlineElements(cell)}</td>`).join('');
    return `<tr>${tableRow}</tr>\n`;
};

const parseCodeBlock = (lines, language) => {
    const codeContent = lines.join('\n'); // No need to exclude the triple backticks
    const highlightedCode = language ? `<pre><code data-language="${language}">${codeContent}</code></pre>` : `<pre><code>${codeContent}</code></pre>`;
    return `${highlightedCode}\n`;
};

const parseList = line => {
    const DIGIT_FOLLOWED_BY_A_DOT_AND_SPACE = /^\d+\.\s/; 
    const match = line.match(DIGIT_FOLLOWED_BY_A_DOT_AND_SPACE);
    if (match) {
        let start = +match[1];
        return `<ol${start===1?"":` start="${start}"`}>${parseInlineElements(line.slice(match[0].length))}</ol>\n`;
    }  
    return `<ul>${parseInlineElements(line)}</ul>\n`;
};

const parseHorizontalRule = () => {
    return '<hr>\n';
};

const markdown2html = markdownText => {
    const lines = markdownText.split('\n');
    let htmlOutput = '';
    let inTable = false;
    let inCodeBlock = false;
    let codeBlockLines = [];
    let codeBlockLanguage = '';
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        // Table
        if (line.startsWith('|')) {
            if (!inTable) {
                inTable = true;
                htmlOutput += '<table>\n';
            }
            htmlOutput += parseTable(line);
            continue;
        } else if (inTable) {
            inTable = false;
            htmlOutput += '</table>\n';
        }
        // Code block
        if (line.startsWith('```')) {
            if (!inCodeBlock) {
                inCodeBlock = true;
                codeBlockLines = [];
                codeBlockLanguage = line.slice(3).trim();
            } else {
                inCodeBlock = false;
                htmlOutput += parseCodeBlock(codeBlockLines, codeBlockLanguage);
            }
            continue;
        } else if (inCodeBlock) {
            codeBlockLines.push(line);
            continue;
        }
        // Headings
        if (line.startsWith('# ')) {
            const headingLevel = line.indexOf(' ');
            const headingText = line.slice(headingLevel + 1);
            htmlOutput += `<h${headingLevel}>${parseInlineElements(headingText)}</h${headingLevel}>\n`;
            continue;
        }
        // Lists
        if (line.startsWith('- ') || line.startsWith('* ') || line.match(/^\d+\.\s/)) {
            htmlOutput += parseList(line);
            continue;
        }
        // Horizontal Rule
        if (line.trim() === '---') {
            htmlOutput += parseHorizontalRule();
            continue;
        }
        // Other paragraphs
        htmlOutput += `<p>${parseInlineElements(line)}</p>\n`;
    }
    return htmlOutput;
};

export { markdown2html };
