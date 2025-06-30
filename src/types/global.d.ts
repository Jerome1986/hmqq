/** 通用分页结果类型 */
export type PageResult<T> = {
  /** 列表数据 */
  list: T[]
  /** 当前页数 */
  current: number
  /** 每页条数 */
  pageSize: number
  /** 总数据条数 */
  total: number
  /** 总页数 */
  totalPages: number
}

/**
 * 发现页带分页返回结果类型
 */
export type FindPageResult<T> = {
  /** 列表数据 */
  list: T[]
  /** 当前页数 */
  current: number
  /** 每页条数 */
  pageSize: number
  /** 总数据条数 */
  total: number
  /** 总页数 */
  totalPages: number
  /** 是否为团购 */
  isGroupBuy: boolean
}

/** 通用分页参数类型 */
export type PageParams = {
  /** 页码：默认值为 1 */
  page?: number
  /** 页大小：默认值为 10 */
  pageSize?: number
}

/** 添加评论参数类型 */
export type CommentResult = {
  /** 添加成功的评论id */
  comment_id: string
}

/** 添加到收藏列表结果类型 */
export type LoveListResult = {
  /** 是否添加成功 */
  acknowledged: string
  /** 返回的id */
  insertedId: string
}

/** 申请入驻商铺结果类型 */
export type ShopJoinResult = {
  /** 添加成功后返回的结果 */
  result: {
    /** 是否添加成功 */
    acknowledged: string
    /** 返回的id */
    insertedId: string
  }
  /** 用户申请的状态 */
  isShopJoin: string
}

/** 申请入驻达人结果类型 */
export type ExpertJoinResult = {
  /** 添加成功后返回的结果 */
  result: {
    /** 是否添加成功 */
    acknowledged: string
    /** 返回的id */
    insertedId: string
  }
  /** 用户申请的状态 */
  isExpert: string
}

/**
 * 通用更新结果类型
 */

export type updateResult = {
  /** 是否更新成功 */
  acknowledged: boolean
  /** 匹配条数 */
  matchedCount: number
}

/**
 * deepseek通用结果回复
 */
export type DeepSeekResult = {
  /** 回复内容 */
  reply: string
}
