<script setup lang="ts">
import { ref } from 'vue'

//默认数量
const count = ref(1)
const emit = defineEmits(['updateNum'])
//减少
const handleMinus = () => {
  if (count.value > 1) {
    count.value--
    emit('updateNum', count.value)
  }
}

// 处理增加
const handleAdd = () => {
  if (count.value <= 99) {
    count.value++
    emit('updateNum', count.value)
  }
}
</script>

<template>
  <view class="Stepper">
    <view class="minus general" @tap="handleMinus">-</view>
    <view class="center">{{ count }}</view>
    <view class="add general" @tap="handleAdd">+</view>
  </view>
</template>

<style scoped lang="scss">
/*步进器*/
.Stepper {
  display: flex;
  font-size: 28rpx;
  .minus {
    background-color: #f9f9f9;
  }
  .center {
    text-align: center;
    width: 56rpx;
    height: 40rpx;
    line-height: 36rpx;
    font-size: 24rpx;
    color: $color-title;
  }
  .add {
    background-color: #f4f4f4;
  }
  .general {
    text-align: center;
    width: 40rpx;
    height: 40rpx;
    line-height: 36rpx;
    color: $color-text;
    border-radius: 8rpx;
  }
}
</style>
