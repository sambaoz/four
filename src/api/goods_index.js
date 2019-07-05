import myaxios from './baseaxios.js'
// 获取所有权限列表数据
export const getAllGoodsList = (params) => {
  return myaxios({
    url: 'goods',
    method: 'get',
    params
  })
}
// 获取所有分类数据
export const getAllCategoriesList = (type) => {
  return myaxios({
    url: 'categories',
    method: 'get',
    params: { type: type }
  })
}
export const addGoodInfo = (obj) => {
  return myaxios({
    url: 'goods',
    method: 'post',
    data: obj
  })
}
