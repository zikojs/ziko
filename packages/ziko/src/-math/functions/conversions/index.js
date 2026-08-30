export const base2base = (value, fromBase, toBase) => {
    if (fromBase < 2 || fromBase > 36 || toBase < 2 || toBase > 36)
        throw new TypeError('Base must be between 2 and 36');

    const dec = parseInt(value, fromBase);
    if (Number.isNaN(dec)) throw new TypeError('Invalid value for the given base');

    return dec.toString(toBase);
};

export const bin2oct = (...x) => mapfun(
    n => base2base(n, 2, 8),
    ...x
)
export const bin2dec = (...x) => mapfun(
    n => base2base(n, 2, 10),
    ...x
)
export const bin2hex = (...x) => mapfun(
    n => base2base(n, 2, 16),
    ...x
)

export const oct2bin = (...x) => mapfun(
    n => base2base(n, 8, 2),
    ...x
)
export const oct2dec = (...x) => mapfun(
    n => base2base(n, 8, 10),
    ...x
)
export const oct2hex = (...x) => mapfun(
    n => base2base(n, 8, 16),
    ...x
)

export const dec2bin = (...x) => mapfun(
    n => base2base(n, 10, 2),
    ...x
)
export const dec2oct = (...x) => mapfun(
    n => base2base(n, 10, 8),
    ...x
)
export const dec2hex = (...x) => mapfun(
    n => base2base(n, 10, 16),
    ...x
)

export const hex2bin = (...x) => mapfun(
    n => base2base(n, 16, 2),
    ...x
)
export const hex2oct = (...x) => mapfun(
    n => base2base(n, 16, 8),
    ...x
)
export const hex2dec = (...x) => mapfun(
    n => base2base(n, 16, 10),
    ...x
)