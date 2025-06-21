<script setup lang="ts">
defineProps({
  validityPeriod: String,
})
</script>

<template>
  <view class="notice">
    <view class="title">消费须知</view>
    <view class="content">
      <view class="item">
        <view class="text">
          <text class="iconfont icon-riqi"></text>
          <text>有效期</text>
        </view>
        <view class="value">{{ validityPeriod }}</view>
      </view>
      <view class="item">
        <view class="text">
          <text class="iconfont icon-a-shijian1"></text>
          <text>使用时间</text>
        </view>
        <view class="value">营业时间内可用</view>
      </view>
      <view class="item">
        <view class="text">
          <text class="iconfont icon-a-shiyongguize1"></text>
          <text>使用规则</text>
        </view>
        <text class="value">使用规则文案,具体应有商家提供或抓取</text>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.notice {
  margin-top: 20rpx;
  padding: 30rpx;
  background-color: #fff;
  border-radius: 24rpx;

  /* 标题 */
  .title {
    margin-bottom: 24rpx;
    font-size: 32rpx;
    font-weight: 600;
    color: $color-title;
  }

  /* 内容区域 */
  .content {
    display: flex;
    flex-direction: column;
    gap: 24rpx;
    /* 内容项 */
    .item {
      display: flex;
      flex-direction: column;
      gap: 16rpx;

      /* 标签 */
      .text {
        font-size: 28rpx;
        font-weight: 500;
        color: $color-title;

        .iconfont {
          margin-right: 8rpx;
        }
      }

      /* 普通文本内容 */
      .value {
        padding-left: 24rpx;
        margin-bottom: 8rpx;
        color: $color-text;
        font-size: 24rpx;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
