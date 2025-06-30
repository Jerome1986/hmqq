import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { UserInfoItem } from '@/types/userInfo'
import { userInfoGetApi } from '@/api/userInfo.ts'

// 定义 Store
export const useMemberStore = defineStore(
  'member',
  () => {
    // 会员信息
    const profile = ref<UserInfoItem>({
      _id: '',
      openid: '',
      user_avatar: '/static/images/avatar.png',
      nickname: '点击登录',
      role: '',
      birthday: '',
      gender: '',
      mobile: '',
      isLogin: false,
      isShopJoin: false,
      isExpert: false,
    })

    // 根据用户id请求用户信息
    const userInfoGet = async (user_id: string) => {
      if (user_id) {
        const res = await userInfoGetApi(user_id)
        profile.value = res.data
        profile.value.isLogin = true
      }
    }

    // 保存会员信息，登录时使用
    const setProfile = (val: any) => {
      profile.value = { ...profile.value, ...val }
    }

    // 清理会员信息，退出时使用
    const clearProfile = () => {
      profile.value = {
        _id: '',
        openid: '',
        user_avatar: '/static/images/avatar.png',
        nickname: '点击登录',
        role: '',
        birthday: '',
        gender: '',
        mobile: '',
        isLogin: false,
        isShopJoin: false,
        isExpert: false,
      }
    }

    // 记得 return
    return {
      profile,
      userInfoGet,
      setProfile,
      clearProfile,
    }
  },
  // TODO: 持久化
  {
    persist: {
      storage: {
        getItem(key) {
          // 兼容移动端浏览器
          return uni.getStorageSync?.(key)
        },
        setItem(key, value) {
          uni.setStorageSync?.(key, value)
        },
      },
    },
  },
)
