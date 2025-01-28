import request from 'src/service/request'

export function CriarTenant (data) {
  return request({
    url: '/tenants/',
    method: 'post',
    data
  })
}

export function ListarTenants () {
  return request({
    url: `/tenants/`,
    method: 'get'
  })
}

export function ListarTenantPorId (data) {
  return request({
    url: `/tenants/${data.id}`,
    method: 'get'
  })
}

export function ListarTenantsPorAsaas () {
  return request({
    url: `/tenantsAsaas/`,
    method: 'get'
  })
}

export function ListarTenantPorAsaas (data) {
  return request({
    url: `/tenantsAsaas/${data}`,
    method: 'get'
  })
}

export function AlterarTenant (data) {
  return request({
    url: `/tenantsUpdate/${data.id}`,
    method: 'put',
    data
  })
}

export function AlterarTenantMeta (data) {
  return request({
    url: `/tenantsMetaUpdate/${data.id}`,
    method: 'put',
    data
  })
}

export function DeletarTenant (data) {
  return request({
    url: `/tenants/${data.id}`,
    method: 'delete'
  })
}