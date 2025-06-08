import { defineStore } from 'pinia'
import { ref } from 'vue'

//定义 store
export const useSearchStore = defineStore(
  'search',
  () => {
    // 历史搜索
    const historyList = ref<string[]>([])

    // 设置历史搜索数据
    const setHistoryList = (value: string[]) => {
      historyList.value = value
    }

    // 清空历史搜索数据
    const clearHistoryList = () => {
      historyList.value = []
    }

    return {
      historyList,
      setHistoryList,
      clearHistoryList,
    }
  },
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
