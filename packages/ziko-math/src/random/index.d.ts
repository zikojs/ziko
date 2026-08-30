/**
 * Utility class for generating random values.
 */
export declare class Random {

    /**
     * Generates a random integer.
     * @param a Minimum value (inclusive).
     * @param b Maximum value (exclusive).
     */
    static int(a: number, b?: number): number;

    /**
     * Generates a random floating-point number.
     * @param a Minimum value.
     * @param b Maximum value.
     */
    static float(a: number, b?: number): number;

    /**
     * Generates a random binary value.
     */
    static bin(): 0 | 1;

    /**
     * Generates a random octal digit.
     */
    static oct(): number;

    /**
     * Generates a random decimal digit.
     */
    static dec(): number;

    /**
     * Generates a random hexadecimal digit.
     */
    static hex(): string;

    /**
     * Generates a random alphabetic character.
     * @param upperCase Generate uppercase character when true.
     */
    static char(upperCase?: boolean): string;

    /**
     * Generates a random boolean value.
     */
    static bool(): boolean;

    /**
     * Random color generators.
     */
    static readonly color: {
        /** Generates a random HEX color. */
        hex(): string;

        /** Generates a random HEXA color with alpha channel. */
        hexa(): string;

        /** Generates a random RGB color. */
        rgb(): string;

        /** Generates a random RGBA color. */
        rgba(): string;

        /** Generates a random HSL color. */
        hsl(): string;

        /** Generates a random HSLA color with alpha channel. */
        hsla(): string;

        /** Generates a random grayscale RGB color. */
        gray(): string;
    };

    /**
     * Generates arrays of random values.
     */
    static readonly sample: {

        /**
         * Generates an array of random integers.
         */
        int(n: number, a: number, b?: number): number[];

        /**
         * Generates an array of random floats.
         */
        float(n: number, a: number, b?: number): number[];

        /**
         * Generates an array of random characters.
         */
        char(n: number, upper?: boolean): string[];

        /**
         * Generates an array of random booleans.
         */
        bool(n: number): boolean[];

        /**
         * Generates an array of random binary values.
         */
        bin(n: number): (0 | 1)[];

        /**
         * Generates an array of random octal digits.
         */
        oct(n: number): number[];

        /**
         * Generates an array of random decimal digits.
         */
        dec(n: number): number[];

        /**
         * Generates an array of random hexadecimal digits.
         */
        hex(n: number): string[];

        /**
         * Generates arrays of random colors.
         */
        readonly color: {
            hex(n: number): string[];
            hexa(n: number): string[];
            rgb(n: number): string[];
            rgba(n: number): string[];
            hsl(n: number): string[];
            hsla(n: number): string[];
            gray(n: number): string[];
        };

        /**
         * Generates an array of random choices from a list.
         * @param n Number of generated values.
         * @param choices Available values.
         * @param p Probability distribution for each value.
         */
        choice<T>(
            n: number,
            choices: T[],
            p?: number[]
        ): T[];
    };

    /**
     * Returns a shuffled copy of an array.
     */
    static shuffle<T>(arr: T[]): T[];

    /**
     * Randomly selects a value from a list.
     * @param choices Available values.
     * @param p Probability distribution for each value.
     */
    static choice<T>(
        choices?: T[],
        p?: number[]
    ): T;
}