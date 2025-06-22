<script setup lang="ts"></script>

<template>
  <view class="groupInfo">
    <view class="title">团购详情</view>
    <view class="content">
      <view class="item">
        <text class="label">套餐内容</text>
        <!-- 这里渲染套餐的菜品 -->
        <view class="itemContent">
          <text class="value">团购套餐五选其一</text>
          <view class="priceWrapper">
            <text class="unit">(x1)</text>
            <text class="price">¥196</text>
          </view>
        </view>
      </view>
      <view class="item">
        <text class="label">备注</text>
        <text class="value">这里传详情图</text>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
/* 团购详情 */
.groupInfo {
  margin-top: 20rpx;
  padding: 30rpx;
  background-color: #fff;
  border-radius: 24rpx;

  /* 标题 */
  .title {
    font-size: 32rpx;
    font-weight: 600;
    color: $color-title;
  }

  /* 内容区域 */
  .content {
    /* 内容项 */
    .item {
      display: flex;
      flex-direction: column;
      font-size: 28rpx;
      color: $color-text;

      /* 标签 */
      .label {
        font-size: 28rpx;
        font-weight: 600;
        color: $color-title;

        &::before {
          // 使用伪元素添加点
          content: '·';
          padding: 20rpx 8rpx; // 10px = 20rpx, 4px = 8rpx
          color: #9499a0;
          font-size: 32rpx;
          line-height: 1;
          display: inline-block;
          transform: translateY(-1rpx);
        }
      }

      /* 内容区域 */
      .itemContent {
        display: flex;
        align-items: center;
        justify-content: space-between; // 两端对齐

        &:nth-last-child(1) {
          border-bottom: 1px solid $color-divider;
        }

        .value {
          margin-bottom: 16rpx;
          color: $color-text;
          font-size: 24rpx;
          font-weight: 400;
        }

        /* 右侧价格区域 */
        .priceWrapper {
          display: flex;
          align-items: center;
          color: $color-text;
          font-size: 24rpx;

          .unit {
            margin-right: 8rpx; // 单位和价格之间的间距
            color: $color-text-secondary;
          }
        }
      }

      /* 普通文本内容 */
      .value {
        padding-left: 24rpx;
        margin-bottom: 8rpx;
        color: $color-text;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
