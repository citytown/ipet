import axios from 'axios'
import {Alert} from 'element-ui'


// 请求拦截器
axios.interceptors.request.use(function (config) {
  return config
}, function (error) {
  return Promise.reject(error)
})

// 响应拦截器
axios.interceptors.response.use(function (response) {
  return response
}, function (error) {
  return Promise.reject(error)
})

// 封装axios的post请求
export function post(url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then(response => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// 封装axios的get请求
export function get(url, params) {
  return new Promise((resolve, reject) => {
    axios.get(url, {params: params})
      .then(response => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

 /**
 * 封装put请求
 * @param url
 * @param params
 * @returns {Promise}
 */

export function put(url,params = {}){
  return new Promise((resolve,reject) => {
    axios.put(url,params)
         .then(response => {
           resolve(response.data);
         },err => {
           reject(err)
         })
  })
}

 /**
 * 封装delete请求
 * @param url
 * @param params
 * @returns {Promise}
 */

export function del(url,params = {}){
  return new Promise((resolve,reject) => {
    axios.delete(url,params)
         .then(response => {
           resolve(response.data);
         },err => {
           reject(err)
         })
  })
}

const downloadUrl = url => {
  let iframe = document.createElement('iframe')
  iframe.style.display = 'none'
  iframe.src = url
  iframe.onload = function () {
    document.body.removeChild(iframe)
  }
  document.body.appendChild(iframe)
}

export default {
  post,
  get,
  put,
  del
}
