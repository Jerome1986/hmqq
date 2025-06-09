<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { findListGetApi } from '@/api/find.ts'
import { useFindCateStore } from '@/stores/modules/find.ts'
import type { ArticleListItem, LoveListItem } from '@/types/find'
import type { GroupBuyItem } from '@/types/home'
import type { PageParams } from '@/types/global'
import { articleViewsApi } from '@/api/articleDetail.ts'
import { useMemberStore } from '@/stores'
import { useLoveStore } from '@/stores/modules/love'
import { userLoveListGetApi, groupDetailApi } from '@/api/groupDetail'

// 接收父组件的数据
const props = defineProps({
  isCollect: {
    type: Boolean,
    default: false,
  },
})

// 定义store
const findCateStore = useFindCateStore()
const menberStore = useMemberStore()
const loveStore = useLoveStore()
// 分页参数
const pageParams: Required<PageParams> = {
  page: 1,
  pageSize: 10,
}

// 列表 - 使用联合类型
const listData = ref<(ArticleListItem | GroupBuyItem)[]>([])
// 已结束标记
const finish = ref(false)
// 分成左右两列数据 - 优化计算方式
const columns = computed(() => {
  const left: (ArticleListItem | GroupBuyItem)[] = []
  const right: (ArticleListItem | GroupBuyItem)[] = []

  listData.value.forEach((item, index) => {
    if (index % 2 === 0) {
      left.push(item)
    } else {
      right.push(item)
    }
  })

  return { left, right }
})

// 是否为团购
const isGroup = ref(false)

// 图片加载状态记录
const loadedImages = ref(new Set<string>())

// 获取文章列表/团购列表
const listDataGet = async (cate_id: string) => {
  if (finish.value) {
    return uni.showToast({ icon: 'none', title: '没有更多数据~' })
  }

  try {
    // 如果是收藏列表，则获取收藏列表数据
    if (props.isCollect) {
      if (!menberStore.profile?._id) {
        console.log('用户未登录')
        uni.showToast({ icon: 'none', title: '请先登录' })
        return
      }

      // 获取收藏列表
      const loveListRes = await userLoveListGetApi(menberStore.profile._id)
      const groupIds = loveListRes.data.map((item: LoveListItem) => item.group_id)

      // 获取收藏的团购详情
      const groupDetailsPromises = groupIds.map((id: string) => groupDetailApi(id))
      const groupDetails = await Promise.all(groupDetailsPromises)

      // 设置数据
      isGroup.value = true
      listData.value = groupDetails.map((res: { data: GroupBuyItem }) => ({
        ...res.data,
        isLoved: true,
      }))

      finish.value = true // 收藏列表不需要分页
      return
    }

    // 正常列表获取逻辑
    const res = await findListGetApi(cate_id, pageParams)
    isGroup.value = res.data.isGroupBuy

    // 如果是团购列表且已登录，处理收藏状态
    if (isGroup.value && menberStore.profile?._id) {
      await loveStore.initLoveList()
      listData.value = [
        ...listData.value,
        ...res.data.list.map((item) => ({
          ...item,
          isLoved: loveStore.isLoved(item._id),
        })),
      ]
    } else {
      listData.value = [...listData.value, ...res.data.list]
    }

    // 分页条件
    if (res.data.totalPages && pageParams.page < res.data.totalPages) {
      pageParams.page++
    } else {
      finish.value = true
    }
  } catch (error) {
    console.error('获取列表数据失败:', error)
    throw error
  }
}

// 处理触底加载
const onScrolltolower = () => {
  listDataGet(findCateStore.currentCate)
}

// 重置数据
const resetData = () => {
  pageParams.page = 1
  listData.value = []
  finish.value = false
  loadedImages.value.clear() // 清空图片加载记录
}

// 处理团购跳转
const handleGroupGo = (id: string) => {
  uni.navigateTo({
    url: `/pages/groupDetail/groupDetail?id=${id}`,
  })
}

// 处理种草跳转
const handleDiscoveryGo = async (id: string) => {
  // 调用阅读量自增接口
  await articleViewsApi(id)

  // 更新本地数据中的阅读量
  const targetArticle = listData.value.find((item) => item._id === id) as ArticleListItem
  if (targetArticle) {
    targetArticle.lookNum++
  }

  // 跳转到详情页
  await uni.navigateTo({
    url: `/pages/discoveryDetail/discoveryDetail?article_id=${id}`,
  })
}

// 暴露方法
defineExpose({
  resetData,
  getListData: () => {
    // 如果是收藏列表，不需要 cate_id
    if (props.isCollect) {
      return listDataGet('')
    }
    // 否则使用当前分类
    return listDataGet(findCateStore.currentCate)
  },
})

