<script setup lang="ts">
const props = defineProps({
  title: String,
  subTitle: String,
  dec: String,
  showMask: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(['uploadPic'])

// 上传logo
const handleLogo = () => {
  if (props.showMask) return
  uni.chooseFile({
    success: (data: any) => {
      uni.uploadFile({
        url: 'https://oewi5zsed2.gzg.sealos.run/upload-images',
        filePath: data.tempFilePaths[0],
        name: data.tempFiles[0].name,
        success: (result) => {
          // 如果上传成功
          if (result.statusCode === 200) {
            console.log('告诉父组件上传成功', result)
            emits('uploadPic', result.data, props.subTitle)
          }
        },
      })
    },
  })
}
</script>

<template>
  <view class="uploadItem">
    <view class="info">
      <view class="left">
        <view class="name">{{ props.subTitle }}</view>
        <view class="dec">{{ props.dec }}</view>
      </view>
      <view class="right" @tap="handleLogo">
        <slot name="images"></slot>
        <view class="mask" v-if="showMask"></view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
/*上传体每一项*/
.uploadItem {
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
      position: relative;
      width: 350rpx;
      height: 260rpx;
      border-radius: 8rpx;
      overflow: hidden;

      .mask {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        border-radius: 8rpx;
      }
    }
  }
}
</style>
