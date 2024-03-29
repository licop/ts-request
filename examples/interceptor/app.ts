import axios from '../../src/index'

// headers.test 为2132， 先添加的后执行
axios.interceptors.request.use(config => {
  config.params={name: 'licop'}

  return config
})
axios.interceptors.request.use(config => {
  config.headers.test += '2'

  return config
})
axios.interceptors.request.use(config => {
  config.headers.test += '3'
  return config
})

axios.interceptors.response.use(res => {
  res.data += '1'
  return res
})
let interceptor = axios.interceptors.response.use(res => {
  res.data += '2'
  return res
})
axios.interceptors.response.use(res => {
    res.data += '3'
    return res
})

axios.interceptors.response.eject(interceptor)

axios({
  url: '/interceptor/get',
  method: 'get',
  headers: {
    test: '21'
  }
}).then((res) => {
  console.log(res.data);
})
