import { request } from '@/utils/request.ts'
import type { AiCategoryItem } from '@/types/home'

/**
 * 根据id获取ai详情
 * /ai-byId-get
 */

export const aiDetailApi = (ai_id: string) => {
  return request<AiCategoryItem>({
    method: 'GET',
    url: '/ai-byId-get',
    data: { ai_id },
  })
}
