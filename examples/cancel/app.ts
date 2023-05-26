import axios, { Canceler } from '../../src/index'

// 第一种方法
const CancelToken = axios.CancelToken
const source = CancelToken.source()

axios.get('/cancel/get', {
  cancelToken: source.token
}).catch(e => {
  if(axios.isCancel(e)) {
    console.log('Request cancel', e.message)
  }
})

setTimeout(() => {
  source.cancel('Operation canceld by the user')
}, 300)

setTimeout(() => {
  
  axios.post('/cancel/post', { a: 1 }, {
    cancelToken: source.token
  }).catch(e => {
    if(axios.isCancel(e)) {
      console.log(e.message)
    }
  })
}, 100)


// 第二种方法
let cancel: Canceler

axios.get('/cancel/get', {
  cancelToken: new CancelToken(c => {
    cancel = c
  })
}).catch(e => {
  if(axios.isCancel(e)) {
    console.log('Request cancel', e.message)
  }
})

setTimeout(() => {
  // 将cancelToken.promise的pending状态转为resolve状态
  // xhr.ts 中执行abort操作
  cancel('Operation canceld by licop')
}, 200)
