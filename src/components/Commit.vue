<script setup lang="ts">
//接收评论列表参数
import type { CommentItem } from '@/types/comment.ts'

const props = defineProps({
  commentList: {
    type: Array as () => Array<CommentItem>,
    default: () => {
      return []
    },
  },
})
</script>

<template>
  <view class="commit" v-if="commentList.length > 0">
    <view class="commitItem" v-for="item in props.commentList" :key="item._id">
      <view class="left">
        <!--  用户头像  -->
        <image class="userAvatar" :src="item.user_avatar" mode="aspectFill"></image>
      </view>
      <view class="right">
        <!--  用户信息  -->
        <view class="userInfo">
          <view class="nickname">{{ item.user_nickname }}</view>
          <view class="sendTime">
            <uni-dateformat :date="item.creatAt"></uni-dateformat>
          </view>
        </view>
        <!--  评论内容  -->
        <view class="commitContent"> {{ item.content }}</view>
      </view>
    </view>
  </view>
  <!-- 空状态 -->
  <view class="empty" v-else>
    <view class="box" style="width: 100%; text-align: center">
      <image src="/static/images/commentEmpty.png" mode="aspectFit"></image>
    </view>
  </view>
</template>

<style scoped lang="scss">
.commit {
  padding: 0 24rpx;
  margin-top: 32rpx;

  .commitItem {
    margin-bottom: 40rpx;
    display: flex;
    align-items: flex-start;
    /*用户头像*/
    .left {
      width: 64rpx;
      height: 64rpx;
      border-radius: 50%;
      overflow: hidden;

      .userAvatar {
        width: 100%;
        height: 100%;
      }
    }

    /*姓名和评论*/
    .right {
      margin-left: 16rpx;
      flex: 1;
      font-size: 24rpx;
      .userInfo {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: $color-text-secondary;

        .nickname {
          margin-bottom: 8rpx;
        }
        .sendTime {
        }
      }

      /*评论内容*/
      .commitContent {
        color: $color-title;
        line-height: 1.5;
      }
    }
  }
}
.empty {
  padding: 24rpx;
  .box {
    width: 100%;
    height: fit-content;
    image {
      width: 352rpx;
      height: 244rpx;
    }
  }
}
</style>
