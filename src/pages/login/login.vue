<script setup lang="ts">
// Login page component

import { APPID, CODE, REDIRECT_URL, SCOPE } from '@/pages/login/wxConfig'
import { onLoad } from '@dcloudio/uni-app'

// 页面加载时获取参数
onLoad((query?: AnyObject) => {
  if (query?.groupId) {
    // 将完整的重定向路径存储到本地
    const redirectTo = `/pages/groupDetail/groupDetail?id=${query.groupId}`
    uni.setStorageSync('redirectUrl', redirectTo)
  }
})

const login = () => {
  // 保存当前页面路径到本地存储，用于登录成功后重定向
  window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${APPID}&redirect_uri=${REDIRECT_URL}&response_type=${CODE}&scope=${SCOPE}#wechat_redirect`
}
</script>

<template>
  <view class="login">
    <view class="login-container">
      <!-- Logo area -->
      <view class="logo-area">
        <image class="logo" src="/static/images/logo.png" mode="aspectFit" />
      </view>

      <!-- Welcome text -->
      <view class="welcome-text">
        <text class="title">欢迎来到HMQQ</text>
        <text class="subtitle">让购物更有趣</text>
      </view>

      <!-- Login button -->
      <view class="login-button-area">
        <button class="login-button" hover-class="button-hover" @tap="login">一键登录</button>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
.login {
  min-height: 100vh;
  background-color: #fff;
  padding: 0 40rpx;

  .login-container {
    padding-top: 200rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .logo-area {
    margin-bottom: 60rpx;

    .logo {
      width: 200rpx;
      height: 200rpx;
    }
  }

  .welcome-text {
    text-align: center;
    margin-bottom: 100rpx;

    .title {
      display: block;
      font-size: 40rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 16rpx;
    }

    .subtitle {
      display: block;
      font-size: 28rpx;
      color: #999;
    }
  }

  .login-button-area {
    width: 100%;
    padding: 0 40rpx;

    .login-button {
      width: 100%;
      height: 88rpx;
      line-height: 88rpx;
      background-color: $brand-color-primary;
      color: #fff;
      font-size: 32rpx;
      border-radius: 44rpx;
      border: none;

      &.button-hover {
        opacity: 0.9;
      }
    }
  }
}
</style>
