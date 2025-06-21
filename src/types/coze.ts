// Coze API 响应类型定义

/**
 * 创建对话返回数据类型
 */
export type CozeDialogueResponse = {
  /** 对话的唯一标识 */
  chat_id: string
  /** 会话的唯一标识 */
  conversation_id: string
}

export type CozeAnswerContent = {
  /** 智能体ID */
  bot_id: string
  /** 对话的唯一标识 */
  chat_id: string
  /** 文本内容 */
  content: string
  /** 文本类型 */
  content_type: string
  /** 会话的唯一标识 */
  conversation_id: string
  /** 创建时间 */
  created_at: string
  /** DeepSeek-R1 模型的思维链 */
  reasoning_content: string
  /** 角色 */
  role: string
  /** 回复类型（问/答） */
  type: string
  /** 更新时间 */
  updated_at: string
}
