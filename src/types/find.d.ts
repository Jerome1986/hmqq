/** 发现 - 头部分类数据类型 */
export type FindCateItem = {
  /** _id */
  _id: string
  /** 分类名称 */
  name: string
}

/**
 * 发现 - 列表数据类型
 */

export type ArticleListItem = {
  /** 唯一id */
  _id: string
  /** 封面图 */
  cover: string
  /** 文章标题 */
  articleName: string
  /** 用户头像 */
  userAvatar: string
  /** 用户昵称 */
  userNickname: string
  /** 阅读量 */
  lookNum: number
  /** 所属分类id */
  findCate_id: string
  /** 文章列表类型 */
  list_type: string
  /** 文章相册 */
  articlePicList: Array<string>
  /** 文章内容 */
  article_content: string
  /** 产品链接 */
  pro_id: string
}

/** 发现 - 收藏列表数据类型 */
export type LoveListItem = {
  /** _id */
  _id: string
  /** 用户id */
  user_id: string
  /** 团购id */
  group_id: string
}
