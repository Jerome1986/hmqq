/**
 * declare module '@vue/runtime-core'
 *   现调整为
 * declare module 'vue'
 */
import 'vue'
import GroupBuy from '@/components/GroupBuy.vue'
import FindList from '@/components/FindList.vue'
import CustomCateHeader from '@/components/CustomCateHeader.vue'

declare module 'vue' {
  export interface GlobalComponents {
    GroupBuy: typeof GroupBuy
    FindList: typeof FindList
    CustomCateHeader: typeof CustomCateHeader
  }
}

// 组件实例类型
export type GroupBuyInstance = InstanceType<typeof GroupBuy>
export type FindListInstance = InstanceType<typeof FindList> & {
  resetData: () => void
  getListData: () => Promise<void>
}
export type CustomCateHeaderInstance = InstanceType<typeof CustomCateHeader>
