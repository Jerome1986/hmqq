<script setup lang="ts">
import Stepper from '@/pages/confirmOrder/components/Stepper.vue'
import { onLoad } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'
import { groupDetailApi } from '@/api/groupDetail.ts'
import type { GroupBuyItem } from '@/types/home'

// 获取页面参数
onLoad((option: any) => {
  console.log(option.groupId)
  groupGet(option.groupId)
})

// 获取团购详情
const groupData = ref<GroupBuyItem>()
const groupGet = async (groupId: string) => {
  const res = await groupDetailApi(groupId)
  console.log(res)
  groupData.value = res.data
}

// 团购件数
const groupNum = ref(1)

// 优惠金额
const discountAmount = computed<number>(() => {
  if (groupData.value?._id) {
    return groupData.value?.originalPrice - groupData.value?.currentPrice || 0
  }
  return 0
})

// 合计金额
const totalPrice = computed<number>(() => {
  if (groupData.value?._id) {
    return groupData.value?.currentPrice * groupNum.value
  }
  return 0
})

// 优惠券金额
const couponNum = ref(0)

// 总优惠金额
const totalDiscountAmount = computed<number>(() => {
  if (discountAmount.value) {
    return discountAmount.value + couponNum.value
  }
  return 0
})

// 处理步进器数量
const handleGroupNum = (e: number) => {
  groupNum.value = e
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
        <image :src="groupData?.coverImage" mode="aspectFill"></image>
      </view>
      <!--  信息  -->
      <view class="info">
        <view class="title">{{ groupData?.packageName }}</view>
        <view class="useTime">{{ groupData?.usageInstructions }}</view>
        <view class="dec">免预约 · 随时退 · 过期自动退</view>
        <view class="price">
          <view class="priceNum">￥{{ groupData?.currentPrice }}</view>
          <!--  步进器  -->
          <Stepper @updateNum="handleGroupNum"></Stepper>
        </view>
      </view>
    </view>
    <!--  商品价格  -->
    <view class="orderPrice">
      <!--  头部  -->
      <view class="head">
        <view class="title"
          >商品总价 <text style="color: #9499a0">(共{{ groupNum }}件)</text></view
        >
        <view class="price">￥{{ totalPrice }}</view>
      </view>
      <!--  优惠券  -->
      <view class="content">
        <!--  团购优惠  -->
        <view class="couponItem">
          <view class="left">
            <view class="icon">团</view>
            <view class="txt">团购优惠</view>
          </view>
          <view class="right">减￥{{ discountAmount }}</view>
        </view>
        <!--  平台优惠券  -->
        <view class="couponItem">
          <view class="left">
            <view class="icon">券</view>
            <view class="txt">平台券</view>
          </view>
          <!-- todo 检查用户是否有优惠券 并计入计算--默认false=暂无可用 -->
          <!--  可用  -->
          <view class="coupon" v-if="false">
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
        <view class="payNum">￥{{ totalPrice }}</view>
      </view>
    </view>
    <!--  底部提交  -->
    <view class="submitOrder">
      <view class="orderInfo">
        <!--  合计金额  -->
        <view class="total">
          <text>合计</text>
          <text>￥</text>
          <text style="font-size: 20px">{{ totalPrice }}</text>
        </view>
        <!--  总优惠  -->
        <view class="discounts"> 共{{ groupNum }}件 总优惠 ￥{{ totalDiscountAmount }} </view>
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

      image {
        width: 100%;
        height: 100%;
      }
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
