import { request } from '@/utils/request.ts'
import type { GroupBuyItem } from '@/types/home'

/**
 * 搜索根据套餐名匹配团购
 * /groupList-searchName-get
 */
export const searchApi = (searchVal: string) => {
  return request<GroupBuyItem[]>({
    method: 'GET',
    url: '/groupList-searchName-get',
    data: { searchVal },
  })
}
