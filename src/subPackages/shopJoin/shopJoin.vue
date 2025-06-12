<script setup lang="ts">
import { ref } from 'vue'
import UploadInfo from '@/components/UploadInfo.vue'
import { shopInfoAddApi } from '@/api/shopInfo.ts'
import type { ShopInfo } from '@/types/ShopInfo.ts'
import { useMemberStore } from '@/stores'

// 定义store
const memberStore = useMemberStore()

//表单
const form = ref<ShopInfo>({
  user_id: memberStore.profile._id,
  shop_name: '',
  shop_address: '',
  shop_phone: '',
  shop_industry: '',
  shop_logo_picture: '',
  id_card_front: '', // 身份证正面
  id_card_back: '', // 身份证反面
  business_licenses: '', // 营业执照
  other_certificates: '', // 其他证件
  state: 0,
})

// 遮罩状态对象
const maskStatus = ref({
  logo: false,
  id_front: false,
  id_back: false,
  business: false,
  other: false,
})

//重置表单
const formReset = () => {
  console.log('重置表单')
}

// 处理照片提交
const handleUpload = (file: string, subTitle: string) => {
  switch (subTitle) {
    case 'logo':
      form.value.shop_logo_picture = file
      maskStatus.value.logo = true
      break
    case '头像面':
      form.value.id_card_front = file
      maskStatus.value.id_front = true
      break
    case '国徽面':
      form.value.id_card_back = file
      maskStatus.value.id_back = true
      break
    case '营业执照':
      form.value.business_licenses = file
      maskStatus.value.business = true
      break
    case '其他证件':
      form.value.other_certificates = file
      maskStatus.value.other = true
      break
    default:
      console.warn('未知的上传类型:', subTitle)
  }
  console.log('上传成功:', subTitle, file)
}

// 验证表单
const verifyForm = () => {
  // 检查店铺名称
  if (!form.value.shop_name.trim()) {
    uni.showToast({
      icon: 'none',
      title: '请填写店铺名称',
    })
    return false
  }

  // 检查店铺地址
  if (!form.value.shop_address.trim()) {
    uni.showToast({
      icon: 'none',
      title: '请填写店铺地址',
    })
    return false
  }

  // 检查联系电话
  if (!form.value.shop_phone.trim()) {
    uni.showToast({
      icon: 'none',
      title: '请填写联系电话',
    })
    return false
  }
  // 验证电话号码格式
  const phoneReg = /^1[3-9]\d{9}$/
  if (!phoneReg.test(form.value.shop_phone.trim())) {
    uni.showToast({
      icon: 'none',
      title: '请填写正确的手机号码',
    })
    return false
  }

  // 检查行业
  if (!form.value.shop_industry.trim()) {
    uni.showToast({
      icon: 'none',
      title: '请填写所属行业',
    })
    return false
  }

  // 检查店铺logo
  if (!form.value.shop_logo_picture) {
    uni.showToast({
      icon: 'none',
      title: '请上传店铺logo',
    })
    return false
  }

  // 检查身份证正面
  if (!form.value.id_card_front) {
    uni.showToast({
      icon: 'none',
      title: '请上传身份证人像面',
    })
    return false
  }

  // 检查身份证反面
  if (!form.value.id_card_back) {
    uni.showToast({
      icon: 'none',
      title: '请上传身份证国徽面',
    })
    return false
  }

  // 检查营业执照
  if (!form.value.business_licenses) {
    uni.showToast({
      icon: 'none',
      title: '请上传营业执照',
    })
    return false
  }

  // 所有验证通过
  return true
}

// 是否申请过
const isShopJoin = ref(false)

// 提交
const formSubmit = async () => {
  // 验证表单
  if (!verifyForm()) return

  console.log('提交前的数据', form.value)
  // ... 提交逻辑
  try {
    const res = await shopInfoAddApi(form.value)
    console.log('提交成功', res)
    if (res.code === 200) {
      uni.showToast({
        icon: 'success',
        title: res.message,
      })

      // 如果成功提交给用户做标记，避免重复提交
      memberStore.setProfile({ isShopJoin: res.data.isShopJoin })
      // 提交成功，返回上一页
      setTimeout(() => {
        uni.navigateBack()
      }, 1000)
    }
  } catch (error) {
    console.log(error)
  }
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
            trim="all"
            v-model="form.shop_name"
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
            trim="all"
            v-model="form.shop_address"
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
            trim="all"
            v-model="form.shop_phone"
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
            trim="all"
            v-model="form.shop_industry"
          />
        </view>
      </view>
      <!-- 上传资料 -->
      <view class="uploadInfo">
        <!-- logo -->
        <view class="list">
          <view class="title">请上传log</view>
          <UploadInfo
            @uploadPic="handleUpload"
            sub-title="logo"
            dec="上传您店铺的logo"
            :showMask="maskStatus.logo"
          >
            <template v-slot:images>
              <image
                v-if="!maskStatus.logo"
                src="/static/images/uploadLogo.png"
                mode="widthFix"
              ></image>
              <image v-else :src="form.shop_logo_picture" mode="aspectFit"></image>
            </template>
          </UploadInfo>
        </view>
        <!-- 身份证 -->
        <view class="list">
          <view class="title">请上传身份证的正反面</view>
          <!--  上传类型   -->
          <UploadInfo
            @uploadPic="handleUpload"
            sub-title="头像面"
            dec="上传您的身份证头像面"
            :showMask="maskStatus.id_front"
          >
            <template v-slot:images>
              <image
                v-if="!maskStatus.id_front"
                src="/static/images/icCard.png"
                mode="widthFix"
              ></image>
              <image v-else :src="form.id_card_front" mode="aspectFit"></image>
            </template>
          </UploadInfo>
          <UploadInfo
            @uploadPic="handleUpload"
            sub-title="国徽面"
            dec="上传您的身份证国徽面"
            :showMask="maskStatus.id_back"
          >
            <template v-slot:images>
              <image
                v-if="!maskStatus.id_back"
                src="/static/images/icCard2.png"
                mode="widthFix"
              ></image>
              <image v-else :src="form.id_card_back" mode="aspectFit"></image>
            </template>
          </UploadInfo>
        </view>
        <!-- 其他证件 -->
        <view class="list">
          <view class="title">请完善您的其他证件信息</view>
          <UploadInfo
            @uploadPic="handleUpload"
            sub-title="营业执照"
            dec="上传您的营业执照原件"
            :showMask="maskStatus.business"
          >
            <template v-slot:images>
              <image
                v-if="!maskStatus.business"
                src="/static/images/business.png"
                mode="widthFix"
              ></image>
              <image v-else :src="form.business_licenses" mode="aspectFit"></image>
            </template>
          </UploadInfo>
          <UploadInfo
            @uploadPic="handleUpload"
            sub-title="其他证件"
            dec="如餐饮许可证等"
            :showMask="maskStatus.other"
          >
            <template v-slot:images>
              <image
                v-if="!maskStatus.other"
                src="/static/images/other.png"
                mode="widthFix"
              ></image>
              <image v-else :src="form.other_certificates" mode="aspectFit"></image>
            </template>
          </UploadInfo>
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

      .list {
        position: relative;
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
          z-index: 1;
        }

        image {
          width: 100%;
          height: 100%;
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
