import { isPlainObject } from './util'
// 对请求data数据进行处理
export function transformRequest(data: any): any {
  if (isPlainObject(data)) {
    return JSON.stringify(data)
  }
  return data
}

// 对响应数据进行处理
export function transformResponse(data: any): any {
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch (error) {
      // do nothing
    }
  }
  return data
}
