import { defineStore } from 'pinia'
import { ref } from 'vue'

//定义 store
export const useFindCateStore = defineStore(
  'findCateList',
  () => {
    // 当前选择的分类id
    const currentCate = ref<string>('683e7627a4757718d8979aae')

    const setCurrentCate = (val: string) => {
      currentCate.value = val
    }

    return {
      currentCate,
      setCurrentCate,
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
