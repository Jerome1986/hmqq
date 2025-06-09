import { request } from '@/utils/request.ts'
import type { GroupBuyItem } from '@/types/home'
import type { LoveListResult } from '@/types/global'
import type { LoveListItem } from '@/types/find'

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

/**
 * 将团购添加到用户的收藏列表
 * /loveList-add
 */

export const loveListAddApi = (user_id: string, group_id: string) => {
  return request<LoveListResult>({
    method: 'POST',
    url: '/loveList-add',
    data: { user_id, group_id },
  })
}

/**
 * 获取当前用户的收藏列表
 * /loveList-get
 */

export const userLoveListGetApi = (user_id: string) => {
  return request<LoveListItem[]>({
    method: 'GET',
    url: '/loveList-get',
    data: { user_id },
  })
}
