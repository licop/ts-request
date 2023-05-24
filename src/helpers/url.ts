// 处理请求url参数，把params拼接到url上

import { isDate, isPlainObject, isURLSearchParams } from './util'

interface URLOrigin {
  protocol: string
  host: string
}

function encode(val: string): string {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

export function buildURL(
  url: string,
  params?: any,
  paramsSerializer?: (params: any) => string
): string {
  if (!params) {
    return url
  }
  let serializedParams

  if (paramsSerializer) {
    serializedParams = paramsSerializer(params)
  } else if (isURLSearchParams(params)) {
    serializedParams = params.toString()
  } else {
    const parts: string[] = []
    Object.keys(params).forEach(key => {
      const val = params[key]
      if (val === null || typeof val === 'undefined') {
        return
      }
      let values = []
      if (Array.isArray(val)) {
        values = val
        key += '[]'
      } else {
        // 如果不是数组转化为数组，方便遍历
        values = [val]
      }
      values.forEach(val => {
        if (isDate(val)) {
          val = val.toISOString()
        } else if (isPlainObject(val)) {
          val = JSON.stringify(val)
        }
        parts.push(`${encode(key)}=${encode(val)}`)
      })

      serializedParams = parts.join('&')
    })
  }

  if (serializedParams) {
    // 把hash后面的字符忽略掉
    const markIndex = url.indexOf('#')
    if (markIndex !== -1) {
      url = url.slice(0, markIndex)
    }
    // 如果url有?直接链接字符串
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
  }

  return url
}
// 是否是绝对路径
export function isAbsoluteURL(url: string): boolean {
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
}

export function combineURL(baseURL: string, relativeURL?: string): string {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL
}

// 判断是否同源
export function isURLSameOrigin(requestURL: string): boolean {
  const parsedOrigin = resolveURL(requestURL)

  return (
    parsedOrigin.protocol === currentOrigin.protocol &&
    parsedOrigin.host === currentOrigin.host
  )
}

const urlParsingNode = document.createElement('a')
const currentOrigin = resolveURL(window.location.href)

function resolveURL(url: string): URLOrigin {
  urlParsingNode.setAttribute('href', url)
  const { protocol, host } = urlParsingNode
  return {
    protocol,
    host
  }
}
