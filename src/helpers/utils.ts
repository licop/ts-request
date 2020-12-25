const toString = Object.prototype.toString

export function isDate(val: any): val is Date {
  return toString.call(val) === '[object Date]'
}

export function isPlainOject(val: any): val is Object {
  return toString.call(val) === '[object Object]'
}

export function isObject(val: any): boolean {
  return val !== null && typeof val === 'object'
}
