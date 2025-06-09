<script setup lang="ts">
import { ref } from 'vue'
import type { GroupBuyItem } from '@/types/home'

const props = defineProps({
  lookNum: Number,
  commitNum: Number,
  groupData: {
    type: Object as () => GroupBuyItem | undefined,
    default: undefined,
  },
})

// 弹窗组件
const popup = ref()

// 处理评论
const handleCommit = () => {
  popup.value.open()
}

// 标记弹窗
const isPopup = ref(true)

// 监听弹窗变化
const changePop = (e: any) => {
  isPopup.value = !e.show
}

// 处理团购购买
const handleBuyGroup = (groupId?: string) => {
  if (!groupId) {
    return uni.showToast({ icon: 'none', title: '商品信息加载中...' })
  }
  uni.navigateTo({
    url: `/pages/groupDetail/groupDetail?id=${groupId}`,
  })
}

// 发送内容
const message = ref('')
// 提交发送事件
const emits = defineEmits(['sendMessage'])
// 发送评论
const sendMessage = () => {
  popup.value.close()
  emits('sendMessage', message.value)
  message.value = ''
}
</script>

<template>
  <transition name="slide-fade">
    <view class="footer" v-if="isPopup">
      <!--  团购链接  -->
      <view class="group" v-if="groupData" @tap="handleBuyGroup(groupData._id)">
        <!--  封面  -->
        <view class="proCover">
          <image :src="groupData.coverImage" mode="widthFix"></image>
        </view>
        <!--  团购信息  -->
        <view class="proInfo">
          <!--  商品名称  -->
          <view class="proName">{{ groupData.packageName }}</view>
          <!--  价格信息  -->
          <view class="priceInfo">
            <view class="price-wrapper">
              <text class="sell">¥{{ groupData.currentPrice }}</text>
              <text class="originalPrice">¥{{ groupData.originalPrice }}</text>
            </view>
            <view>抢</view>
          </view>
        </view>
      </view>
      <view class="group" v-else>
        <view class="loading">当前未挂载商品...</view>
      </view>
      <!--  图标功能  -->
      <view class="function">
        <!--  浏览量  -->
        <view class="icon-wrapper">
          <text class="iconfont icon-yanjing"></text>
          <text class="count">{{ props.lookNum || 0 }}</text>
        </view>
        <!--  评论数  -->
        <view class="icon-wrapper" @tap="handleCommit">
          <text class="iconfont icon-pinglun"></text>
          <text class="count">{{ props.commitNum || 0 }}</text>
        </view>
      </view>
    </view>
  </transition>
  <!-- 聊天框弹出层   -->
  <uni-popup @change="changePop" ref="popup" type="bottom" border-radius="10px 10px 0 0">
    <view class="sendCommit">
      <input class="ipt" v-model="message" type="text" placeholder="想说点什么..." />
      <button class="sendBtn" @tap="sendMessage">发送</button>
    </view>
  </uni-popup>
</template>

<style scoped lang="scss">
// 添加过渡动画
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.footer {
  display: flex;
  justify-content: space-between;
  padding: 16rpx 22rpx 0;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 160rpx;
  border-top: 2rpx solid $color-divider;
  background-color: #fff;

  /*团购信息*/
  .group {
    display: flex;
    align-items: center;
    flex: 1;
    height: fit-content;
    background-color: #f5f5f5;
    border-radius: 12rpx;
    min-height: 104rpx;

    .loading {
      width: 100%;
      text-align: center;
      color: $color-text-secondary;
      font-size: 28rpx;
    }

    /*封面*/
    .proCover {
      margin-right: 8rpx;
      width: 96rpx;
      height: 96rpx;
      border-radius: 8rpx;
      overflow: hidden;

      image {
        display: block;
        width: 100%;
        height: 100%;
      }
    }

    /*商品信息*/
    .proInfo {
      padding: 4rpx;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 104rpx;

      .proName {
        font-size: 28rpx;
        color: #333;
        margin-bottom: 8rpx;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      /*价格区域*/
      .priceInfo {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: linear-gradient(to right, #fb538300, #fb53831a);
        border-radius: 4rpx;

        .price-wrapper {
          display: flex;
          align-items: baseline;
          gap: 8rpx;
        }

        .sell {
          color: #ff4444;
          font-size: 32rpx;
          font-weight: bold;
        }

        .originalPrice {
          color: #999;
          font-size: 24rpx;
          text-decoration: line-through;
        }

        view:last-child {
          background: $brand-color-primary;
          color: #fff;
          width: 64rpx;
          height: 48rpx;
          line-height: 48rpx;
          text-align: center;
          border-radius: 8rpx;
          font-size: 28rpx;
          font-weight: 900;
        }
      }
    }
  }

  /*功能图标*/
  .function {
    display: flex;
    align-items: center;
    gap: 24rpx;
    height: 104rpx;
    padding: 0 32rpx;

    .icon-wrapper {
      display: flex;
      align-items: center;
      gap: 4rpx;

      .iconfont {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 64rpx;
        height: 64rpx;
        font-size: 64rpx;
        color: $color-text;
      }

      .count {
        font-size: 28rpx;
        font-weight: 500;
        color: $color-title;
      }
    }
  }
}

/* 使用 :deep() 来修改组件内部样式 */
:deep(.uni-popup) {
  width: 100%;
  height: fit-content;
}

/*发送区域*/
.sendCommit {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 120rpx;
  background-color: #ffffff;
  padding: 16rpx;

  /*输入框*/
  .ipt {
    flex: 1;
    padding: 16rpx 24rpx;
    height: 64rpx;
    border-radius: 32rpx;
    background-color: #f4f4f4;
    font-size: 24rpx;
    color: $color-text;
  }

  /*发送按钮*/
  .sendBtn {
    margin-left: 16rpx;
    height: 64rpx;
    line-height: 64rpx;
    border-radius: 48rpx;
    background: linear-gradient(to right, #f6759b, #e65478);
    color: #fff;
    font-size: 28rpx;
    font-weight: 400;
  }
}
</style>
