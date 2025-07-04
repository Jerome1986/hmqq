<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import type { GroupBuyItem } from '@/types/home'
import { groupDetailApi } from '@/api/groupDetail.ts'
import { useLoveStore, useMemberStore } from '@/stores'
import { availableStoresApi } from '@/api/shopInfo.ts'
import type { AvailableStores } from '@/types/ShopInfo.ts'
import Notice from '@/pages/groupDetail/components/Notice.vue'
import GroupInfo from '@/pages/groupDetail/components/GroupInfo.vue'
import ShopCard from '@/components/ShopCard.vue'
import { updateUserMobileApi } from '@/api/userInfo.ts'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

// 使用 store
const memberStore = useMemberStore()
const loveStore = useLoveStore()

// 弹窗组件
const popup = ref()

// 获取团购数据
const groupData = ref<GroupBuyItem>()
// 轮播图当前页
const currentIndex = ref(1)

// 计算属性：是否已收藏
const isLoved = computed(() => loveStore.isLoved(props.id))

// 获取团购数据
const groupDataGet = async (id: string) => {
  const res = await groupDetailApi(id)
  groupData.value = {
    ...res.data,
    isLoved: loveStore.isLoved(id),
  }
  // 同步获取到对应门店
  await groupAvailableStoresGet(res.data._id)
}

// 获取团购对应的门店
const availableStoresData = ref<AvailableStores[]>([])
const groupAvailableStoresGet = async (groupId: string) => {
  const res = await availableStoresApi(groupId)
  console.log(res.data)
  availableStoresData.value = res.data
}

// 处理收藏点击
const handleLove = async () => {
  if (!groupData.value) return

  if (await loveStore.toggleLove(props.id)) {
    const newIsLoved = loveStore.isLoved(props.id)
    // 本地更新收藏状态和数量
    groupData.value = {
      ...groupData.value,
      isLoved: newIsLoved,
      love: groupData.value.love + (newIsLoved ? 1 : -1),
    }
  }
}

// 监听轮播图改变
const handleSwiperChange = (e: any) => {
  currentIndex.value = e.detail.current + 1
}

// 跳转到适用门店
const handleShopList = () => {
  uni.navigateTo({
    url: `/pages/shopList/shopList?groupId=${groupData.value?._id}`,
  })
}

// 处理团购
const handleBuy = () => {
  // 1.如果没有登录提示用户登录
  if (!memberStore.profile.isLogin) {
    uni.showModal({
      title: '提示',
      content: '下单前请先登录',
      confirmColor: '#fb5383',
      success: (res) => {
        if (res.confirm) {
          uni.navigateTo({
            url: `/pages/login/login?groupId=${groupData.value?._id}`,
          })
        }
      },
    })
    return
  }
  // 2.如果用户未填写手机号码提示填写手机号码
  if (!memberStore.profile.mobile) {
    popup.value.open()
    return
  }
  // 3.提交订单到确认订单页面
  uni.navigateTo({
    url: `/pages/confirmOrder/confirmOrder?groupId=${groupData.value?._id}`,
  })
}

// 处理保存手机号码
const userMobile = ref(memberStore.profile.mobile || '')
const savePhoneNumber = async () => {
  console.log(userMobile.value)
  // 非空校验
  if (!userMobile.value) {
    return uni.showToast({
      icon: 'none',
      title: '手机号码不可以为空',
    })
  }
  // todo 更新用户手机号码 -- 同步store -- 操作完毕关闭弹窗
  const updateRes = await updateUserMobileApi(memberStore.profile._id, userMobile.value)
  console.log(updateRes.data)
  if (updateRes.code === 200) {
    memberStore.setProfile({ mobile: userMobile.value })
    popup.value.close()
    // 后期可直接跳转订单页，增强用户体验
    setTimeout(() => {
      uni.showToast({
        icon: 'success',
        title: '请继续购物',
      })
    }, 800)
  } else {
    uni.showToast({
      icon: 'none',
      title: '保存失败',
    })
  }
}

