<script setup lang="ts">
//接受参数
defineProps({
  availableStoresData: {
    type: Object,
    default: () => {},
  },
})

// 跳转定位
const handleAddress = () => {
  window.location.href = 'https://surl.amap.com/19knvRD107mq'
}
</script>

<template>
  <!-- 门店卡片信息 -->
  <view class="shopCard">
    <!-- 门店信息 -->
    <view class="left">
      <view class="shopImg">
        <image :src="availableStoresData.shopPic"></image>
      </view>
      <view class="shopInfo" @tap="handleAddress">
        <view class="shopName">{{ availableStoresData.shopName }}</view>
        <view class="shopTime">营业时间 {{ availableStoresData.shopTime }} </view>
        <view class="shopAddress">
          <text class="iconfont icon-dingwei"></text>
          <text class="address">{{ availableStoresData.shopAddress }}</text>
        </view>
      </view>
    </view>
    <!-- 联系电话 -->
    <view class="contactShop">
      <view class="icon">
        <text class="iconfont icon-a-Vector189"></text>
      </view>
      <view class="dec">联系商家</view>
    </view>
  </view>
</template>

<style scoped lang="scss">
/*底部对应门店*/
.shopCard {
  display: flex;
  justify-content: space-between;
  /*门店信息*/
  .left {
    flex: 1;
    display: flex;
    align-items: center;
    overflow: hidden;

    /*封面图*/
    .shopImg {
      height: 112rpx;
      width: 112rpx;
      border-radius: 8rpx;
      background-color: #d9d9d9;
      overflow: hidden;
      image {
        width: 100%;
        height: 100%;
      }
    }
    /*门店信息*/
    .shopInfo {
      flex: 1;
      margin-left: 16rpx;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
      color: $color-title;
      font-size: 24rpx;
      .shopName {
        font-weight: 600;
      }
      .shopTime {
      }
      .shopAddress {
        color: $color-text;
        display: flex;
        align-items: center;
        gap: 4rpx;
        width: 360rpx;

        .address {
          white-space: nowrap; /* 禁止换行 */
          overflow: hidden; /* 超出部分隐藏 */
          text-overflow: ellipsis; /* 超出部分显示省略号 */
        }

        .icon-dingwei {
          font-size: 32rpx;
          color: $brand-color-primary;
        }
      }
    }
  }
  /*联系电话*/
  .contactShop {
    margin-left: 32rpx;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    gap: 8rpx;
    width: 100rpx;
    color: $color-text;

    .icon {
      text-align: center;
      height: 48rpx;
      width: 48rpx;
      background-color: #e3e5e7;
      border-radius: 16rpx;

      .icon-a-Vector189 {
        font-size: 28rpx;
        color: $color-icon;
      }
    }

    .dec {
      font-size: 24rpx;
    }
  }
}
</style>
