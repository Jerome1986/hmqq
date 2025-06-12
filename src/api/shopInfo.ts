import { request } from '@/utils/request.ts'
import type { ShopJoinResult } from '@/types/global'
import type { ShopInfo } from '@/types/ShopInfo.ts'

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
