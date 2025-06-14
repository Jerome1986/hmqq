<script setup lang="ts">
import type { AiCategoryItem } from '@/types/home'

// 通过props接收数据
defineProps<{
  aiCateList: AiCategoryItem[]
  isLoading: boolean
}>()
</script>

<template>
  <view class="ai">
    <view class="title">AI智能体</view>
    <!-- 加载状态显示 -->
    <view class="loading" v-show="isLoading">
      <view class="loading-icon"></view>
      <text>加载中...</text>
    </view>
    <!-- AI列表 -->
    <view v-show="!isLoading" class="aiView">
      <view class="aiItem" v-for="item in aiCateList" :key="item._id">
        <image
          class="aiAvatar"
          :src="
            item.aiAvatar +
            '?x-oss-process=image/resize,w_200,h_200/format,webp/quality,q_75/interlace,1'
          "
          mode="aspectFill"
        ></image>
        <view class="aiName">{{ item.aiName }}</view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.ai {
  padding: 22rpx;
  /*标题*/
  .title {
    margin: 32rpx 0;
    font-size: 36rpx;
    font-weight: 600;
  }

  // 添加loading样式
  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20rpx 0;

    .loading-icon {
      width: 40rpx;
      height: 40rpx;
      margin-right: 12rpx;
      border: 4rpx solid #f3f3f3;
      border-top: 4rpx solid $brand-color-primary;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    text {
      font-size: 28rpx;
      color: $color-text-secondary;
    }
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  /*列表*/
  .aiView {
    display: flex;
    flex-wrap: wrap;
    gap: 32rpx;
    /*每一项*/
    .aiItem {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0 9.8rpx;
      color: $color-text;
      /*ai头像*/
      .aiAvatar {
        width: 96rpx;
        height: 96rpx;
        border-radius: 50%;
        overflow: hidden;
      }
      .aiName {
        font-size: 24rpx;
      }
    }
  }
}
</style>
