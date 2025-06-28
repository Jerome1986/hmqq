<script setup lang="ts">
import Ai from '@/components/Ai.vue'
import GroupBuy from '@/components/GroupBuy.vue'
import { useGroupBuyList } from '@/composables/home.ts'
import { onMounted, ref } from 'vue'
import { aiCateGetApi } from '@/api/home.ts'
import type { AiCategoryItem } from '@/types/home'
import { loginApi } from '@/api/login.ts'
import { useMemberStore } from '@/stores'

// 团购列表组合式函数调用
const { groupBuyRef, onScrolltolower } = useGroupBuyList()

// 定义用户store
const memberStore = useMemberStore()

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

// 获取 URL 中的查询参数
function getQueryParam(param: string) {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get(param)
}

// 根据页面code处理登录
const loginByWx = async () => {
  const code = getQueryParam('code')
  if (code) {
    const res = await loginApi(code)
    console.log(res)
    if (res.code === 200) {
      // 登录成功，更新用户store
      memberStore.setProfile(res.data)

      // 获取存储的重定向地址
      const redirectUrl = uni.getStorageSync('redirectUrl')

      if (redirectUrl) {
        // 清除存储的重定向地址
        uni.removeStorageSync('redirectUrl')
        // 跳转到之前的页面
        uni.redirectTo({
          url: redirectUrl,
          success: () => {
            uni.showToast({
              icon: 'success',
              title: '登录成功',
            })
          },
        })
      } else {
        uni.showToast({
          icon: 'success',
          title: '登录成功',
        })
      }
    }
  }
}

// 页面加载时获取数据
aiCateGet()

onMounted(() => {
  loginByWx()
})
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
