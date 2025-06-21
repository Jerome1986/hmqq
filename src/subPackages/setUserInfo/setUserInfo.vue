<script setup lang="ts">
import { useMemberStore } from '@/stores'
import { ref } from 'vue'
import { updateUserInfoApi } from '@/api/userInfo.ts'

const memberStore = useMemberStore()

const dateTimeRefs = ref()
// 表单数据
const formData = ref({
  gender: memberStore.profile?.gender || 0,
  birthday: memberStore.profile?.birthday || '',
  mobile: memberStore.profile?.mobile || '',
})

// 处理点击事件
const handleClick = (type: string) => {
  switch (type) {
    case 'gender':
      // 选择性别
      uni.showActionSheet({
        itemList: ['男', '女'],
        success: (res) => {
          formData.value.gender = res.tapIndex === 0 ? '男' : '女'
        },
      })
      break
    case 'birthday':
      // 选择生日
      break
  }
}

// 保存信息
const handleSave = async () => {
  //TODO 提交服务器并更新store
  if (memberStore.profile?._id) {
    console.log(memberStore.profile?._id)
    const res = await updateUserInfoApi(
      memberStore.profile?._id,
      formData.value.gender,
      formData.value.mobile,
      formData.value.birthday,
    )

    // 如果更新成功，更新本地数据
    if (res.data.acknowledged) {
      memberStore.setProfile({ gender: formData.value.gender, birthday: formData.value.birthday })

      // 防抖
      setTimeout(() => {
        // 提示
        uni.showToast({
          title: '保存成功',
          icon: 'success',
        })
        uni.navigateBack()
      }, 800)
    }
  }
}
</script>

<template>
  <view class="user-info">
    <!-- 头像 -->
    <view class="info-item">
      <text class="label">头像</text>
      <view class="content">
        <image class="avatar" :src="memberStore.profile?.user_avatar" mode="aspectFill" />
      </view>
    </view>

    <!-- 昵称 -->
    <view class="info-item">
      <text class="label">昵称</text>
      <view class="content">
        <text class="value">{{ memberStore.profile?.nickname }}</text>
      </view>
    </view>

    <!-- 性别 -->
    <view class="info-item" @tap="handleClick('gender')">
      <text class="label">性别</text>
      <view class="content">
        <text class="value" :class="{ placeholder: !formData.gender }">
          {{ formData.gender || '选择您的性别' }}
        </text>
      </view>
    </view>

    <!-- 生日 -->
    <view class="info-item" @tap="handleClick('birthday')">
      <text class="label">生日</text>
      <view class="content">
        <uni-datetime-picker
          ref="dateTimeRefs"
          type="date"
          v-model="formData.birthday"
          :border="false"
          hide-second
        >
          <text class="value" :class="{ placeholder: !formData.birthday }">
            {{ formData.birthday || '填写生日完善信息' }}
          </text>
        </uni-datetime-picker>
      </view>
    </view>

    <!-- 手机 -->
    <view class="info-item" @tap="handleClick('birthday')">
      <text class="label">手机</text>
      <view class="content">
        <uni-easyinput
          v-model="formData.mobile"
          class="ipt"
          :inputBorder="false"
          trim
          placeholder="请填写手机号码"
          primaryColor=" #fb5383"
        ></uni-easyinput>
      </view>
    </view>

    <!-- 保存按钮 -->
    <view class="save-btn" @tap="handleSave">保存</view>
  </view>
</template>

<style lang="scss">
/* 日期选择器样式重写 */
:deep(.uni-picker-container) {
  .uni-picker-header {
    .uni-picker-action {
      &.uni-picker-action-confirm {
        color: $brand-color-primary !important;
      }
    }
  }
}

.user-info {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 24rpx;

  .info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 32rpx;
    background-color: #fff;
    border-radius: 16rpx;
    margin-bottom: 16rpx;

    .label {
      font-size: 28rpx;
      color: $color-title;
      font-weight: 500;
    }

    .content {
      display: flex;
      align-items: center;
      gap: 8rpx;

      .avatar {
        width: 96rpx;
        height: 96rpx;
        border-radius: 50%;
      }

      /*输入框*/
      .ipt {
        text-align: end;
      }

      .value {
        font-size: 28rpx;
        color: $color-title;
        margin-right: 8rpx;

        &.placeholder {
          color: $color-text-secondary;
        }
      }
      /*日期编辑器*/
      :deep(.uni-date) {
        width: auto;
        .uni-date-editor {
          width: auto;
          border: none;
          padding: 0;
          line-height: normal;
          .uni-date-editor--x {
            display: none;
          }
        }
      }
    }
  }

  /*保存按钮*/
  .save-btn {
    position: fixed;
    left: 16rpx;
    right: 16rpx;
    bottom: 40rpx;
    height: 96rpx;
    line-height: 96rpx;
    text-align: center;
    background-color: $brand-color-primary;
    color: #fff;
    font-size: 32rpx;
    font-weight: 500;
    border-radius: 16rpx;
    padding-bottom: env(safe-area-inset-bottom); /* iOS 11.2+ */
  }
}
</style>
