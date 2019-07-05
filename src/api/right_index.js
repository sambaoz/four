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
// 获取所有权限
export const getAllRightList = (type) => {
  return axios({
    method: 'get',
    url: `rights/${type}`
  })
}
// 获取左侧菜单权限
export const getAllList = () => {
  return axios.get('menus')
    .then((result) => {
      return result.data
    })
}
