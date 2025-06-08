<script setup lang="ts">
import Search from '@/components/Search.vue'
import GroupBuy from '@/components/GroupBuy.vue'
import { useGroupBuyList } from '@/composables/home.ts'
import { ref } from 'vue'
import { useSearchStore } from '@/stores/modules/search.ts'

const searchStore = useSearchStore()
// 搜索值
const searchVal = ref('')
// 搜索标记
const isSearch = ref(false)
// 历史搜索列表
const historyList = ref<string[]>(searchStore.historyList || [])
// 猜你想搜列表
const guessSearchList = ref(['美食', '小龙虾', '热干面', '火锅', '凉面'])

// 处理搜索结果
const handleSearch = () => {
  // 搜索值为空不处理
  if (!searchVal.value.trim()) return

  console.log('handleSearch', searchVal.value)

  // 添加历史搜索
  const searchText = searchVal.value.trim()

  // 1. 如果已存在相同搜索词，先删除旧的
  const existingIndex = historyList.value.indexOf(searchText)
  if (existingIndex !== -1) {
    historyList.value.splice(existingIndex, 1)
  }

  // 2. 将新搜索词添加到开头
  historyList.value.unshift(searchText)

  // 3. 如果超过6个，删除最后一个
  if (historyList.value.length > 6) {
    historyList.value.pop()
  }

  // 存入store
  searchStore.setHistoryList(historyList.value)

  // 4.标记为搜索
  isSearch.value = true
}

// 清空历史搜索
const clearHistory = () => {
  historyList.value = []
  searchStore.clearHistoryList()
}

// 清空搜索框
const clearSearchVal = () => {
  searchVal.value = ''
  isSearch.value = false
}

// 搜索框值发生改变
const handleChangeIpt = (event: { detail: { value: string } }) => {
  isSearch.value = false
}

// 点击搜索标签
const handleSearchTag = (tag: string) => {
  searchVal.value = tag
  handleSearch()
}

// 团购列表组合式函数调用
const { groupBuyRef, onScrolltolower } = useGroupBuyList()
</script>

<template>
  <view class="searchPage">
    <scroll-view class="scrollView" :scroll-y="true" @scrolltolower="onScrolltolower">
      <!--  搜索组件  -->
      <Search>
        <input
          @input="handleChangeIpt"
          v-model="searchVal"
          class="searchVal"
          type="text"
          placeholder="搜索..."
        />
        <template #clear v-if="searchVal">
          <text
            style="font-size: 18px; color: #adadad"
            class="iconfont icon-shanchu"
            @tap="clearSearchVal"
          ></text>
        </template>
        <template #btn>
          <button type="default" class="searchBtn" @tap="handleSearch">搜索</button>
        </template>
      </Search>

      <!--  历史搜索  -->
      <view class="searchSection" v-if="!searchVal">
        <view class="sectionHeader">
          <text class="title">历史搜索</text>
          <text class="iconfont icon-shanchu" @tap="clearHistory"></text>
        </view>
        <view class="tagList" v-if="historyList.length > 0">
          <text
            class="tag"
            v-for="(item, index) in historyList"
            :key="index"
            @tap="handleSearchTag(item)"
            >{{ item }}</text
          >
        </view>
        <view v-else class="empty">暂无历史记录</view>
      </view>

      <!--  猜你想搜  -->
      <view class="searchSection" v-if="!searchVal">
        <view class="sectionHeader">
          <text class="title">猜你想搜</text>
        </view>
        <view class="tagList">
          <text
            class="tag"
            v-for="(item, index) in guessSearchList"
            :key="index"
            @tap="handleSearchTag(item)"
            >{{ item }}</text
          >
        </view>
      </view>
      <!--  搜索结果  -->
      <GroupBuy
        v-if="isSearch"
        ref="groupBuyRef"
        :isSearch="isSearch"
        :search-val="searchVal"
      ></GroupBuy>
    </scroll-view>
  </view>
</template>

<style scoped lang="scss">
page {
  padding-bottom: 60rpx;
  height: 100%;
  overflow: hidden;
}

.searchPage {
  height: 100%;
  .scrollView {
    flex: 1;
    overflow: hidden;
    box-sizing: border-box;
    /*搜索框*/
    .searchVal {
      flex: 1;
      font-size: 28rpx;
      color: $color-title;
    }

    /*搜索框占位样式*/
    .input-placeholder {
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

    /* 搜索区块 */
    .searchSection {
      padding: 32rpx 24rpx;

      /* 区块头部 */
      .sectionHeader {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24rpx;

        .title {
          font-size: 28rpx;
          font-weight: 500;
          color: $color-title;
        }

        .icon-shanchu {
          font-size: 36rpx;
          color: $color-text-secondary;
        }
      }

      /* 标签列表 */
      .tagList {
        display: flex;
        flex-wrap: wrap;
        gap: 24rpx;

        .tag {
          padding: 12rpx 32rpx;
          font-size: 24rpx;
          color: $color-text;
          background-color: #ffffff;
          border-radius: 32rpx;
        }
      }

      /*无历史搜索数据*/
      .empty {
        font-size: 24rpx;
        color: $color-text-secondary;
      }
    }
  }
}
</style>
