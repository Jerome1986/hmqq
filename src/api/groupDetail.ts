import { request } from '@/utils/request.ts'
import type { GroupBuyItem } from '@/types/home'

/**
 * 根据id获取团购详情
 * /groupList-byId-get
 */
export const groupDetailApi = (id: string) => {
  return request<GroupBuyItem>({
    method: 'GET',
    url: '/groupList-byId-get',
    data: { id },
  })
}
