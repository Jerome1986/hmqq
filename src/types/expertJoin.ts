// 表单数据
export type ExpertForm = {
  /** 申请人唯一id */
  user_id: string
  /** 申请人姓名 */
  name: string
  /** 申请人电话 */
  phone: string
  /** 申请人身份证正面 */
  id_card_front: string
  /** 申请人身份证反面 */
  id_card_back: string
  /** 申请人抖音账号截图 */
  douyin_screenshot: string
  /** 申请人小红书账号截图 */
  xiaohongshu_screenshot: string
}
