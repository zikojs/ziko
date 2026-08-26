import type { Complex } from "../../complex/index.d.ts";
import { Matrix } from '../../../../src/math/matrix/index.js'

export type LogicValue = 0 | 1 | Complex | Matrix;

/**
 * Logical NOT operation.
 */
export declare const not: (
    x: LogicValue
) => LogicValue;

/**
 * Logical AND operation.
 */
export declare const and: (
    ...x: LogicValue[]
) => LogicValue;

/**
 * Logical OR operation.
 */
export declare const or: (
    ...x: LogicValue[]
) => LogicValue;

/**
 * Logical XOR operation.
 */
export declare const xor: (
    ...x: LogicValue[]
) => LogicValue;

/**
 * Logical NAND operation.
 */
export declare const nand: (
    ...x: LogicValue[]
) => LogicValue;

/**
 * Logical NOR operation.
 */
export declare const nor: (
    ...x: LogicValue[]
) => LogicValue;

/**
 * Logical XNOR operation.
 */
export declare const xnor: (
    ...x: LogicValue[]
) => LogicValue;