/**
 * 评论列表返回数据
 */
export type CommentItem = {
  /** 唯一id */
  _id: string
  /** 文章id */
  article_id: string
  /** 用户id */
  user_id: string
  /** 用户昵称 */
  user_nickname: string
  /** 用户头像 */
  user_avatar: string
  /** 评论内容 */
  content: string
  /** 评论时间 */
  creatAt: string
}
