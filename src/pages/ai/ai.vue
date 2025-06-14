<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { aiCateGetApi } from '@/api/home.ts'
import type { AiCategoryItem } from '@/types/home'

// 获取ai列表
const chatList = ref<AiCategoryItem[]>([])

const chatListGet = async () => {
  const res = await aiCateGetApi()
  console.log(res.data)
  chatList.value = res.data
}

// 处理点击对话
const handleChatClick = (id: string) => {
  //  跳转到对应的ai
  console.log(id)
  uni.navigateTo({
    url: `/pages/dialogue/dialogue?id=${id}`,
  })
}

onMounted(() => {
  chatListGet()
})
</script>

<template>
  <scroll-view class="chat-list" :scroll-y="true">
    <view
      class="chat-item"
      v-for="item in chatList"
      :key="item._id"
      @tap="handleChatClick(item._id)"
    >
      <!-- 头像 -->
      <view class="avatar">
        <image
          :src="item.aiAvatar + '?x-oss-process=image/resize,w_100,h_100/format,webp'"
          mode="aspectFill"
        ></image>
      </view>
      <!-- 内容 -->
      <view class="content">
        <view class="title">{{ item.aiName }}</view>
        <view class="subtitle">点击开始对话</view>
      </view>
    </view>
  </scroll-view>
</template>

<style lang="scss">
page {
  height: 100%;
  background-color: #ffffff;
}

.chat-list {
  height: 100%;
  box-sizing: border-box;

  .chat-item {
    display: flex;
    align-items: center;
    padding: 0 24rpx;

    // 头像
    .avatar {
      margin-right: 24rpx;
      width: 112rpx;
      height: 112rpx;
      border-radius: 50%;
      overflow: hidden;
      background-color: #f5f5f5;

      image {
        width: 100%;
        height: 100%;
      }
    }

    // 内容
    .content {
      flex: 1;
      padding: 30rpx 0;
      border-bottom: 1px solid $color-divider;

      .title {
        margin-bottom: 8rpx;
        font-size: 32rpx;
        font-weight: 500;
        color: $color-title;
      }

      .subtitle {
        font-size: 24rpx;
        font-weight: 400;
        color: $color-text-secondary;
      }
    }

    &:last-child {
      .content {
        border-bottom: none;
      }
    }
  }
}
</style>
