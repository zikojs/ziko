export function normalize_path(inputPath, root = './src/pages', extensions = ['js', 'ts', 'jsx', 'tsx']) {
    let cleanRoot = root.endsWith('/') ? root.slice(0, -1) : root;
    const normalizedPath = inputPath.replace(/\\/g, '/');
    
    // 1. Extract path relative to root
    let relativePath = normalizedPath;
    if (cleanRoot && normalizedPath.includes(cleanRoot)) {
        relativePath = normalizedPath.split(cleanRoot).pop();
    }

    // 2. Split directory parts & strip route groups like (auth)
    const rawParts = relativePath.split('/').filter(Boolean).filter(p => !/^\([^)]+\)$/.test(p));
    if (rawParts.length === 0) return '/';

    const lastPart = rawParts[rawParts.length - 1];
    const extRegex = new RegExp(`\\.(${extensions.join('|')})$`);
    
    const isIndexFile = extensions.some(ext => lastPart === `index.${ext}`);
    const fileNameWithoutExt = lastPart.replace(extRegex, '');

    // Remove original file name from directory segments
    rawParts.pop(); 

    // 3. Handle flat dot notation without breaking [..slug] or [[..slug]]
    if (!isIndexFile) {
        // Splits by '.' ONLY if the dot is outside of bracketed patterns like [...] or [[...]]
        const dotSegments = fileNameWithoutExt.split(/\.(?![^\[]*\])/);
        rawParts.push(...dotSegments);
    }

    return '/' + rawParts.join('/');
}