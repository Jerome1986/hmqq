/**
 * 团购列表组合式函数
 */
import { ref } from 'vue'
import type { GroupBuyInstance } from '@/types/component'

export const useGroupBuyList = () => {
  //  团购组件实例
  const groupBuyRef = ref<GroupBuyInstance>()

  //  滚动触底事件
  const onScrolltolower = () => {
    console.log('触底事件', groupBuyRef.value)
    groupBuyRef.value?.getMore()
  }

  //  返回ref和事件处理函数
  return {
    groupBuyRef,
    onScrolltolower,
  }
}
