/** 首页-广告区域数据类型 */
export type UserInfoItem = {
  /** 唯一id */
  _id: string
  /** 用户头像 */
  user_avatar: string
  /** 用户昵称 */
  nickname: string
  /** 用户角色 */
  role: Array<string>
  /** 性别 */
  gender: string
  /** 生日 */
  birthday: string
  /** 是否登录 */
  isLogin: boolean
}
