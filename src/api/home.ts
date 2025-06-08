import { request } from '@/utils/request.ts'
import type { AiCategoryItem, GroupBuyItem } from '@/types/home'
import type { PageParams, PageResult } from '@/types/global'

/**
 * 首页ai智能体分类
 * /ai-cate-get
 */
export const aiCateGetApi = () => {
  return request<AiCategoryItem[]>({
    method: 'GET',
    url: '/ai-cate-get',
  })
}

/**
 * 首页团购列表
 * /groupList-get
 */
export const groupBuyListGetApi = (params?: PageParams) => {
  return request<PageResult<GroupBuyItem>>({
    method: 'GET',
    url: '/groupList-get',
    data: params,
  })
}