// 组件挂载时初始化数据
onMounted(async () => {
  // 确保收藏列表已初始化
  if (memberStore.profile?._id) {
    await loveStore.initLoveList()
  }
  await groupDataGet(props.id)
})
</script>

<template>
  <view class="groupDetail" v-if="groupData">
    <!-- banner -->
    <view class="banner">
      <swiper :circular="true" :autoplay="true" @change="handleSwiperChange">
        <!-- 如果只有封面图,则将封面设置为轮播 -->
        <swiper-item
          class="bannerItem"
          v-if="!groupData.pictureList?.length && groupData.coverImage"
        >
          <image :src="groupData.coverImage" mode="aspectFill"></image>
        </swiper-item>
        <!-- 如果有相册则直接用相册轮播 -->
        <swiper-item
          class="bannerItem"
          v-for="(item, index) in groupData.pictureList"
          :key="index"
          v-else
        >
          <image :src="item" mode="aspectFill"></image>
        </swiper-item>
      </swiper>
      <view class="indicator" v-if="groupData.pictureList?.length || groupData.coverImage">
        {{ currentIndex }}/{{ groupData.pictureList?.length || 1 }}
      </view>
    </view>

    <!-- 商品信息 -->
    <view class="info">
      <!-- 价格区域 -->
      <view class="priceInfo">
        <view class="left">
          <view class="title">
            <text>团购价</text>
            <text class="dot"></text>
            <text>已售 {{ groupData.sell }} 份+</text>
          </view>
          <view class="price">
            <text class="symbol">¥</text>
            <text class="num">{{ groupData.currentPrice }}</text>
            <view class="discount" style="border: 1px solid #ffffff">
              <view class="discountNum">{{ groupData.discount.toFixed(1) }}折</view>
              <view class="discountPrice"
                >共减{{ groupData.originalPrice - groupData.currentPrice }}元</view
              >
            </view>
            <text class="oldPrice">¥{{ groupData.originalPrice }}</text>
          </view>
        </view>
        <view class="right">
          <text class="txtA">特价团</text>
          <text class="txtB">限量·低价</text>
        </view>
      </view>

      <!--  主体信息内容  -->
      <view class="pageContent">
        <!-- 使用信息 -->
        <view class="useInfo">
          <view class="title">
            <view class="proName">{{ groupData.packageName }}</view>
            <!-- 收藏按钮 -->
            <view style="display: flex; align-items: center" @tap="handleLove">
              <text
                class="iconfont"
                :class="groupData.isLoved ? 'icon-tianchongxingxing' : 'icon-shoucang'"
                :style="{
                  fontSize: '24px',
                  fontWeight: '400',
                  color: groupData.isLoved ? '#fb5383' : '#adadad',
                }"
              ></text>
              <text class="love" :style="{ color: groupData.isLoved ? '#fb5383' : '#adadad' }">
                {{ groupData.love }}
              </text>
            </view>
          </view>
          <view
            class="item"
            v-for="(item, key) in {
              消费须知: groupData.usageInstructions,
              服务保障: groupData.serviceGuarantee,
              有效期限: groupData.validityPeriod,
            }"
            :key="key"
          >
            <text class="label">{{ key }}</text>
            <text class="value">{{ item }}</text>
          </view>
        </view>
        <!--  适用门店--仅当前门店可用   -->
        <view class="useShop" v-if="availableStoresData.length === 1">
          <view class="top">
            <view class="title">适用商户</view>
            <view class="text">仅当前门店可用</view>
          </view>
          <!--  门店信息组件    -->
          <ShopCard :available-stores-data="availableStoresData[0]"></ShopCard>
        </view>
        <!--  适用门店--多门店可用   -->
        <view
          class="useShop"
          style="display: flex; justify-content: space-between; align-items: center"
          v-else
        >
          <view class="title" style="color: #18191c; font-weight: 600">适用商户</view>

          <view @tap="handleShopList" class="text" style="font-size: 24rpx; color: #61666d"
            >{{ groupData.applicableStores }}
            <text class="iconfont icon-you" style="font-size: 24rpx; color: #9499a0"></text
          ></view>
        </view>

        <!-- 团购详情 -->
        <GroupInfo></GroupInfo>
        <!-- 消费须知 -->
        <Notice :validityPeriod="groupData.validityPeriod"></Notice>
      </view>
    </view>

    <!-- 底部按钮 -->
    <view class="footer">
      <button class="buyBtn" @tap="handleBuy">立即团购</button>
    </view>

    <!--  弹窗  -->
    <uni-popup ref="popup" type="center" border-radius="10px 10px 0 0">
      <view class="popup">
        <view class="container">
          <view class="title">请完善手机号码</view>
          <view class="content"
            >为保障您的使用体验，请填写有效手机号码，我们会严格保护您的信息安全～</view
          >
          <view class="intPone">
            <input class="input" v-model="userMobile" placeholder="请输入您的手机号" />
          </view>
        </view>
        <view class="btn" @tap.stop="savePhoneNumber"> 提交保存 </view>
      </view>
    </uni-popup>
  </view>
