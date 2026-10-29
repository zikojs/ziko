import { mapfun, MapfunResult } from "../../../math/mapfun/index";
import { useState } from "../use-state";

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
