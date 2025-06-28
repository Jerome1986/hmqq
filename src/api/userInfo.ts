import { request } from '@/utils/request.ts'
import type { UserInfoItem } from '@/types/userInfo'
import type { updateResult } from '@/types/global'

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

/**
 * 根据用户id获取用户信息
 * /user-byId
 */

export const userInfoGetApi = (user_id: string) => {
  return request<UserInfoItem>({
    method: 'GET',
    url: '/user-byId',
    data: { user_id },
  })
}

/**
 * 根据id更新用户电话
 * /user-updateMobile
 */

export const updateUserMobileApi = (user_id: string, mobile: string) => {
  return request<updateResult>({
    method: 'POST',
    url: '/user-updateMobile',
    data: { user_id },
  })
}
