import { AxiosRequestConfig, AxiosStatic } from './types'
import Axios from './core/Axios'
import { extend } from './helpers/util'
import defaults from './defaults'
import mergeConfig from './core/mergeConfig'
import CancelToken from './cancel/CancelToken'
import Cancel, { isCancel } from './cancel/Cancel'

// axios不单单是个方法，更像个混合对象，本身是个一个方法，又有很多方法属性、
// 混合对象axios本身是一个函数，我们再实现一个包括他属性方法的类，然后把类的原型属性和实例属性在拷贝到axios上
function createInstance(config: AxiosRequestConfig): AxiosStatic {
  const context = new Axios(config)
  // request方法有this，需要绑定上下文
  const instance = Axios.prototype.request.bind(context)
  // 将实例的原型属性和实力属性，拷贝到instance上
  extend(instance, context)

  return instance as AxiosStatic
}

const axios = createInstance(defaults)

axios.create = function create(config) {
  return createInstance(mergeConfig(defaults, config))
}
axios.CancelToken = CancelToken
axios.Cancel = Cancel
axios.isCancel = isCancel

axios.all = function all(promises) {
  return Promise.all(promises)
}

axios.spread = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr)
  }
}

axios.Axios = Axios

export default axios
