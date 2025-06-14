import { request } from '@/utils/request.ts'
import type { CozeAnswerContent, CozeDialogueResponse } from '@/types/coze'

/**
 *  创建会话窗口
 *  /ai-dialogue-add
 */
export const createDialogueApi = (user_id: string, conversation_id?: string, message?: string) => {
  return request<CozeDialogueResponse>({
    method: 'POST',
    url: '/ai-dialogue-add',
    data: { user_id, conversation_id, message },
  })
}

/**
 * 获取ai回复
 * /ai-dialogue-get
 */
export const aiReplyApi = (conversation_id: string, chat_id: string) => {
  return request<CozeAnswerContent[]>({
    method: 'GET',
    url: `/ai-dialogue-get?conversation_id=${conversation_id}&chat_id=${chat_id}`,
  })
}
