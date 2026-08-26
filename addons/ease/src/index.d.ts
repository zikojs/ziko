declare const linear: (t: number) => number;

// --- Sin ---
declare const in_sin: (t: number) => number;
declare const out_sin: (t: number) => number;
declare const in_out_sin: (t: number) => number;

// --- Quad ---
declare const in_quad: (t: number) => number;
declare const out_quad: (t: number) => number;
declare const in_out_quad: (t: number) => number;

// --- Cubic ---
declare const in_cubic: (t: number) => number;
declare const out_cubic: (t: number) => number;
declare const in_out_cubic: (t: number) => number;

// --- Quart ---
declare const in_quart: (t: number) => number;
declare const out_quart: (t: number) => number;
declare const in_out_quart: (t: number) => number;

// --- Quint ---
declare const in_quint: (t: number) => number;
declare const out_quint: (t: number) => number;
declare const in_out_quint: (t: number) => number;

// --- Expo ---
declare const in_expo: (t: number) => number;
declare const out_expo: (t: number) => number;
declare const in_out_expo: (t: number) => number;

// --- Circ ---
declare const in_circ: (t: number) => number;
declare const out_circ: (t: number) => number;
declare const in_out_circ: (t: number) => number;

// --- Arc ---
declare const arc: (t: number) => number;

// --- Back ---
declare const back: (t: number, x?: number) => number;

// --- Elastic ---
declare const elastic: (t: number) => number;

// --- Back variations ---
declare const in_back: (t: number, c1?: number, c3?: number) => number;
declare const out_back: (t: number, c1?: number, c3?: number) => number;
declare const in_out_back: (t: number, c1?: number, c2?: number) => number;

// --- Elastic variations ---
declare const in_elastic: (t: number, c4?: number) => number;
declare const out_elastic: (t: number, c4?: number) => number;
declare const in_out_elastic: (t: number, c5?: number) => number;

// --- Bounce ---
declare const in_bounce: (t: number, n1?: number, d1?: number) => number;
declare const out_bounce: (t: number, n1?: number, d1?: number) => number;
declare const in_out_bounce: (t: number, n1?: number, d1?: number) => number;

// --- Step & Discret ---
declare const step: (t: number, steps?: number) => number;
declare const discret: (t: number, segments?: number) => number;

export {
    linear,
    in_sin,
    out_sin,
    in_out_sin,
    in_quad,
    out_quad,
    in_out_quad,
    in_cubic,
    out_cubic,
    in_out_cubic,
    in_quart,
    out_quart,
    in_out_quart,
    in_quint,
    out_quint,
    in_out_quint,
    in_expo,
    out_expo,
    in_out_expo,
    in_circ,
    out_circ,
    in_out_circ,
    arc,
    back,
    elastic,
    in_back,
    out_back,
    in_out_back,
    in_elastic,
    out_elastic,
    in_out_elastic,
    in_bounce,
    out_bounce,
    in_out_bounce,
    step,
    discret
};
