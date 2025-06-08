import { request } from '@/utils/request.ts'
import type { ArticleListItem } from '@/types/find'
import type { CommentResult } from '@/types/global'
import type { CommentItem } from '@/types/comment.ts'

/**
 * 根据文章id获取文章详情
 * /articleDetail-get
 */

export const articleDetailGetApi = (article_id: string) => {
  return request<ArticleListItem>({
    method: 'GET',
    url: '/articleDetail-get',
    data: { article_id },
  })
}

/**
 * 文章阅读量触发器
 * /article-views-add
 */

export const articleViewsApi = (article_id: string) => {
  return request<any>({
    method: 'POST',
    url: '/article-views-add',
    data: { article_id },
  })
}

/**
 * 添加评论
 * /comment-add
 */

export const commentsAddApi = (
  article_id: string,
  user_id: string,
  user_nickname: string,
  user_avatar: string,
  content: string,
) => {
  return request<CommentResult>({
    method: 'POST',
    url: '/comment-add',
    data: { article_id, user_id, user_nickname, user_avatar, content },
  })
}

/**
 * 根据文章id获取评论列表
 * /comment-get
 */

export const commentsGetApi = (article_id: string) => {
  return request<CommentItem[]>({
    method: 'GET',
    url: '/comment-get',
    data: { article_id },
  })
}
