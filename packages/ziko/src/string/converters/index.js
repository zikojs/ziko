export const camel2hyphencase = (text = '') =>
  text.replace(/[A-Z]/g, (match, index) =>
    index ? `-${match.toLowerCase()}` : match.toLowerCase()
  );
export const camel2snakecase = (text = '') =>
  text.replace(/[A-Z]/g, (match, index) =>
    index ? `_${match.toLowerCase()}` : match.toLowerCase()
  );
export const camel2pascalcase = (text = '') => text.charAt(0).toUpperCase() + text.slice(1);
export const camel2constantcase = (text = '') => text
    .replace(/[A-Z]/g, (match, index) =>
      index ? `_${match}` : match
    )
    .toUpperCase();


export const pascal2snakecase = (text = '') =>
  text.replace(/[A-Z]/g, (match, offset) =>
    offset === 0
      ? match.toLowerCase()
      : `_${match.toLowerCase()}`
  );

export const pascal2hyphencase = (text = '') =>
  text.replace(/[A-Z]/g, (match, offset) =>
    offset === 0
      ? match.toLowerCase()
      : `-${match.toLowerCase()}`
  );

export const pascal2constantcase = (text = '') =>
  text
    .replace(/[A-Z]/g, (match, offset) =>
      offset === 0 ? match : `_${match}`
    )
    .toUpperCase();
export const pascal2camelcase = (text = '') => text.charAt(0).toLowerCase() + text.slice(1);

export const snake2camelcase = (text = '') => text.replace(/_([a-zA-Z])/g, (_, char) => char.toUpperCase());
export const snake2hyphencase = (text = '') => text.replace(/_/g, '-');
export const snake2pascalcase = (text = '') => text
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
export const snake2constantcase = (text = '') => text.toUpperCase();

export const hyphen2camelcase = (text = '') => text.replace(/-([a-zA-Z])/g, (_, char) => char.toUpperCase());
export const hyphen2snakecase = (text = '') => text.replace(/-/g, '_');
export const hyphen2pascalcase = (text = '') => text
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
export const hyphen2constantcase = (text = '') => text.replace(/-/g, '_').toUpperCase();

export const constant2camelcase = (text = '') => text.toLowerCase().replace(/_([a-z])/g, (_, char) => char.toUpperCase());
export const constant2snakecase = (text = '') => text.toLowerCase();
export const constant2pascalcase = (text = '') => text
    .toLowerCase()
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
export const constant2hyphencase = (text = '') => text.toLowerCase().replace(/_/g, '-');