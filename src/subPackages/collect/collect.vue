<script setup lang="ts">
import { computed, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import FindList from '@/components/FindList.vue'
import type { FindListInstance } from '@/types/component'
import { useLoveStore } from '@/stores'

// 获取组件实例，用于调用组件方法
const findListRef = ref<FindListInstance>()
const loveStore = useLoveStore()
const isEmpty = computed(() => {
  return loveStore.loveList.length > 0
})

// 页面显示时刷新列表
onShow(async () => {
  // 初始化收藏列表
  await loveStore.initLoveList()

  // 重置并获取数据
  findListRef.value?.resetData()
  findListRef.value?.getListData()
})
</script>

<template>
  <view class="collect" v-if="isEmpty">
    <FindList ref="findListRef" :is-collect="true"></FindList>
  </view>
  <view v-else class="empty">
    <image src="/static/images/collectEmpty.png" mode="aspectFit"></image>
  </view>
</template>

<style scoped lang="scss">
.collect {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.empty {
  text-align: center;
  image {
    margin-top: 264rpx;
    width: 352rpx;
    height: 284rpx;
  }
}
</style>