const handleImageLoad = (e: any, imageUrl: string) => {
  if (!loadedImages.value.has(imageUrl)) {
    loadedImages.value.add(imageUrl)
  }
}

// 处理点击收藏
const handleLove = async (groupId: string) => {
  // 调用 store 的方法来处理收藏操作
  await loveStore.toggleLove(groupId)
}

// 监听收藏状态变化来更新UI
watch(
  () => loveStore.lastUpdated,
  (newVal) => {
    if (newVal) {
      // 更新列表数据中的收藏状态和数量
      listData.value = listData.value.map((item) => {
        if ('coverImage' in item && item._id === newVal.groupId) {
          return {
            ...item,
            isLoved: newVal.isLoved,
            love: item.love + (newVal.isLoved ? 1 : -1),
          }
        }
        return item
      })
    }
  },
  { deep: true },
)
</script>

<template>
  <!-- 种草列表 -->
  <scroll-view v-if="!isGroup" class="list" :scroll-y="true" @scrolltolower="onScrolltolower">
    <view class="waterfall">
      <!-- 左列容器 -->
      <view class="column">
        <view
          class="listItem"
          v-for="item in columns.left"
          :key="item._id"
          @tap="handleDiscoveryGo(item._id)"
        >
          <view class="cover">
            <image
              :src="(item as ArticleListItem).cover"
              mode="widthFix"
              @load="(e) => handleImageLoad(e, (item as ArticleListItem).cover)"
            ></image>
          </view>
          <view class="content">
            <view class="title">{{ (item as ArticleListItem).articleName }}</view>
            <view class="usersInfo">
              <view class="users">
                <image
                  class="userAvatar"
                  :src="(item as ArticleListItem).userAvatar"
                  mode="aspectFill"
                ></image>
                <text class="nickname">{{ (item as ArticleListItem).userNickname }}</text>
              </view>
              <view class="looks">
                <text class="iconfont icon-yanjing"></text>
                <text>{{ (item as ArticleListItem).lookNum }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 右列容器 -->
      <view class="column">
        <view
          class="listItem"
          v-for="item in columns.right"
          :key="item._id"
          @tap="handleDiscoveryGo(item._id)"
        >
          <view class="cover">
            <image
              :src="(item as ArticleListItem).cover"
              mode="widthFix"
              @load="(e) => handleImageLoad(e, (item as ArticleListItem).cover)"
            ></image>
          </view>
          <view class="content">
            <view class="title">{{ (item as ArticleListItem).articleName }}</view>
            <view class="usersInfo">
              <view class="users">
                <image
                  class="userAvatar"
                  :src="(item as ArticleListItem).userAvatar"
                  mode="aspectFill"
                ></image>
                <text class="nickname">{{ (item as ArticleListItem).userNickname }}</text>
              </view>
              <view class="looks">
                <text class="iconfont icon-yanjing"></text>
                <text>{{ (item as ArticleListItem).lookNum }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </scroll-view>

  <!-- 团购列表 -->
  <scroll-view v-else class="list" :scroll-y="true" @scrolltolower="onScrolltolower">
    <view class="waterfall">
      <!-- 左列容器 -->
      <view class="column">
        <view
          class="listItem"
          v-for="item in columns.left"
          :key="item._id"
          @tap="handleGroupGo(item._id)"
        >
          <view class="cover">
            <image
              :src="(item as GroupBuyItem).coverImage"
              mode="widthFix"
              @load="(e) => handleImageLoad(e, (item as GroupBuyItem).coverImage)"
            ></image>
          </view>
          <view class="content">
            <view class="priceInfo" v-if="isGroup">
              <text class="currentPrice"
                ><text class="symbol">¥</text>{{ (item as GroupBuyItem).currentPrice }}</text
              >
              <text class="originalPrice">¥{{ (item as GroupBuyItem).originalPrice }}</text>
            </view>
            <view class="title">{{ (item as GroupBuyItem).packageName }}</view>
            <view class="usersInfo">
              <view class="users">
                <image
                  class="userAvatar"
                  :src="(item as GroupBuyItem).coverImage"
                  mode="aspectFill"
                ></image>
                <text class="nickname">{{ (item as GroupBuyItem).shop_name }}</text>
              </view>
              <!--  已收藏   -->
              <view
                class="looks"
                v-if="(item as GroupBuyItem).isLoved"
                @tap.stop="handleLove(item._id)"
              >
                <text style="color: #fb5383" class="iconfont icon-tianchongxingxing"></text>
                <text style="color: #fb5383">{{ (item as GroupBuyItem).love }}</text>
              </view>
              <!--  未收藏   -->
              <view class="looks" v-else @tap.stop="handleLove(item._id)">
                <text class="iconfont icon-miaobianxingxing"></text>
                <text>{{ (item as GroupBuyItem).love }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 右列容器 -->
      <view class="column">
        <view
          class="listItem"
          v-for="item in columns.right"
          :key="item._id"
          @tap="handleGroupGo(item._id)"
        >
          <view class="cover">
            <image
              :src="(item as GroupBuyItem).coverImage"
              mode="widthFix"
              @load="(e) => handleImageLoad(e, (item as GroupBuyItem).coverImage)"
            ></image>
          </view>
          <view class="content">
            <view class="priceInfo" v-if="isGroup">
              <text class="currentPrice"
                ><text class="symbol">¥</text>{{ (item as GroupBuyItem).currentPrice }}</text
              >
              <text class="originalPrice">¥{{ (item as GroupBuyItem).originalPrice }}</text>
            </view>
            <view class="title">{{ (item as GroupBuyItem).packageName }}</view>
            <view class="usersInfo">
              <view class="users">
                <image
                  class="userAvatar"
                  :src="(item as GroupBuyItem).coverImage"
                  mode="aspectFill"
                ></image>
                <text class="nickname">{{ (item as GroupBuyItem).shop_name }}</text>
              </view>
              <!--  已收藏   -->
              <view
                class="looks"
                v-if="(item as GroupBuyItem).isLoved"
                @tap.stop="handleLove(item._id)"
              >
                <text style="color: #fb5383" class="iconfont icon-tianchongxingxing"></text>
                <text style="color: #fb5383">{{ (item as GroupBuyItem).love }}</text>
              </view>
              <!--  未收藏   -->
              <view class="looks" v-else @tap.stop="handleLove(item._id)">
                <text class="iconfont icon-miaobianxingxing"></text>
                <text>{{ (item as GroupBuyItem).love }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </scroll-view>
</template>

<style scoped lang="scss">
.list {
  flex: 1; // 占满剩余空间
  overflow: hidden; // 超出隐藏
  box-sizing: border-box; // 盒模型计算包含padding和border

  .waterfall {
    display: flex; // 弹性布局
    justify-content: space-between; // 两端对齐
    padding: 8rpx; // 整体内边距

    .column {
      width: 363rpx; // 列宽度

      .listItem {
        margin-bottom: 8rpx; // 项间距
        border-radius: 8rpx; // 圆角
        overflow: hidden; // 超出隐藏，保证圆角效果
        background-color: #fff; // 背景色

        .cover {
          width: 100%; // 图片容器宽度
          min-height: 200rpx; // 添加最小高度
          background: #f5f5f5; // 添加背景色

          image {
            width: 100%; // 图片宽度
            display: block; // 移除图片底部间隙
          }
        }

        .content {
          padding: 16rpx; // 内容区内边距

          // 添加价格样式
          .priceInfo {
            margin-bottom: 8rpx;
            .currentPrice {
              .symbol {
                font-size: 24rpx;
                font-weight: 600;
                color: $brand-color-primary;
              }
              font-size: 40rpx;
              font-weight: 600;
              color: $brand-color-primary;
              margin-right: 8rpx;
            }
            .originalPrice {
              font-size: 24rpx;
              color: $color-text-secondary;
              text-decoration: line-through;
            }
          }

          .title {
            margin-bottom: 16rpx; // 标题底部间距
            font-size: 28rpx; // 标题字号
            font-weight: 400; // 字重
            color: $color-title; // 标题颜色
            overflow: hidden; // 文本溢出隐藏
            white-space: nowrap; // 不换行
            text-overflow: ellipsis; // 省略号
          }

          .usersInfo {
            display: flex; // 弹性布局
            justify-content: space-between; // 两端对齐
            align-items: center; // 垂直居中

            .users {
              display: flex; // 弹性布局
              align-items: center; // 垂直居中
              font-size: 24rpx; // 文字大小

              .userAvatar {
                margin-right: 8rpx; // 头像右间距
                width: 32rpx; // 头像宽度
                height: 32rpx; // 头像高度
                border-radius: 50%; // 圆形头像
                overflow: hidden; // 超出隐藏
              }
            }

            .looks {
              display: flex; // 弹性布局
              align-items: center; // 垂直居中
              gap: 4rpx; // 图标和文字间距
              font-size: 24rpx; // 文字大小
              color: $color-text-secondary; // 次要文字颜色
            }
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
</style>
