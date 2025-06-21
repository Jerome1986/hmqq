import { defineStore } from 'pinia'
import { ref } from 'vue'
import { loveListAddApi, userLoveListGetApi } from '@/api/groupDetail'
import { useMemberStore } from '@/stores'

export const useLoveStore = defineStore(
  'love',
  () => {
    const memberStore = useMemberStore()
    // 存储收藏的团购ID列表
    const loveList = ref<string[]>([])
    // 存储最近更新的团购ID
    const lastUpdated = ref<{ groupId: string; isLoved: boolean } | null>(null)

    // 初始化收藏列表
    const initLoveList = async () => {
      if (memberStore.profile?._id) {
        const res = await userLoveListGetApi(memberStore.profile._id)
        loveList.value = res.data.map((item) => item.group_id)
      }
    }

    // 检查是否收藏
    const isLoved = (groupId: string) => {
      return loveList.value.includes(groupId)
    }

    // 处理收藏操作
    const toggleLove = async (groupId: string) => {
      if (!memberStore.profile?._id) {
        uni.showToast({
          icon: 'none',
          title: '登录后才可添加收藏',
        })
        return false
      }

      try {
        await loveListAddApi(memberStore.profile._id, groupId)
        const newIsLoved = !isLoved(groupId)

        // 更新收藏状态
        if (newIsLoved) {
          loveList.value.push(groupId)
        } else {
          loveList.value = loveList.value.filter((id) => id !== groupId)
        }

        // 更新最近修改的状态
        lastUpdated.value = {
          groupId,
          isLoved: newIsLoved,
        }

        // 显示操作成功的提示
        uni.showToast({
          icon: 'success',
          title: newIsLoved ? '收藏成功' : '已取消收藏',
          mask: true,
        })

        return true
      } catch (error) {
        console.error('收藏操作失败:', error)
        // 显示操作失败的提示
        uni.showToast({
          icon: 'error',
          title: '操作失败，请重试',
        })
        return false
      }
    }

    return {
      loveList,
      isLoved,
      toggleLove,
      initLoveList,
      lastUpdated,
    }
  },
  {
    persist: {
      storage: {
        getItem(key) {
          return uni.getStorageSync?.(key)
        },
        setItem(key, value) {
          uni.setStorageSync?.(key, value)
        },
      },
    },
  },
)
