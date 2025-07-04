/** 首页-广告区域数据类型 */
export type UserInfoItem = {
  /** 唯一id */
  _id: string
  /** 微信用户标识 */
  openid: string
  /** 用户头像 */
  user_avatar: string
  /** 用户昵称 */
  nickname: string
  /** 用户角色 */
  role: string
  /** 性别 */
  gender: string | number
  /** 电话 */
  mobile: string
  /** 生日 */
  birthday: string
  /** 是否登录 */
  isLogin: boolean
  /** 是否申请入驻商户 */
  isShopJoin: boolean
  /** 是否申请达人 */
  isExpert: boolean
}
