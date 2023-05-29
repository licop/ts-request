import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { parseHeaders } from '../helpers/headers'
import { createError } from '../helpers/error'
import { isURLSameOrigin } from '../helpers/url'
import { isFormData } from '../helpers/util'
import cookie from '../helpers/cookie'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const {
      data = null,
      url,
      method = 'get',
      headers = {},
      responseType,
      timeout,
      cancelToken,
      withCredentials,

      xsrfCookieName,
      xsrfHeaderName,

      onDownloadProgress,
      onUploadProgress,
      validateStatus,
      auth
    } = config

    const request = new XMLHttpRequest()
    request.open(method.toUpperCase(), url!, true)

    configureRequest()
    addEvent()
    processHeaders()
    processCancel()
    request.send(data)

    function configureRequest(): void {
      if (responseType) {
        request.responseType = responseType
      }
      if (timeout) {
        request.timeout = timeout
      }
      // withCredentials 设置为true 跨域可以携带cookie
      if (withCredentials) {
        request.withCredentials = withCredentials
      }
    }

    function addEvent(): void {
      request.onreadystatechange = function handleLoad() {
        if (request.readyState !== 4) {
          return
        }
        if (request.status === 0) {
          return
        }
        // 获取相应头数据
        const responseHeaders = parseHeaders(request.getAllResponseHeaders())

        const responseData =
          responseType && responseType !== 'text'
            ? request.response
            : request.responseText
        // 设置响应数据格式

        const response: AxiosResponse = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: responseHeaders,
          config,
          request
        }
        handleResponse(response)
      }

      // 处理网络错误
      request.onerror = function handleError() {
        reject(createError('Network Error', config, null, request))
      }
      // 处理超时错误
      request.ontimeout = function handleTimeout() {
        reject(
          createError(
            `Timeout of ${timeout} ms exceeded`,
            config,
            'ECONNABORTED',
            request
          )
        )
      }

      if (onDownloadProgress) {
        request.onprogress = onDownloadProgress
      }

      if (onUploadProgress) {
        request.upload.onprogress = onUploadProgress
      }
    }

    // 设置请求头
    function processHeaders(): void {
      if (isFormData(data)) {
        delete headers['Content-Type']
      }

      if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName) {
        const xsrfValue = cookie.read(xsrfCookieName)
        if (xsrfValue && xsrfHeaderName) {
          headers[xsrfHeaderName] = xsrfValue
        }
      }

      // HTTP协议中的 Authorization 请求消息头
      if (auth) {
        headers['Authorization'] =
          // btoa为JavaScript 的一个内置方法，用于将一个字符串编码为 base-64 格式。
          'Basic ' + btoa(auth.username + ':' + auth.password)
      }

      Object.keys(headers).forEach(name => {
        // 如何data是空不设置Content-type
        if (data === null && name.toLowerCase() === 'content-type') {
          delete headers[name]
        } else {
          request.setRequestHeader(name, headers[name])
        }
      })
    }

    // 通过promise，实现异步分离，取消请求
    function processCancel(): void {
      if (cancelToken) {
        cancelToken.promise
          .then(reason => {
            request.abort()
            reject(reason)
          })
          .catch(
            /* istanbul ignore next */
            () => {
              // do nothing
            }
          )
      }
    }

    function handleResponse(response: AxiosResponse): void {
      // 验证状态码 默认status >= 200 && status < 300
      if (!validateStatus || validateStatus(response.status)) {
        // 返回响应数据
        resolve(response)
      } else {
        reject(
          createError(
            `Request failed with status code ${response.status}`,
            config,
            null,
            request,
            response
          )
        )
      }
    }
  })
}
