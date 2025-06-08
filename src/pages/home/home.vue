<script setup lang="ts">
import Ai from '@/components/Ai.vue'
import GroupBuy from '@/components/GroupBuy.vue'
import { useGroupBuyList } from '@/composables/home.ts'

// 团购列表组合式函数调用
const { groupBuyRef, onScrolltolower } = useGroupBuyList()
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
              src="https://objectstorageapi.gzg.sealos.run/dxepxlzz-hmqq-ai/images/banner.jpg"
              mode="aspectFill"
            ></image>
          </swiper-item>
        </swiper>
      </view>
      <!-- AI智能体 -->
      <Ai></Ai>
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
