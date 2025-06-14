<script setup lang="ts">
import Ai from '@/components/Ai.vue'
import GroupBuy from '@/components/GroupBuy.vue'
import { useGroupBuyList } from '@/composables/home.ts'
import { ref } from 'vue'
import { aiCateGetApi } from '@/api/home.ts'
import type { AiCategoryItem } from '@/types/home'

// 团购列表组合式函数调用
const { groupBuyRef, onScrolltolower } = useGroupBuyList()

// ai智能体分类列表
const aiCateList = ref<AiCategoryItem[]>([])
const isLoading = ref(false)

const aiCateGet = async () => {
  isLoading.value = true
  try {
    const res = await aiCateGetApi()
    aiCateList.value = res.data
  } catch (error) {
    console.error('获取AI分类数据失败:', error)
    uni.showToast({ icon: 'error', title: '获取数据失败' })
  } finally {
    isLoading.value = false
  }
}

// 页面加载时获取数据
aiCateGet()
</script>

<template>
  <view class="home">
    <!-- 用scroll做触底加载   -->
    <scroll-view class="scrollView" :scroll-y="true" @scrolltolower="onScrolltolower">
      <!-- banner -->
      <view class="banner">
        <swiper :circular="true" :indicator-dots="true" :autoplay="true">
          <swiper-item class="bannerItem">
            <image
              src="https://objectstorageapi.gzg.sealos.run/dxepxlzz-hmqq-ai/images/banner.jpg?x-oss-process=image/resize"
              mode="aspectFill"
              :lazy-load="true"
            ></image>
          </swiper-item>
        </swiper>
      </view>
      <!-- AI智能体 -->
      <Ai :ai-cate-list="aiCateList" :is-loading="isLoading"></Ai>
      <!-- 推荐团购 -->
      <GroupBuy ref="groupBuyRef"></GroupBuy>
    </scroll-view>
  </view>
</template>

<style lang="scss" scoped>
/* 声明自定义字体 */
@font-face {
  font-family: 'customIcon';
  src: url('@/static/iconfont/customIcon.ttf') format('truetype');
}
page {
  height: 100%;
  overflow: hidden;
}
.home {
  height: 100%;
  /* 滚动区域 */
  .scrollView {
    flex: 1;
    overflow: hidden;
    box-sizing: border-box;

    /* banner区域 */
    .banner {
      width: 100%;
      height: 440rpx;

      swiper {
        box-sizing: border-box;
        .bannerItem {
          image {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
}
</style>
