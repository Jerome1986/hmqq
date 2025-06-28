<script setup lang="ts">
import Stepper from '@/pages/confirmOrder/components/Stepper.vue'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { groupDetailApi } from '@/api/groupDetail.ts'

// 获取页面参数
onLoad((option: any) => {
  console.log(option.groupId)
  groupGet(option.groupId)
})

// 获取团购详情
const groupGet = async (groupId: string) => {
  const res = await groupDetailApi(groupId)
  console.log(res)
}

// 处理步进器数量
const handleGroupNum = (e: number) => {
  console.log('handleGroupNum', e)
}

// 处理提交订单
const submit = () => {
  console.log('提交支付')
}
</script>

<template>
  <view class="confirmOrder">
    <!--  团购信息  -->
    <view class="confirmOrder_item">
      <!--  封面  -->
      <view class="cover">
        <image mode="aspectFill"></image>
      </view>
      <!--  信息  -->
      <view class="info">
        <view class="title">团购标题</view>
        <view class="useTime">周一到周日可用</view>
        <view class="dec">免预约 · 随时退 · 过期自动退</view>
        <view class="price">
          <view class="priceNum">￥16</view>
          <!--  步进器  -->
          <Stepper @updateNum="handleGroupNum"></Stepper>
        </view>
      </view>
    </view>
    <!--  商品价格  -->
    <view class="orderPrice">
      <!--  头部  -->
      <view class="head">
        <view class="title">商品总价 <text style="color: #9499a0">(共1件)</text></view>
        <view class="price">￥16</view>
      </view>
      <!--  优惠券  -->
      <view class="content">
        <!--  团购优惠  -->
        <view class="couponItem">
          <view class="left">
            <view class="icon">团</view>
            <view class="txt">团购优惠</view>
          </view>
          <view class="right">减￥9</view>
        </view>
        <!--  平台优惠券  -->
        <view class="couponItem">
          <view class="left">
            <view class="icon">券</view>
            <view class="txt">平台券</view>
          </view>
          <!--  可用  -->
          <view class="coupon" v-if="true">
            <text>1张可用</text>
            <text class="iconfont icon-you" style="font-size: 14px; color: #9499a0"></text>
          </view>
          <!--  暂无可用  -->
          <view class="coupon" v-else>
            <text>暂无可用</text>
          </view>
        </view>
      </view>
      <!--  实付款  -->
      <view class="payPrice">
        <view class="text">实付</view>
        <view class="payNum">￥6</view>
      </view>
    </view>
    <!--  底部提交  -->
    <view class="submitOrder">
      <view class="orderInfo">
        <!--  合计金额  -->
        <view class="total">
          <text>合计</text>
          <text>￥</text>
          <text style="font-size: 20px">6</text>
        </view>
        <!--  总优惠  -->
        <view class="discounts"> 共1件 总优惠 ￥10 </view>
      </view>
      <view class="submitBtn" @tap="submit">提交订单</view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.confirmOrder {
  padding: 24rpx;
  /*团购信息*/
  .confirmOrder_item {
    margin-bottom: 16rpx;
    padding: 24rpx;
    display: flex;
    background-color: #ffffff;
    border-radius: 24rpx;

    .cover {
      margin-right: 16rpx;
      height: 144rpx;
      width: 144rpx;
      border-radius: 8rpx;
      overflow: hidden;
      background-color: #d9d9d9;
    }
    /*信息*/
    .info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex: 1;
      font-size: 24rpx;
      color: $color-text-secondary;
      .title {
        font-weight: 500;
        color: $color-title;
      }
      .useTime {
      }
      .dec {
      }

      /*价格区域*/
      .price {
        display: flex;
        justify-content: space-between;
        width: 100%;
        margin-top: 4rpx;

        .priceNum {
          font-size: 28rpx;
          font-weight: 600;
          color: $color-title;
        }
      }
    }
  }
  /*价格区域*/
  .orderPrice {
    padding: 24rpx;
    background-color: #ffffff;
    border-radius: 24rpx;
    font-size: 28rpx;

    /*头部*/
    .head {
      padding-bottom: 16rpx;
      display: flex;
      justify-content: space-between;
      color: $color-title;
      border-bottom: 1px solid $color-divider;
      .title {
      }
      .price {
        font-weight: 600;
      }
    }

    /*优惠券*/
    .content {
      padding: 16rpx 0;
      border-bottom: 1px solid $color-divider;
      .couponItem {
        margin-bottom: 16rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 44rpx;

        .left {
          display: flex;
          align-items: center;
          .icon {
            text-align: center;
            width: 32rpx;
            height: 32rpx;
            line-height: 32rpx;
            border-radius: 4rpx;
            color: #ffffff;
            font-size: 20rpx;
            background-color: $brand-color-primary;
          }
          .txt {
            margin-left: 16rpx;
            font-size: 28rpx;
            color: $color-text;
          }
        }
        .right {
          font-size: 24rpx;
          color: $brand-color-primary;
        }
        /*优惠券*/
        .coupon {
          display: flex;
          align-items: center;
          font-size: 24rpx;
          color: $brand-color-primary;
        }
      }
    }

    /*实付*/
    .payPrice {
      padding-top: 16rpx;
      display: flex;
      justify-content: space-between;
      .text {
        font-weight: 600;
        color: $color-title;
      }
      .payNum {
        color: $brand-color-primary;
        font-weight: 600;
      }
    }
  }

  /*底部提交*/
  .submitOrder {
    padding: 16rpx 32rpx 60rpx 24rpx;
    position: fixed;
    left: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    width: 100%;
    background-color: #fff;

    /*合计信息*/
    .orderInfo {
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 96rpx;
      font-size: 24rpx;
      .total {
        margin-bottom: 8rpx;
        color: $brand-color-primary;
      }
      .discounts {
        color: $color-text-secondary;
      }
    }

    /*提交按钮*/
    .submitBtn {
      text-align: center;
      width: 224rpx;
      height: 96rpx;
      line-height: 96rpx;
      background: linear-gradient(to right, #f6759b, #e65478);
      border-radius: 48rpx;
      color: #fff;
      font-weight: 600;
    }
  }
}
</style>
