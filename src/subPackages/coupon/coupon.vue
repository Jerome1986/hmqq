<script setup lang="ts"></script>

<template>
  <view class="couponPage">
    <!-- 列表  -->
    <view class="list">
      <!--  每一项  -->
      <view class="couponItem">
        <!--  商户头像  -->
        <view class="shopAvatar">
          <image
            src="https://objectstorageapi.gzg.sealos.run/dxepxlzz-hmqq-ai/images/avatar.jpg"
            mode="aspectFit"
          ></image>
        </view>
        <!-- 优惠券信息  -->
        <view class="shopInfo">
          <view class="shopName">商家名称</view>
          <view class="couponInfo">
            <view class="left">
              <!--   价格   -->
              <view>
                <text class="symbol">￥</text>
                <text class="num">8</text>
              </view>
            </view>
            <!--   标题和到期时间   -->
            <view class="right">
              <view class="info">
                <view class="title">标题</view>
                <view class="time">2024/12/05 16:00 到期</view>
              </view>
              <!--  去使用    -->
              <view class="btn">去使用</view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.couponPage {
  padding: 24rpx;

  /* 优惠券列表区域 */
  .list {
    /* 优惠券单项 */
    .couponItem {
      padding: 24rpx;
      display: flex;
      background-color: #fff;
      border-radius: 16rpx;
      margin-bottom: 24rpx;

      /* 商家头像区域 */
      .shopAvatar {
        margin-right: 16rpx;
        height: 64rpx;
        width: 64rpx;
        border-radius: 50%;
        overflow: hidden;

        image {
          width: 100%;
          height: 100%;
        }
      }

      /* 优惠券信息区域 */
      .shopInfo {
        flex: 1;

        /* 商家名称 */
        .shopName {
          font-size: 28rpx;
          color: $color-title;
          margin-bottom: 12rpx;
        }

        /* 优惠券主体信息 */
        .couponInfo {
          display: flex;
          align-items: stretch;
          background-color: #ffeef3;
          border-radius: 8rpx;
          overflow: hidden;

          /* 左侧价格区域 */
          .left {
            width: 128rpx;
            padding: 24rpx 0;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;

            /* 价格展示 */
            view {
              color: #ff4785;
              font-weight: 500;
              display: flex;
              align-items: flex-end;

              /* 人民币符号 */
              .symbol {
                font-size: 24rpx; // 12px 人民币符号大小
              }

              /* 价格数字 */
              .num {
                font-size: 32rpx; // 16px 价格数字大小
              }
            }

            &::after {
              content: '';
              position: absolute;
              right: 0;
              top: 15%;
              height: 70%;
              border-right: 1px dashed #c3b2b7;
            }
          }

          /* 右侧内容区域 */
          .right {
            flex: 1;
            padding: 16rpx 24rpx;
            display: flex;
            align-items: center;
            justify-content: space-between;

            /* 标题和时间信息 */
            .info {
              flex: 1;

              /* 优惠券标题 */
              .title {
                font-size: 28rpx;
                color: $color-title;
                margin-bottom: 8rpx;
              }

              /* 过期时间 */
              .time {
                font-size: 24rpx;
                color: $brand-color-primary;
              }
            }

            /* 使用按钮 */
            .btn {
              width: 112rpx;
              height: 48rpx;
              line-height: 48rpx;
              text-align: center;
              background: linear-gradient(to right, #f6759b, #e65478);
              color: #fff;
              font-size: 24rpx;
              border-radius: 8rpx;
            }
          }
        }
      }
    }
  }
}
</style>
