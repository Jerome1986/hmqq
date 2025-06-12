<script setup lang="ts">
import { ref } from 'vue'
import { useMemberStore } from '@/stores'
import type { UserInfoItem } from '@/types/userInfo'

const menberStore = useMemberStore()

/**
 * 构建测试登录默认信息
 * 正式登录时，从服务器获取
 */
const userInfo = ref<UserInfoItem>({
  _id: '68428adbf35ac2cbc7b7c836',
  user_avatar: 'https://objectstorageapi.gzg.sealos.run/dxepxlzz-hmqq-ai/images/avatar.jpg',
  nickname: 'jerome',
  role: ['admin'],
  isLogin: false,
  gender: '',
  birthday: '',
  isShopJoin: menberStore.profile.isShopJoin || false,
})

// 点击登录
const login = () => {
  console.log('登录')
  userInfo.value.isLogin = true
  menberStore.setProfile(userInfo.value)
}

// 退出登录
const handleLogout = () => {
  userInfo.value.isLogin = false
  menberStore.clearProfile()
  console.log(menberStore.profile)
}

// 处理我的页面所有事件
const handleManageAffairs = (val: string) => {
  // 检测登录
  if (!menberStore.profile?.isLogin) {
    uni.showToast({
      icon: 'none',
      title: '需要登录',
    })
    return
  }

  // 处理事件
  switch (val) {
    case '编辑资料':
      uni.navigateTo({
        url: '/subPackages/setUserInfo/setUserInfo',
      })
      break
    case '订单信息':
      console.log('订单信息')
      break
    case '收藏团购':
      uni.navigateTo({
        url: '/subPackages/collect/collect',
      })
      break
    case '券卡信息':
      console.log('券卡信息')
      break
    case '客服信息':
      console.log('客服信息')
      break
    case '后台管理':
      console.log('后台管理')
      break
  }
}

// 处理商家入驻
const handleShopJoin = () => {
  // 检测用户是否登录
  if (!menberStore.profile?.isLogin) {
    uni.showToast({
      icon: 'none',
      title: '请先登录',
    })
    return
  }

  // 检测用户是否重复申请
  if (menberStore.profile?.isShopJoin) {
    uni.showToast({
      icon: 'none',
      title: '请耐心等待审核结果',
    })
    return
  }

  uni.navigateTo({
    url: '/subPackages/shopJoin/shopJoin',
  })
}
</script>

<template>
  <view class="my">
    <!-- 用户信息区域 -->
    <view class="user-info">
      <view class="avatar">
        <image :src="menberStore.profile?.user_avatar" mode="aspectFill"></image>
      </view>
      <text class="nickname" v-if="menberStore.profile?.isLogin">{{
        menberStore.profile.nickname
      }}</text>
      <text class="nickname" v-else @tap="login">点击登录</text>
      <view class="edit-btn" size="mini" @tap="handleManageAffairs('编辑资料')">编辑个人资料</view>
    </view>

    <!-- 商家入驻和达人申请 -->
    <view class="apply-section">
      <view class="apply-item business" @tap="handleShopJoin">
        <image src="/static/images/shopJoin.png" mode="widthFix"></image>
        <text>商家入驻</text>
      </view>
      <view class="apply-item talent">
        <image src="/static/images/drJoin.png" mode="aspectFill"></image>
        <text>达人入驻</text>
      </view>
    </view>

    <!-- 订单信息 -->
    <view class="order-section">
      <view class="order-item" @tap="handleManageAffairs('订单信息')">
        <text class="iconfont icon-dingdanxinxi"></text>
        <text>订单信息</text>
      </view>
      <view class="order-item" @tap="handleManageAffairs('收藏团购')">
        <text class="iconfont icon-shoucangtuangou"></text>
        <text>收藏团购</text>
      </view>
      <view class="order-item" @tap="handleManageAffairs('券卡信息')">
        <text class="iconfont icon-quankaxinxi"></text>
        <text>券卡信息</text>
      </view>
      <view class="order-item" @tap="handleManageAffairs('客服信息')">
        <text class="iconfont icon-kefuxinxi"></text>
        <text>客服信息</text>
      </view>
    </view>

    <!-- 钱包区域 -->
    <view class="wallet-section">
      <view class="title">钱包</view>
      <view class="wallet-content">
        <view class="left">
          <view class="amount">
            <text class="symbol">¥</text>
            <text class="number">0.00</text>
          </view>
          <text class="desc">佣金</text>
        </view>
        <view class="withdraw-btn">申请</view>
      </view>
    </view>

    <!-- 退出和管理按钮 -->
    <view class="action-buttons">
      <view class="logout-btn" @tap="handleLogout" v-if="menberStore.profile?.isLogin"
        >退出登录</view
      >
      <view
        v-if="menberStore.profile?.role[0] === 'admin'"
        class="admin-btn"
        @tap="handleManageAffairs('后台管理')"
        >后台管理</view
      >
    </view>
  </view>
