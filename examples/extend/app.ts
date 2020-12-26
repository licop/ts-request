import axios from '../../src/index'

axios({
  url: '/extend/post',
  method: 'post',
  data: {
    msg: 'hi'
  }
})

axios.request({
  url: '/extend/post',
  method: 'post',
  data: {
    msg: 'hello'
  }
})

axios.get('/extend/get')

axios.options('/extend/options')

axios.delete('/extend/delete')

axios.head('/extend/head')

axios.post('/extend/post', { msg: 'post' })

axios.put('/extend/put', { msg: 'put' })

axios.patch('/extend/patch', { msg: 'patch' })

axios({
  url: '/extend/post',
  method: 'post',
  data: {
    msg: 'hi'
  }
})

axios('/extend/post', {
  method: 'post',
  data: {
    msg: 'hello1'
  }
})

// 请求接口数据
export interface ResponseData<T = any> {
    /**
     * 状态码
     * @type { number }
     */
    code: number
  
    /**
     * 数据
     * @type { T }
     */
    result: T
  
    /**
     * 消息
     * @type { string }
     */
    message: string
}


interface User {
    name: string
    age: number
}

export function getUser<T>() {
  return axios.get<ResponseData<T>>('/extend/user')
    .then(res => res.data)
    .catch(err => console.error(err))
}

async function test() {
    // user 被推断出为
    // {
    //  code: number,
    //  result: { name: string, age: number },
    //  message: string
    // }
    const user = await getUser<User>()
    if (user) {
        console.log(user.result.name)
    }
}
test();