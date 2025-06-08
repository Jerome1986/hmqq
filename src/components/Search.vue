<script setup lang="ts"></script>

<template>
  <view class="search">
    <view class="components">
      <view class="left">
        <text class="iconfont icon-sousuo"></text>
        <slot></slot>
        <slot name="clear"></slot>
      </view>
      <slot name="btn"></slot>
    </view>
  </view>
</template>

<style scoped lang="scss">
.search {
  padding: 16rpx 24rpx;
  background: #fff;

  .components {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 4rpx 3rpx 4rpx 24rpx;
    height: 64rpx;
    border: 1px solid red;
    border-radius: 32rpx;

    /*图标*/
    .left {
      display: flex;
      flex: 1;
      height: 100%;
      align-items: center;

      .icon-sousuo {
        margin-right: 8rpx;
        font-size: 32rpx;
        color: $color-text-secondary;
      }
    }
  }
}
</style>
