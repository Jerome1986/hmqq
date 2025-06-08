<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { GroupBuyItem } from '@/types/home'
import { groupBuyListGetApi } from '@/api/home.ts'
import type { PageParams } from '@/types/global'
import { searchApi } from '@/api/search.ts'

// 用于判断是否用于搜索
const props = defineProps({
  isSearch: {
    type: Boolean,
    default: false,
  },
  searchVal: {
    type: String,
    default: '',
  },
})

// 分页参数
const pageParams: Required<PageParams> = {
  page: 1,
  pageSize: 10,
}
// 团购列表
const groupBuyList = ref<GroupBuyItem[]>([])
// 已结束标记
const finish = ref(false)
// 添加loading状态
const isLoading = ref(false)
// 获取团购列表数据
const groupListGet = async () => {
  // 退出分页判断
  if (finish.value === true) {
    return uni.showToast({ icon: 'none', title: '没有更多数据~' })
  }

  // 设置loading状态
  isLoading.value = true
  try {
    if (!props.isSearch) {
      const res = await groupBuyListGetApi(pageParams)
      console.log(res)
      // 数组追加
      groupBuyList.value.push(...res.data.list)
      // 分页条件
      if (pageParams.page < res.data.totalPages) {
        // 页码累加
        pageParams.page++
      } else {
        finish.value = true
      }
    } else {
      const res = await searchApi(props.searchVal)
      groupBuyList.value.push(...res.data)
      finish.value = true
    }
  } catch (error) {
    console.error('获取列表数据失败:', error)
    uni.showToast({ icon: 'error', title: '获取数据失败' })
  } finally {
    isLoading.value = false
  }
}

// 重置数据
const resetData = () => {
  pageParams.page = 1
  groupBuyList.value = []
  finish.value = false
  isLoading.value = false
}

// 跳转详情
const gotoDetail = (id: string, name: string) => {
  uni.navigateTo({
    url: `/pages/groupDetail/groupDetail?id=${id}`,
  })
}

// 跳转团购
const goToGroup = () => {
  uni.switchTab({
    url: '/pages/find/find',
  })
}

onMounted(() => {
  groupListGet()
})
// 暴露方法
defineExpose({
  resetData,
  getMore: groupListGet,
})
</script>

<template>
  <view class="groupBuy">
    <!-- 头部 -->
    <view class="groupHead">
      <view class="title">推荐团购</view>
      <view @tap="goToGroup">
        <text style="color: #9499a0; font-size: 14px">更多团购</text>
        <text style="color: #9499a0; font-size: 14px" class="iconfont icon-you"></text>
      </view>
    </view>
    <!-- 团购列表 -->
    <view class="groupList">
      <view
        class="groupItem"
        v-for="item in groupBuyList"
        :key="item._id"
        @tap="gotoDetail(item._id, item.packageName)"
      >
        <view class="left">
          <image :src="item.coverImage" mode="aspectFill"></image>
        </view>
        <view class="right">
          <!-- 套餐名字 -->
          <view class="proName">{{ item.packageName }}</view>
          <!-- 套餐信息 -->
          <view class="proInfo">
            <!-- 售卖信息 -->
            <view class="sellInfo">已售 {{ item.soldQuantity }}</view>
            <!-- 营业时间 -->
            <view class="openTime">{{ item.businessHours }}</view>
            <!-- 店铺地址 -->
            <view class="address">{{ item.storeArea }}</view>
          </view>
          <!-- 价格信息 -->
          <view class="priceInfo">
            <view class="price">
              <text class="symbol">¥</text>
              <text class="num">{{ item.currentPrice }}</text>
              <text class="discount">{{ item.discount.toFixed(1) }}折</text>
              <text class="original">¥{{ item.originalPrice }}</text>
            </view>
            <view class="buyBtn">抢</view>
          </view>
        </view>
      </view>
    </view>
  </view>
  <!-- 加载状态 -->
  <view class="loading" v-if="isLoading">
    <view class="loading-icon"></view>
    <text>加载中...</text>
  </view>
  <view class="loading-text" v-else>
    {{ finish ? '没有更多数据~' : '正在加载...' }}
  </view>
</template>

<style scoped lang="scss">
.groupBuy {
  padding: 0 16rpx;

  /* 团购头部 */
  .groupHead {
    display: flex;
    justify-content: space-between;
    margin: 48rpx 0 32rpx;
    .title {
      font-size: 36rpx;
      font-weight: 600;
    }
  }

  /* 团购列表 */
  .groupList {
    .groupItem {
      padding: 16rpx;
      margin-bottom: 16rpx;
      display: flex;
      border-radius: 24rpx;
      background-color: #ffffff;

      /* 左侧商品图片 */
      .left {
        margin-right: 16rpx;
        width: 240rpx;
        height: 240rpx;
        border-radius: 8rpx;
        overflow: hidden;

        image {
          width: 100%;
          height: 100%;
        }
      }

      /* 右侧商品信息 */
      .right {
        flex: 1;
        display: flex;
        flex-direction: column;

        /* 商品标题 */
        .proName {
          font-size: 28rpx;
          font-weight: 500;
          line-height: 44rpx;
          color: $color-title;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* 商品基本信息 */
        .proInfo {
          margin-top: 4rpx;
          display: flex;
          align-items: center;
          font-size: 20rpx;
          color: $color-text-secondary;

          /* 销售信息 */
          .sellInfo,
          .openTime {
            position: relative;
            margin-right: 16rpx;

            /* 分隔线 */
            &::after {
              content: '';
              position: absolute;
              right: -8rpx;
              top: 50%;
              transform: translateY(-50%);
              width: 2rpx;
              height: 20rpx;
              background-color: $color-text-secondary;
            }
          }
        }

        /* 价格区域 */
        .priceInfo {
          margin-top: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(to right, #ffffff 0%, #fef2f6 100%);
          border-radius: 0 16rpx 16rpx 0;

          /* 价格信息 */
          .price {
            flex: 1;
            display: flex;
            align-items: flex-end;
            gap: 8rpx;

            /* 人民币符号 */
            .symbol {
              font-size: 24rpx;
              color: $brand-color-primary;
              line-height: 32rpx;
            }

            /* 当前价格 */
            .num {
              font-size: 40rpx;
              font-weight: 600;
              color: $brand-color-primary;
              line-height: 1;
            }

            /* 折扣信息 */
            .discount {
              padding: 0 8rpx;
              font-size: 20rpx;
              font-weight: 500;
              color: $brand-color-primary;
              border-radius: 8rpx;
              border: 1px solid #fb53831a;
              line-height: 1;
            }

            /* 原价 */
            .original {
              font-size: 24rpx;
              color: $color-text-secondary;
              text-decoration: line-through;
              line-height: 1;
            }
          }

          /* 抢购按钮 */
          .buyBtn {
            text-align: center;
            width: 96rpx;
            height: 64rpx;
            line-height: 64rpx;
            border-radius: 16rpx;
            background: linear-gradient(90deg, #f6759b 0%, #e65478 100%);
            font-size: 36rpx;
            color: #ffffff;
            font-family: 'customIcon';
            font-weight: 900;
          }
        }
      }
    }
  }
}

// 添加loading样式
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

.loading-text {
  text-align: center;
  font-size: 28rpx;
  color: #666;
  padding: 20rpx 0;
}
</style>
