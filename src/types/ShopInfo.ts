/**
 * 店铺信息数据类型
 */

export type ShopInfo = {
  /** 提交人/法人id */
  user_id: string
  /** 唯一id */
  _id?: string
  /** 店名 */
  shop_name: string
  /** 门店地址 */
  shop_address: string
  /** 门店电话 */
  shop_phone: string
  /** 所属行业 */
  shop_industry: string
  /** logo图片 */
  shop_logo_picture: string
  /** 身份证正面 */
  id_card_front: string
  /** 身份证反面 */
  id_card_back: string
  /** 营业执照 */
  business_licenses: string
  /** 其他证件 */
  other_certificates?: string
  /** 状态（默认为0，0代表审核中，1代表审核通过 2代表被封禁或下架） */
  state: number
}
