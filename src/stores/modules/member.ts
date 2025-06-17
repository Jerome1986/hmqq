import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { UserInfoItem } from '@/types/userInfo'

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
      isLogin: false,
      isShopJoin: false,
      isExpert: false,
    })

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
        isLogin: false,
        isShopJoin: false,
        isExpert: false,
      }
    }

    // 记得 return
    return {
      profile,
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
