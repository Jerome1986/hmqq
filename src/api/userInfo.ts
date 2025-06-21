import { request } from '@/utils/request.ts'

/**
 * 根据id更新用户信息
 * /user-updateInfo
 */

export const updateUserInfoApi = (
  user_id: string,
  gender?: string | number,
  mobile?: string,
  birthday?: string,
) => {
  return request<any>({
    method: 'POST',
    url: '/user-updateInfo',
    data: { user_id, gender, mobile, birthday },
  })
}
