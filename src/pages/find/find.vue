<script setup lang="ts">
import CustomCateHeader from '@/components/CustomCateHeader.vue'
import FindList from '@/components/FindList.vue'
import Search from '@/components/Search.vue'
import { ref, onMounted, nextTick } from 'vue'
import type { CustomCateHeaderInstance, FindListInstance } from '@/types/component'

// 获取发现组件
const findRef = ref<FindListInstance>()
// 获取分类头部组件
const cateHeaderRef = ref<CustomCateHeaderInstance>()
// 添加loading状态
const isLoading = ref(false)

// 初始化数据
const initData = async () => {
  try {
    // 设置loading状态
    isLoading.value = true
    // 确保组件都已经挂载
    await nextTick()
    // 获取分类数据，分类变化会通过changeCate事件触发列表加载
    await cateHeaderRef.value?.cateListGet()
  } catch (error) {
    console.error('初始化数据失败:', error)
    uni.showToast({
      icon: 'error',
      title: '数据加载失败',
    })
  }
}

// 处理分类切换
const handleCateChange = async () => {
  try {
    // 重置并获取新数据
    findRef.value?.resetData()
    await findRef.value?.getListData()
  } catch (error) {
    console.error('切换分类失败:', error)
    uni.showToast({
      icon: 'error',
      title: '切换分类失败',
    })
  } finally {
    // 所有数据加载完成后关闭loading
    isLoading.value = false
  }
}

// 跳转搜索页
const goToSearch = () => {
  uni.navigateTo({
    url: '/pages/searchDetail/searchDetail',
  })
}

onMounted(() => {
  // 只在这里进行一次初始化
  initData()
})
</script>

<template>
  <view class="findPage">
    <!--  搜索组件  -->
    <Search @tap="goToSearch">
      <text class="searchTxt">搜索...</text>
      <template #btn>
        <button type="default" class="searchBtn">搜索</button>
      </template>
    </Search>
    <!-- 自定义带分类头部 -->
    <CustomCateHeader ref="cateHeaderRef" @changeCate="handleCateChange"></CustomCateHeader>
    <!--  列表区域   -->
    <FindList ref="findRef"></FindList>

    <!-- loading遮罩层 -->
    <view class="loading-overlay" v-show="isLoading">
      <view class="loading">
        <view class="loading-icon"></view>
        <text>加载中...</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
}
.findPage {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative; // 添加相对定位

  /*搜索文本*/
  .searchTxt {
    font-size: 28rpx;
    color: $color-text-secondary;
  }

  /*搜索按钮*/
  .searchBtn {
    padding: 6rpx 24rpx;
    height: 56rpx;
    line-height: 44rpx;
    font-size: 28rpx;
    font-weight: 500;
    border-radius: 32rpx;
    background-color: $brand-color-primary;
    color: #fff;
  }

  // 添加loading遮罩层样式
  .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.9);
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    pointer-events: none;

    &:not([style*='display: none']) {
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
    }
  }

  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20rpx 0;

    .loading-icon {
      width: 40rpx;
      height: 40rpx;
      margin-right: 12rpx;
      border: 4rpx solid #f3f3f3;
      border-top: 4rpx solid $brand-color-primary;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    text {
      font-size: 28rpx;
      color: $color-text-secondary;
    }
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
</style>
