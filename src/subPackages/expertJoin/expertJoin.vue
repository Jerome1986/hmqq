<script setup lang="ts">
import { ref } from 'vue'
import { useMemberStore } from '@/stores'
import UploadItem from '@/components/UploadItem.vue'
import type { ExpertForm } from '@/types/expertJoin.ts'
import { expertJoinApi } from '@/api/expertInfo.ts'

// 定义store
const memberStore = useMemberStore()

// 表单初始数据
const formData = ref<ExpertForm>({
  user_id: memberStore.profile._id || '',
  name: '',
  phone: '',
  id_card_front: '',
  id_card_back: '',
  douyin_screenshot: '',
  xiaohongshu_screenshot: '',
})

// 验证表单
const verifyForm = () => {
  // 检查申请人姓名
  if (!formData.value.name.trim()) {
    uni.showToast({
      icon: 'none',
      title: '请填写姓名',
    })
    return false
  }

  // 检查联系电话
  if (!formData.value.phone.trim()) {
    uni.showToast({
      icon: 'none',
      title: '请填写联系电话',
    })
    return false
  }

  // 验证电话号码格式
  const phoneReg = /^1[3-9]\d{9}$/
  if (!phoneReg.test(formData.value.phone.trim())) {
    uni.showToast({
      icon: 'none',
      title: '请填写正确的手机号码',
    })
    return false
  }

  // 检查身份证正面
  if (!formData.value.id_card_front) {
    uni.showToast({
      icon: 'none',
      title: '请上传身份证人像面',
    })
    return false
  }

  // 检查身份证反面
  if (!formData.value.id_card_back) {
    uni.showToast({
      icon: 'none',
      title: '请上传身份证国徽面',
    })
    return false
  }

  // 检查抖音截图
  if (!formData.value.douyin_screenshot) {
    uni.showToast({
      icon: 'none',
      title: '请上传营业执照',
    })
    return false
  }

  // 检查小红书截图
  if (!formData.value.xiaohongshu_screenshot) {
    uni.showToast({
      icon: 'none',
      title: '请上传营业执照',
    })
    return false
  }

  // 所有验证通过
  return true
}

// 处理图像上传
const handleUploadImg = (e: string, url: string) => {
  switch (e) {
    case 'icCard-font':
      formData.value.id_card_front = url
      break
    case 'icCard-back':
      formData.value.id_card_back = url
      break
    case 'douyin':
      formData.value.douyin_screenshot = url
      break
    case 'xiaohongshu':
      formData.value.xiaohongshu_screenshot = url
      break
  }
}

// 提交表单
const handleSubmit = async () => {
  console.log('提交', formData.value)
  // 验证表单
  if (!verifyForm()) return

  // 提交数据
  const submitResult = await expertJoinApi(formData.value)
  if (submitResult.code === 200) {
    uni.showToast({
      icon: 'none',
      title: '提交成功',
    })

    // 同步用户store
    memberStore.setProfile({ isExpert: submitResult.data.isExpert })

    // 返回上一页
    setTimeout(() => {
      uni.navigateBack()
    }, 800)
  }
}
</script>

<template>
  <view class="expert-join">
    <view class="form">
      <!-- 基本信息 -->
      <view class="form-group">
        <view class="form-title">基本信息</view>
        <view class="form-item">
          <text class="label">姓名</text>
          <input
            class="input"
            type="text"
            v-model="formData.name"
            placeholder="请输入真实姓名"
            placeholder-class="placeholder"
          />
        </view>
        <view class="form-item">
          <text class="label">手机号</text>
          <input
            class="input"
            type="number"
            :maxlength="11"
            v-model="formData.phone"
            placeholder="请输入手机号"
            placeholder-class="placeholder"
          />
        </view>
      </view>

      <!-- 证件上传 -->
      <view class="form-group">
        <view class="form-title">证件上传</view>
        <view class="upload-group">
          <UploadItem
            title="身份证正面"
            type="icCard-font"
            :uploadUrl="formData.id_card_front"
            @uploadImg="handleUploadImg"
          ></UploadItem>
          <UploadItem
            title="身份证反面"
            type="icCard-back"
            :upload-url="formData.id_card_back"
            @uploadImg="handleUploadImg"
          ></UploadItem>
        </view>
      </view>

      <!-- 社交账号截图 -->
      <view class="form-group">
        <view class="form-title">社交账号截图</view>
        <view class="upload-group">
          <UploadItem
            title="抖音账号主页截图"
            type="douyin"
            :upload-url="formData.douyin_screenshot"
            @uploadImg="handleUploadImg"
          ></UploadItem>
          <UploadItem
            title="小红书账号主页截图"
            type="xiaohongshu"
            :upload-url="formData.xiaohongshu_screenshot"
            @uploadImg="handleUploadImg"
          ></UploadItem>
        </view>
      </view>
    </view>

    <!-- 提交按钮 -->
    <button class="submit-btn" @tap="handleSubmit">提交申请</button>
  </view>
</template>

<style scoped lang="scss">
.expert-join {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 24rpx;

  .form {
    background-color: #fff;
    border-radius: 16rpx;
    padding: 0 24rpx;
    margin-bottom: 48rpx;

    .form-group {
      padding: 32rpx 0;
      border-bottom: 1rpx solid $color-border;

      &:last-child {
        border-bottom: none;
      }

      .form-title {
        font-size: 32rpx;
        font-weight: 500;
        color: $color-title;
        margin-bottom: 32rpx;
      }

      .form-item {
        display: flex;
        align-items: center;
        margin-bottom: 24rpx;

        &:last-child {
          margin-bottom: 0;
        }

        .label {
          width: 140rpx;
          font-size: 28rpx;
          color: $color-text;
        }

        .input {
          flex: 1;
          height: 80rpx;
          background-color: #f8f8f8;
          border-radius: 12rpx;
          padding: 0 24rpx;
          font-size: 28rpx;
        }

        .placeholder {
          color: $color-text-secondary;
        }
      }

      .upload-group {
        display: flex;
        flex-wrap: wrap;
        gap: 24rpx;
      }
    }
  }

  .submit-btn {
    width: 100%;
    height: 88rpx;
    line-height: 88rpx;
    background-color: $brand-color-primary;
    color: #fff;
    font-size: 32rpx;
    border-radius: 44rpx;
    text-align: center;
  }
}
</style>
