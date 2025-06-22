<script setup lang="ts">
import ShopCard from '@/components/ShopCard.vue'
import { onMounted, ref } from 'vue'
import type { AvailableStores } from '@/types/ShopInfo.ts'
import { availableStoresApi } from '@/api/shopInfo.ts'

// 接受页面参数
const props = defineProps({
  groupId: {
    type: String,
    default: '',
  },
})
// 根据团购id获取适用门店列表
const availableStoresData = ref<AvailableStores[]>([])
const groupAvailableStoresGet = async (groupId: string) => {
  const res = await availableStoresApi(groupId)
  console.log(res.data)
  availableStoresData.value = res.data
}
onMounted(() => groupAvailableStoresGet(props.groupId))
</script>

<template>
  <view class="shopList">
    <view class="list" v-for="item in availableStoresData" :key="item._id">
      <ShopCard :available-stores-data="item"></ShopCard>
    </view>
  </view>
</template>

<style scoped lang="scss">
.shopList {
  padding: 24rpx;
  .list {
    padding: 24rpx;
    margin-bottom: 32rpx;
    background-color: #ffffff;
    border-radius: 16rpx;
  }
}
</style>
