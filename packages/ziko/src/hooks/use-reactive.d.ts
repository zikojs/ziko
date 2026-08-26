import { mapfun, MapfunResult } from "../math/utils/mapfun.d.ts";
import { useState } from "./use-state.d.ts";

export function useReactive<
    T
>(
    nested_value: T
): MapfunResult<
    (n: any) => {
        get: ReturnType<typeof useState<any>>[0];
        set: ReturnType<typeof useState<any>>[1];
    },
    T
>;