</template>

<style lang="scss">
/* 声明自定义字体 */
@font-face {
  font-family: 'customIcon';
  src: url('@/static/iconfont/customIcon.ttf') format('truetype');
}

page {
  background-color: #f5f5f5;
}

.my {
  padding: 0 16rpx;

  // 用户信息区域
  .user-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 60rpx 0;
    margin-bottom: 24rpx;
    border-radius: 24rpx;

    .avatar {
      width: 240rpx;
      height: 240rpx;
      border-radius: 50%;
      overflow: hidden;

      image {
        width: 100%;
        height: 100%;
      }
    }

    .nickname {
      margin: 32rpx 0;
      font-size: 32rpx;
      font-weight: 600;
      color: $color-title;
    }

    .edit-btn {
      padding: 20rpx 24rpx;
      font-size: 28rpx;
      color: $color-title;
      background-color: #edf1f3;
      border-radius: 16rpx;
      line-height: 44rpx;
    }
  }

  // 商家入驻和达人申请区域
  .apply-section {
    display: flex;
    justify-content: space-between;

    .apply-item {
      position: relative;
      width: 351rpx;
      height: 128rpx;
      background-color: #fff;
      border-radius: 16rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;

      &:last-child {
        margin-right: 0;
      }

      image {
        width: 100%;
        height: 100%;
      }

      text {
        position: absolute;
        left: 32rpx;
        top: 48rpx;
        font-size: 32rpx;
        font-weight: 700;
        line-height: 32rpx;
        font-family: 'customIcon';
        color: #ffffff;
      }
    }
  }

  // 订单信息区域
  .order-section {
    margin: 16rpx 0;
    padding: 32rpx;
    display: flex;
    justify-content: space-between;
    background-color: #fff;
    border-radius: 16rpx;

    .order-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12rpx;
      width: 96rpx;

      .iconfont {
        font-size: 48rpx;
        color: $brand-color-primary;
      }

      text {
        font-size: 24rpx;
        font-weight: 400;
        color: $color-title;
        line-height: 32rpx;
      }
    }
  }

  // 钱包区域
  .wallet-section {
    padding: 32rpx;
    background-color: #fff;
    border-radius: 16rpx;

    .title {
      font-size: 28rpx;
      font-weight: 500;
      color: $color-title;
      margin-bottom: 24rpx;
    }

    .wallet-content {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .left {
        .amount {
          display: flex;
          align-items: baseline;

          .symbol {
            font-size: 36rpx;
            font-weight: 600;
            color: $color-title;
            margin-right: 4rpx;
          }

          .number {
            font-size: 36rpx;
            font-weight: 600;
            color: $color-title;
          }
        }

        .desc {
          font-size: 24rpx;
          color: $color-text-secondary;
        }
      }

      .withdraw-btn {
        padding: 20rpx 24rpx;
        background-color: $brand-color-primary;
        color: #fff;
        font-size: 28rpx;
        border-radius: 16rpx;
      }
    }
  }

  /*退出和管理按钮*/
  .action-buttons {
    margin-top: 24rpx;
    display: flex;
    flex-direction: column;
    gap: 16rpx;
    padding-bottom: 120rpx;

    .logout-btn,
    .admin-btn {
      padding: 32rpx;
      border-radius: 16rpx;
      text-align: center;
      font-size: 28rpx;
    }

    .logout-btn {
      color: $brand-color-primary;
      border: 2rpx solid $brand-color-primary;
    }

    .admin-btn {
      color: $color-title;
      background-color: #fff;
    }
  }
}
</style>
