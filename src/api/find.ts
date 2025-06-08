import { request } from '@/utils/request.ts'
import type { ArticleListItem, FindCateItem } from '@/types/find'
import type { FindPageResult, PageParams } from '@/types/global'
import type { GroupBuyItem } from '@/types/home'

/**
 * 发现页头部分类获取
 * /find-cate-get
 */

export const findCateGetApi = () => {
  return request<FindCateItem[]>({
    method: 'GET',
    url: '/find-cate-get',
  })
}

/**
 * 发现页-根据分类id获取列表
 * /FindArticleList-byId-get
 */
export type FindListApiResponse = FindPageResult<ArticleListItem> | FindPageResult<GroupBuyItem>

export const findListGetApi = (cate_id: string, params?: PageParams) => {
  return request<FindListApiResponse>({
    method: 'GET',
    url: `/FindArticleList-byId-get?cate_id=${cate_id}`,
    data: params,
  })
}
