import { request } from '@/utils/request.ts'
import type { AiCategoryItem } from '@/types/home'
import type { DeepSeekResult } from '@/types/global'

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

/**
 * 获取ai对话内容-deepseek模型
 * /openAi-chat
 */

export const aiChartDeepSeekApi = (userId: string, content: string, sessionId?: string) => {
  return request<DeepSeekResult>({
    method: 'POST',
    url: '/openAi-chat',
    data: { userId, content, sessionId },
  })
}
