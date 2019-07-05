import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  var token = localStorage.getItem('itcastpro_token')
  if (token) {
    config.headers['Authorization'] = token
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 实现登陆验证
export const login = (obj, callback) => {
  return axios.post('login', obj)
    .then((result) => {
      return result.data
    })
}

// 获取用户数据
export const getDatelist = (obj) => {
  return axios.get('users', { params: obj })
    .then((result) => {
      console.log(655)
      return result.data
    })
}
// 实现编辑用户提交
export const editUser = (obj) => {
  return axios.put(`users/${obj.id}`, obj)
    .then((result) => {
      return result.data
    })
}

// 实现用户删除
export const delUserById = (id) => {
  return axios.delete(`users/${id}`)
    .then((result) => {
      return result.data
    })
}
// 实现用户状态
export const updateUserStatuById = (e, id) => {
  return axios.put(`users/${id}/state/${e}`)
    .then((result) => {
      return result.data
    })
}
// 添加用户
export const addUser = (obj) => {
  return axios.post('users', obj)
    .then(result => {
      return result.data
    })
}
