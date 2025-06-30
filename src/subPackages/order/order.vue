<script setup lang="ts">
import { ref } from 'vue'

const orderType = ref([
  { id: 'a', name: '全部' },
  { id: 'b', name: '待核销' },
  { id: 'c', name: '已取消' },
  { id: 'd', name: '已完成' },
])

const activeIndex = ref(0)
</script>

<template>
  <view class="orderPage">
    <!--  订单类型  -->
    <view class="headerType">
      <view
        class="headerItem"
        :class="{ activeType: activeIndex === index }"
        v-for="(item, index) in orderType"
        :key="item.id"
        @tap="activeIndex = index"
      >
        {{ item.name }}
      </view>
    </view>
    <!--  订单列表  -->
    <view class="orderList">
      <!-- 循环项 -->
      <view class="orderItem" v-for="(item, index) in 4" :key="index">
        <!--  商家信息  -->
        <view class="shopInfo">
          <view class="shopLeft">
            <view class="shopLogo">
              <image
                src="https://objectstorageapi.gzg.sealos.run/dxepxlzz-hmqq-ai/images/avatar.jpg"
                mode="aspectFit"
              ></image>
            </view>
            <view class="shopName">商家名称</view>
          </view>
          <!--  订单当前状态  -->
          <view class="shopRight">待核销</view>
        </view>
        <!--  团购信息  -->
        <view class="groupInfo">
          <view class="info">
            <!--  封面图  -->
            <view class="cover">
              <image
                src="https://objectstorageapi.gzg.sealos.run/dxepxlzz-hmqq-ai/images/today.jpg"
                mode="aspectFill"
              ></image>
            </view>
            <!--  标题和有效期  -->
            <view class="text">
              <view class="groupName">团购标题</view>
              <view class="term">有效期至：2025-06-13</view>
            </view>
          </view>
          <!--  价格和数量  -->
          <view class="number">
            <view class="price">￥99</view>
            <view class="num">共1件</view>
          </view>
        </view>
        <!--  操作按钮  -->
        <view class="btn">
          <view class="orderBtn defaultBtn">订单详情</view>
          <view class="lookBtn defaultBtn">查看券码</view>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.orderPage {
  padding: 0 24rpx 120rpx;
  /*订单类型*/
  .headerType {
    display: flex;
    align-items: center;
    gap: 40rpx;
    padding: 16rpx 0;

    .headerItem {
      font-size: 36rpx;
      color: $color-text;
    }

    .activeType {
      font-weight: 600;
      color: $brand-color-primary;
    }
  }

  /*订单列表*/
  .orderList {
    .orderItem {
      padding: 16rpx;
      border-radius: 16rpx;
      margin-bottom: 16rpx;
      background-color: #ffffff;

      /*商家信息*/
      .shopInfo {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .shopLeft {
          display: flex;
          align-items: center;

          .shopLogo {
            margin-right: 16rpx;
            width: 64rpx;
            height: 64rpx;
            border-radius: 50%;
            overflow: hidden;

            image {
              width: 100%;
              height: 100%;
            }
          }
          .shopName {
            font-size: 28rpx;
            font-weight: 500;
            color: $color-title;
          }
        }

        /*团购订单当前状态*/
        .shopRight {
          font-size: 24rpx;
          line-height: 32rpx;
          color: $color-text-secondary;
        }
      }
      /*团购信息*/
      .groupInfo {
        margin: 16rpx 0;
        display: flex;
        justify-content: space-between;

        .info {
          display: flex;
          /*封面图*/
          .cover {
            width: 156rpx;
            height: 156rpx;
            border-radius: 8rpx;
            overflow: hidden;

            image {
              width: 100%;
              height: 100%;
            }
          }
          /*团购文字信息*/
          .text {
            margin-left: 16rpx;
            /*名称*/
            .groupName {
              margin-bottom: 8rpx;
              font-size: 28rpx;
              font-weight: 600;
              color: $color-title;
            }
            /*有效期*/
            .term {
              font-size: 24rpx;
              color: $color-text-secondary;
            }
          }
        }
        /*价格和数量*/
        .number {
          .price {
            margin-bottom: 8rpx;
            font-size: 28rpx;
            font-weight: 600;
            color: $color-title;
          }
          .num {
            font-size: 24rpx;
            color: $color-text-secondary;
          }
        }
      }
      /*操作按钮*/
      .btn {
        display: flex;
        justify-content: flex-end;
        gap: 16rpx;
        font-size: 28rpx;
        color: $color-title;

        .defaultBtn {
          padding: 18rpx 24rpx;
          height: 80rpx;
          border-radius: 16rpx;
          border: 1px solid $color-divider;
        }
      }
    }
  }
}
</style>
