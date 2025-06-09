/** 首页-广告区域数据类型 */
export type BannerItem = {
  /** 跳转链接 */
  hrefUrl: string
  /** id */
  id: string
  /** 图片链接 */
  imgUrl: string
  /** 跳转类型 */
  type: number
}

/** 首页-ai类目数据类型 */
export type AiCategoryItem = {
  /** 图标路径 */
  aiAvatar: string
  /** id */
  _id: string
  /** ai分类名称 */
  aiName: string
}

/** 首页-团购数据类型 */
export type GroupBuyItem = {
  /** 封面图URL */
  coverImage: string
  /** 套餐名称 */
  packageName: string
  /** 已售出数量 */
  soldQuantity: number
  /** 营业时间 */
  businessHours: string
  /** 门店区域 */
  storeArea: string
  /** 当前价格 */
  currentPrice: number
  /** 折扣比例 (0-1) */
  discount: number
  /** 原价 */
  originalPrice: number
  /** 唯一ID */
  _id: string
  /** 消费须知 */
  usageInstructions: string
  /** 服务保障 */
  serviceGuarantee: string
  /** 有效期限 */
  validityPeriod: string
  /** 适用门店 */
  applicableStores: string
  /** 团购详情图 */
  pictureList: string[]
  /** 售出 */
  sell: number
  /** 收藏 */
  love: number
  /** 商家名称 */
  shop_name: string
  /** 是否被收藏 */
  isLoved: boolean
}
