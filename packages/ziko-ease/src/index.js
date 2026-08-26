const { PI, sqrt, cos, sin, acos, pow } = Math;

export const linear = t => t;

// --- Sin ---
export const in_sin = t => 1 - cos((t * PI) / 2);
export const out_sin = t => sin((t * PI) / 2);
export const in_out_sin = t => -(cos(PI * t) - 1) / 2;

// --- Quad ---
export const in_quad = t => t ** 2;
export const out_quad = t => 1 - (1 - t) ** 2;
export const in_out_quad = t =>
    t < 0.5 ? 2 * (t ** 2) : 1 - (-2 * t + 2) ** 2 / 2;

// --- Cubic ---
export const in_cubic = t => t ** 3;
export const out_cubic = t => 1 - (1 - t) ** 3;
export const in_out_cubic = t =>
    t < 0.5 ? 4 * (t ** 3) : 1 - (-2 * t + 2) ** 3 / 2;

// --- Quart ---
export const in_quart = t => t ** 4;
export const out_quart = t => 1 - (1 - t) ** 4;
export const in_out_quart = t =>
    t < 0.5 ? 8 * (t ** 4) : 1 - (-2 * t + 2) ** 4 / 2;

// --- Quint ---
export const in_quint = t => t ** 5;
export const out_quint = t => 1 - (1 - t) ** 5;
export const in_out_quint = t =>
    t < 0.5 ? 16 * (t ** 5) : 1 - (-2 * t + 2) ** 5 / 2;

// --- Expo ---
export const in_expo = t => (t === 0 ? 0 : 2 ** (10 * t - 10));
export const out_expo = t => (t === 1 ? 1 : 1 - 2 ** (-10 * t));
export const in_out_expo = t =>
    t === 0
        ? 0
        : t === 1
        ? 1
        : t < 0.5
        ? 2 ** (20 * t - 10) / 2
        : (2 - 2 ** (-20 * t + 10)) / 2;

// --- Circ ---
export const in_circ = t => 1 - sqrt(1 - t ** 2);
export const out_circ = t => sqrt(1 - (t - 1) ** 2);
export const in_out_circ = t =>
    t < 0.5
        ? (1 - sqrt(1 - (2 * t) ** 2)) / 2
        : (sqrt(1 - (-2 * t + 2) ** 2) + 1) / 2;

// --- Arc ---
export const arc = t => 1 - sin(acos(t));

// --- Back ---
export const back = (t, x = 1) => (t ** 2) * ((x + 1) * t - x);

// --- Elastic ---
export const elastic = t =>
    -2 * pow(2, 10 * (t - 1)) * cos((20 * PI * t) / 3 * t);

// --- Back variations ---
export const in_back = (t, c1 = 1.70158, c3 = c1 + 1) =>
    c3 * pow(t, 3) - c1 * (t ** 2);

export const out_back = (t, c1 = 1.70158, c3 = c1 + 1) =>
    1 + c3 * pow(t - 1, 3) + c1 * pow(t - 1, 2);

export const in_out_back = (t, c1 = 1.70158, c2 = c1 * 1.525) =>
    t < 0.5
        ? (pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
        : (pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;

// --- Elastic variations ---
export const in_elastic = (t, c4 = (2 * PI) / 3) =>
    t === 0
        ? 0
        : t === 1
        ? 1
        : -pow(2, 10 * t - 10) * sin((t * 10 - 10.75) * c4);

export const out_elastic = (t, c4 = (2 * PI) / 3) =>
    t === 0
        ? 0
        : t === 1
        ? 1
        : pow(2, -10 * t) * sin((t * 10 - 0.75) * c4) + 1;

export const in_out_elastic = (t, c5 = (2 * PI) / 4.5) =>
    t === 0
        ? 0
        : t === 1
        ? 1
        : t < 0.5
        ? -(pow(2, 20 * t - 10) * sin((20 * t - 11.125) * c5)) / 2
        : (pow(2, -20 * t + 10) * sin((20 * t - 11.125) * c5)) / 2 + 1;

// --- Bounce ---
export const in_bounce = (t, n1 = 7.5625, d1 = 2.75) =>
    1 - out_bounce(1 - t, n1, d1);

export const out_bounce = (t, n1 = 7.5625, d1 = 2.75) => {
    if (t < 1 / d1) return n1 * t * t;
    if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
    if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
    return n1 * (t -= 2.625 / d1) * t + 0.984375;
};

export const in_out_bounce = (t, n1 = 7.5625, d1 = 2.75) =>
    t < 0.5
        ? out_bounce(1 - 2 * t, n1, d1) / 2
        : out_bounce(2 * t - 1, n1, d1) / 2;

// --- Step / Discrete ---
export const step = (t, steps = 5) => Math.floor(t * steps) / steps;
export const discret = (t, segments = 5) => Math.ceil(t * segments) / segments;
