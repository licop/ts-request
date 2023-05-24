import { AxiosRequestConfig, AxiosResponse } from '../types'

// 创建AxiosError类，进行错误信息增强
export class AxiosError extends Error {
  isAxiosError: boolean
  config: AxiosRequestConfig
  code?: string | null
  request?: any
  response?: AxiosResponse

  constructor(
    message: string,
    config: AxiosRequestConfig,
    code?: string | null,
    request?: any,
    response?: AxiosResponse
  ) {
    super(message)

    this.config = config
    this.code = code
    this.request = request
    this.response = response
    this.isAxiosError = true
    // 用于修复typescript的bug
    Object.setPrototypeOf(this, AxiosError.prototype)
  }
}

// 定义工厂函数
export function createError(
  message: string,
  config: AxiosRequestConfig,
  code?: string | null,
  request?: any,
  response?: AxiosResponse
) {
  const error = new AxiosError(message, config, code, request, response)

  return error
}
