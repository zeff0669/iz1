import request from 'src/service/request'

export function Texto(data) {
  return request({
    url: '/bulk/',
    method: 'post',
    data
  })
}