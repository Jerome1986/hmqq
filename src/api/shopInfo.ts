import { request } from '@/utils/request.ts'
import type { ShopJoinResult } from '@/types/global'
import type { AvailableStores, ShopInfo } from '@/types/ShopInfo.ts'

/**
 * 申请入驻门店
 * /shopJoin-add
 */

export const shopInfoAddApi = (form: ShopInfo) => {
  return request<ShopJoinResult>({
    method: 'POST',
    url: '/shopJoin-add',
    data: form,
  })
}

/**
 * 适用团购的门店
 * /availableStores
 * @param {string} groupId - 对应的团购id
 */

export const availableStoresApi = (groupId: string) => {
  return request<AvailableStores[]>({
    method: 'GET',
    url: '/availableStores',
    data: { groupId },
  })
}
