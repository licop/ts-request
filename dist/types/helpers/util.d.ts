export declare function isDate(val: any): val is Date;
export declare function isPlainObject(val: any): val is Object;
export declare function isFormData(val: any): val is FormData;
export declare function isURLSearchParams(val: any): val is URLSearchParams;
export declare function extend<T, U>(to: T, from: U): T & U;
export declare function deepMerge(...objs: any[]): any;
