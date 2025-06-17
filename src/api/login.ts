import { request } from '@/utils/request.ts'
import type { UserInfoItem } from '@/types/userInfo'

/**
 * 登录
 * @param code - 授权后返回的code
 * /wx-login
 */

export const loginApi = (code: string) => {
  return request<UserInfoItem>({
    method: 'POST',
    url: '/wx-login',
    data: { code },
  })
}
