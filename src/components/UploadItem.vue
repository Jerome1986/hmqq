<script setup lang="ts">
defineProps({
  title: String,
  type: {
    type: String,
    default: '',
  },
  uploadUrl: String,
})

const emits = defineEmits(['uploadImg'])
const uploadImage = (e: string) => {
  uni.chooseImage({
    success: (data: any) => {
      uni.uploadFile({
        url: 'https://oewi5zsed2.gzg.sealos.run/upload-images',
        filePath: data.tempFilePaths[0],
        name: data.tempFiles[0].name,
        success: (result) => {
          // 如果上传成功
          if (result.statusCode === 200) {
            console.log('告诉父组件上传成功', result)
            emits('uploadImg', e, result.data)
          }
        },
      })
    },
  })
}
</script>

<template>
  <view class="upload-item">
    <text class="upload-label">{{ title }}</text>
    <view class="upload-box" @tap="uploadImage(type)">
      <image v-if="uploadUrl" :src="uploadUrl" mode="aspectFit" />
      <text v-else class="iconfont icon-fabu"></text>
    </view>
  </view>
</template>

<style scoped lang="scss">
.upload-item {
  width: calc(50% - 12rpx);

  .upload-label {
    display: block;
    font-size: 28rpx;
    color: $color-text;
    margin-bottom: 16rpx;
  }

  .upload-box {
    width: 100%;
    height: 320rpx;
    background-color: #f8f8f8;
    border-radius: 12rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    image {
      width: 100%;
      height: 100%;
    }

    .iconfont {
      font-size: 48rpx;
      color: $color-text-secondary;
    }
  }
}
</style>
