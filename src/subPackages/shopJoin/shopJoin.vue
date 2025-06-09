<script setup lang="ts">
import { ref } from 'vue'

//表单
const form = ref({
  shop_name: '',
  shop_address: '',
  shop_phone: '',
  shop_industry: '',
  shop_logo: '/static/images/icCard.png',
})

//重置表单
const formReset = () => {
  console.log('重置表单')
}

// 上传成功后是否显示遮罩
const isMask = ref(false)
// 上传logo
const handleLogo = () => {
  if (isMask.value) return
  uni.chooseFile({
    success: (data: any) => {
      uni.uploadFile({
        url: 'https://oewi5zsed2.gzg.sealos.run/upload-images',
        filePath: data.tempFilePaths[0],
        name: data.tempFiles[0].name,
        success: (result) => {
          // 如果上传成功
          if (result.statusCode === 200) {
            // 1.回显
            form.value.shop_logo = result.data
            // TODO 2.改变样式，不可选择，可删除
            isMask.value = true
          }
        },
      })
    },
  })
}

// 提交
const formSubmit = () => {
  console.log('提交前的数据', form.value)
}
</script>

<template>
  <view class="shopJoin">
    <form class="form" @submit="formSubmit" @reset="formReset">
      <!-- 基本信息 -->
      <view class="baseInfo">
        <!-- 店名 -->
        <view class="shopItem">
          <view class="label">店名</view>
          <uni-easyinput
            primaryColor="#fb5383"
            :inputBorder="false"
            class="uni-input"
            name="shopName"
            placeholder="请填入店铺名称"
          />
        </view>
        <!-- 地址 -->
        <view class="shopItem">
          <view class="label">地址</view>
          <uni-easyinput
            primaryColor="#fb5383"
            :inputBorder="false"
            class="uni-input"
            placeholder="请填入店铺地址"
          />
        </view>
        <!-- 联系电话 -->
        <view class="shopItem">
          <view class="label">电话</view>
          <uni-easyinput
            primaryColor="#fb5383"
            :inputBorder="false"
            class="uni-input"
            placeholder="请填入联系电话"
          />
        </view>
        <!-- 行业 -->
        <view class="shopItem">
          <view class="label">行业</view>
          <uni-easyinput
            primaryColor="#fb5383"
            :inputBorder="false"
            class="uni-input"
            placeholder="如：餐饮、美妆"
          />
        </view>
      </view>
      <!-- 上传资料 -->
      <view class="uploadInfo">
        <!-- logo -->
        <view class="uploadItem">
          <view class="title">请上传logo</view>
          <view class="info">
            <view class="left">
              <view class="name">logo</view>
              <view class="dec">上传您店铺的logo</view>
            </view>
            <view class="right" @tap="handleLogo">
              <image :src="form.shop_logo" mode="widthFix"></image>
            </view>
          </view>
        </view>
        <!-- 身份证 -->
        <view class="uploadItem">
          <view class="title">请上传身份证的正反面</view>
          <!--  上传类型   -->
          <view class="info">
            <view class="left">
              <view class="name">头像面</view>
              <view class="dec">上传您的身份证头像面</view>
            </view>
            <view class="right">
              <image src="/static/images/icCard.png" mode="widthFix"></image>
            </view>
          </view>
          <view class="info">
            <view class="left">
              <view class="name">国徽面</view>
              <view class="dec">上传您的身份证国徽面</view>
            </view>
            <view class="right">
              <image src="/static/images/icCard2.png" mode="widthFix"></image>
            </view>
          </view>
        </view>
      </view>
      <!--  占位  -->
      <view style="height: 80px"></view>
      <!-- 提交 -->
      <view class="submit">
        <button class="submitBtn" type="default" form-type="submit">提交</button>
      </view>
    </form>
  </view>
</template>

<style scoped lang="scss">
.shopJoin {
  padding: 16rpx;
  /*表单区域*/
  .form {
    /*基本信息*/
    .baseInfo {
      padding: 8rpx 0;
      background: #fff;
      border-radius: 16rpx;

      .shopItem {
        display: flex;
        align-items: center;
        padding: 20rpx;
        font-size: 28rpx;
        color: $color-title;

        .label {
          margin-right: 20rpx;
        }

        .uni-input {
          flex: 1;
          text-align: right;
        }

        .uni-input-placeholder {
          color: $color-text-secondary;
          font-size: 28rpx;
        }
      }
    }
    /*上传资料*/
    .uploadInfo {
      margin-top: 16rpx;

      /*上传体每一项*/
      .uploadItem {
        margin-bottom: 16rpx;
        padding: 24rpx 24rpx 8rpx 24rpx;
        background-color: #ffffff;
        border-radius: 16rpx;

        /*title*/
        .title {
          margin-bottom: 24rpx;
          font-size: 32rpx;
          font-weight: 600;
          color: $color-title;
        }

        /*上传区*/
        .info {
          display: flex;
          padding: 32rpx;
          margin-bottom: 16rpx;
          background-color: #f1f2f3;
          border-radius: 8rpx;

          /*文本说明*/
          .left {
            flex: 1;
            .name {
              margin-bottom: 8rpx;
              font-size: 28rpx;
              font-weight: 600;
              line-height: 44rpx;
              color: $color-title;
            }
            .dec {
              font-size: 24rpx;
              color: $color-text-secondary;
            }
          }

          /*上传图示*/
          .right {
            width: 350rpx;

            image {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }
    /*提交按钮*/
    .submit {
      padding: 20rpx;
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 160rpx;
      border-top: 1px solid $color-divider;
      background: #fff;

      .submitBtn {
        border-radius: 48rpx;
        background: linear-gradient(to right, #f6759b, #e65478);
        color: #fff;
        font-size: 32rpx;
        font-weight: 600;
      }
    }
  }
}
</style>