</template>

<style scoped lang="scss">
/* 声明自定义字体 */
@font-face {
  font-family: 'customIcon';
  src: url('@/static/iconfont/customIcon.ttf') format('truetype');
}

@font-face {
  font-family: 'FlashItalicGB';
  src: url('@/static/iconfont/FlashItalicGB.ttf') format('truetype');
}
/* 团购详情页面整体样式 */
.groupDetail {
  padding-bottom: calc(120rpx + env(safe-area-inset-bottom)); // iOS >= 11.2
  background-color: #f4f4f4;

  /* Banner区域 */
  .banner {
    width: 100%;
    position: relative;

    /* 轮播图组件 */
    swiper {
      width: 100%;
      height: 750rpx;
    }

    /* 轮播项 */
    .bannerItem {
      width: 100%;
      height: 100%;
      /* 轮播图片 */
      image {
        width: 100%;
        height: 100%;
      }
    }

    /* 页码指示器 */
    .indicator {
      position: absolute;
      right: 30rpx;
      bottom: 60rpx;
      padding: 4rpx 16rpx;
      background: rgba(0, 0, 0, 0.3);
      border-radius: 16rpx;
      color: #fff;
      font-size: 24rpx;
    }
  }

  /* 商品信息区域 */
  .info {
    transform: translateY(-40rpx);
    border-radius: 32rpx 32rpx 0 0;
    overflow: hidden;

    /* 价格信息区域 */
    .priceInfo {
      padding: 24rpx 32rpx 48rpx 32rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 180rpx;
      background-color: #fff;
      background-image: url('@/static/images/sucai.png');
      background-repeat: no-repeat;
      background-size: 100% auto;
      background-position: right top;
      color: #ffffff;

      .left {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        gap: 16rpx;
        height: 100%;
        .title {
          font-size: 28rpx;
          line-height: 44rpx;
          display: flex;
          align-items: center;
          gap: 8rpx;

          .dot {
            width: 6rpx; // 3px = 6rpx
            height: 6rpx;
            background-color: #ffffff;
            border-radius: 50%;
            display: inline-block;
          }
        }
        /* 价格展示 */
        .price {
          display: flex;
          align-items: center;
          gap: 8rpx;

          /* 价格区域（符号和数字） */
          .symbol,
          .num {
            align-self: flex-end;
            line-height: 1;
          }

          /* 人民币符号 */
          .symbol {
            font-size: 28rpx;
            padding-bottom: 4rpx;
          }

          /* 当前价格 */
          .num {
            font-size: 48rpx;
            font-weight: 600;
          }

          /* 折扣 */
          .discount {
            display: flex;
            font-size: 20rpx;
            font-weight: 500;
            line-height: 32rpx;
            color: #fff;
            border-radius: 8rpx;
            align-self: center;

            .discountNum {
              padding: 0 8rpx;
              background-color: #ffffff;
              color: $brand-color-primary;
            }
            .discountPrice {
              padding: 0 8rpx;
            }
          }

          /* 原价 */
          .oldPrice {
            margin-left: 16rpx;
            font-size: 24rpx;
            text-decoration: line-through;
            align-self: center;
          }
        }
      }

      .right {
        height: fit-content;
        text {
          display: block;
          font-family: 'customIcon';
        }

        .txtA {
          margin-bottom: 12rpx;
          font-size: 40rpx;
          font-weight: 900;
          line-height: 1;
        }

        .txtB {
          font-size: 24rpx;
          font-weight: 500;
          font-family: 'FlashItalicGB';
          line-height: 1;
        }
      }
    }

    /* 主体内容区域 */
    .pageContent {
      padding: 24rpx;
      background-color: $color-background;
      transform: translateY(-32rpx);
      border-radius: 32rpx 32rpx 0 0;
      /* 使用信息区域 */
      .useInfo {
        padding: 24rpx;
        background-color: #ffffff;
        border-radius: 24rpx;

        /* 商品标题 */
        .title {
          display: flex;
          justify-content: space-between;
          margin-bottom: 24rpx;
          font-size: 32rpx;
          font-weight: 600;
          line-height: 48rpx;
          color: $color-title;
        }

        /* 信息项 */
        .item {
          display: flex;
          margin-bottom: 20rpx;
          font-size: 24rpx;
          color: $color-title;
          &:last-child {
            margin-bottom: 0;
          }

          /* 标签 */
          .label {
            margin-right: 24rpx;
            line-height: 32rpx;
            font-weight: 600;
          }
          /* 内容 */
          .value {
            flex: 1;
            font-weight: 400;
          }
        }
      }

      /*适用门店*/
      .useShop {
        margin-top: 16rpx;
        padding: 24rpx;
        background-color: #ffffff;
        border-radius: 24rpx;

        /*顶部title*/
        .top {
          margin-bottom: 32rpx;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: $color-title;

          .title {
            font-weight: 600;
          }
          .text {
            font-size: 24rpx;
            color: $color-text;
          }
        }
      }
    }
  }

  /* 底部固定按钮 */
  .footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 20rpx 32rpx calc(20rpx + env(safe-area-inset-bottom));
    background-color: #fff;
    display: flex;
    align-items: center;
    z-index: 99; // 确保按钮在最上层

    /* 购买按钮 */
    .buyBtn {
      width: 100%;
      height: 88rpx; // 稍微调高一点
      line-height: 88rpx;
      background: linear-gradient(90deg, #f6759b 0%, #e65478 100%);
      border-radius: 44rpx; // 保持圆角为高度的一半
      color: #fff;
      font-size: 32rpx;
      font-weight: 500;
    }
  }

  /*弹窗*/
  .uni-popup {
    .popup {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 48rpx;
      width: 596rpx;
      height: 564rpx;
      background-color: #ffffff;
      border-radius: 32rpx;
      font-size: 28rpx;

      /*文本区域*/
      .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 32rpx;
        .title {
          font-size: 32rpx;
          font-weight: 600;
          color: $color-title;
        }
        .content {
          color: $color-text;
        }

        /*输入框*/
        .intPone {
          width: 100%;
          .input {
            padding: 32rpx 24rpx;
            height: 108rpx;
            border-radius: 16rpx;
            background-color: #f1f2f3;
            font-size: 28rpx;
            color: $color-title;
            .uni-input-placeholder {
              color: $color-text-secondary;
            }
          }
        }
      }

      /*提交按钮*/
      .btn {
        margin-top: 32rpx;
        text-align: center;
        height: 96rpx;
        line-height: 96rpx;
        background: linear-gradient(to right, #f6759b 0%, #e65478 100%);
        color: #ffffff;
        font-size: 28rpx;
        border-radius: 48rpx;
      }
    }
  }
}
</style>
