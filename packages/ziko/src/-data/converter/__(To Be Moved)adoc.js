const parseInlineElements = text => {
    return text
        .replace(/\*(.*?)\*/g, '_$1_')  // Emphasis
        .replace(/\*\*(.*?)\*\*/g, '*$1*') // Strong
        .replace(/\[(.*?)\]\((.*?)\)/g, 'link:$2[$1]')  // Links
        .replace(/!\[(.*?)\]\((.*?)\)/g, 'image::$2[$1]') // Images
        .replace(/`([^`]+)`/g, '``$1``') // Inline Code
        .replace(/^\*\s/, ''); // Remove list item marker at the beginning of the line
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
    const OL_PATTERN = /^(\d+)\.\s/;
    const OL_PATTERN_WITHOUT_START = /^[.]\s/;
    const UL_PATTERN = /^[*]\s/;
    
    if (line.match(OL_PATTERN)) {
        const start = line.match(OL_PATTERN)[1];
        return `<ol start="${start}"><li>${parseInlineElements(line.replace(OL_PATTERN, ''))}</li></ol>\n`;
    } 
    if (line.match(OL_PATTERN_WITHOUT_START)) {
        return `<ol><li>${parseInlineElements(line.replace(OL_PATTERN_WITHOUT_START, ''))}</li></ol>\n`;
    } 
    if (line.match(UL_PATTERN)) {
        return `<ul><li>${parseInlineElements(line.replace(UL_PATTERN, ''))}</li></ul>\n`;
    }

    // If neither ordered nor unordered list pattern matches, treat it as a paragraph
    return `<p>${parseInlineElements(line)}</p>\n`;
};




const parseBlockquote = line => {
    return `<blockquote>${parseInlineElements(line.slice(2))}</blockquote>\n`;
};

const parseHorizontalRule = () => {
    return '<hr>\n';
};

const parseAttributes = line => {
    const attrs = line.match(/\[(.*?)\]/);
    return attrs ? attrs[1].split(',').map(attr => `[${attr.trim()}]`).join('') : '';
};

const adoc2html = adocText => {
    const lines = adocText.split('\n');
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
        if (line.startsWith('=')) {
            const headingLevel = (line.match(/=/g) || []).length;
            const headingText = line.replace(/=/g, '').trim();
            htmlOutput += `<h${headingLevel}>${parseInlineElements(headingText)}</h${headingLevel}>\n`;
            continue;
        }
        // Lists
        if (line.match(/^(\d+)\.\s/) || line.match(/^[*\.]\s/)) {
            htmlOutput += parseList(line);
            continue;
        }
        // Blockquote
        if (line.startsWith('> ')) {
            htmlOutput += parseBlockquote(line);
            continue;
        }
        // Horizontal Rule
        if (line.trim() === '---') {
            htmlOutput += parseHorizontalRule();
            continue;
        }
        // Attributes
        if (line.startsWith('[')) {
            htmlOutput += parseAttributes(line);
            continue;
        }
        // Other paragraphs
        if (line.trim() !== '') { // Exclude empty lines
            htmlOutput += `<p>${parseInlineElements(line)}</p>\n`;
        }
    }
    return htmlOutput;
};

export { adoc2html };
