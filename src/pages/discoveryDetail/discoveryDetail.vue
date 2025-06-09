<script setup lang="ts">
import FindFooter from '@/components/FindFooter.vue'
import Commit from '@/components/Commit.vue'
import { onMounted, ref } from 'vue'
import type { ArticleListItem } from '@/types/find'
import {
  articleDetailGetApi,
  articleViewsApi,
  commentsAddApi,
  commentsGetApi,
} from '@/api/articleDetail.ts'
import type { GroupBuyItem } from '@/types/home'
import { groupDetailApi } from '@/api/groupDetail.ts'
import { useMemberStore } from '@/stores'
import type { CommentItem } from '@/types/comment.ts'

// 接收传递的参数
const props = defineProps({
  article_id: {
    type: String,
    required: true,
  },
})

// 定义用户store
const menberStore = useMemberStore()

// 文章详情数据
const articleData = ref<ArticleListItem>()

// 获取文章详情
const articleDetailGet = async (id: string) => {
  console.log(id)
  const res = await articleDetailGetApi(id)
  console.log(res)
  articleData.value = res.data
}

// 获取文章挂载的团购详情
const groupData = ref<GroupBuyItem>()
const articleByGroupGet = async (pro_id: string) => {
  const res = await groupDetailApi(pro_id)
  console.log(res)
  groupData.value = res.data
}

// 处理发送评论事件
const handleSendCommit = async (e: string) => {
  console.log('handleSendCommit', e)
  // TODO 将发送内容添加到评论列表

  // 检测用户是否登录
  if (!menberStore.profile?._id) {
    uni.showToast({
      icon: 'none',
      title: '请先登录',
    })
    return
  }

  // 提交数据库
  const res = await commentsAddApi(
    props.article_id,
    menberStore.profile!._id,
    menberStore.profile!.nickname,
    menberStore.profile!.user_avatar,
    e,
  )

  console.log('评论成功', res)
  if (res.data.comment_id) {
    uni.showToast({
      icon: 'success',
      title: '发布成功',
    })
    // 重新获取评论列表
    await commentsListGet(props.article_id)
  }
}

// 获取当前文章的评论列表
const commentList = ref<CommentItem[]>([])
const commitNum = ref(0)
const commentsListGet = async (article_id: string) => {
  const res = await commentsGetApi(article_id)
  commentList.value = res.data
  commitNum.value = res.data.length
}

// 挂载完毕
onMounted(async () => {
  if (props.article_id) {
    await articleDetailGet(props.article_id)
    await commentsListGet(props.article_id)
  }

  if (articleData.value?.pro_id) {
    await articleByGroupGet(articleData.value?.pro_id)
  }
})
</script>

<template>
  <view class="discovery">
    <scroll-view class="scrollView" :scroll-y="true">
      <!--  banner  -->
      <swiper class="swiper" circular :autoplay="true">
        <swiper-item v-for="(img, index) in articleData?.articlePicList" :key="index">
          <image class="swiper-item" :src="img" mode="widthFix"></image>
          <view class="page-counter"
            >{{ index + 1 }} / {{ articleData?.articlePicList?.length }}</view
          >
        </swiper-item>
      </swiper>
      <!--  文章内容+评论  -->
      <view class="container">
        <!--  文章内容  -->
        <view class="article-info">
          <view class="article-title">{{ articleData?.articleName }}</view>
          <view class="article-content">{{ articleData?.article_content }}</view>
          <!--  分割线  -->
          <view class="divider"></view>
        </view>
        <!--  评论  -->
        <Commit :commentList="commentList"></Commit>
      </view>
    </scroll-view>
    <!--  底部  -->
    <FindFooter
      @sendMessage="handleSendCommit"
      :look-num="articleData?.lookNum"
      :group-data="groupData"
      :commitNum="commitNum"
    ></FindFooter>
  </view>
</template>

<style scoped lang="scss">
page {
  height: 100%;
  overflow: hidden;
  background-color: #ffffff;
}

.discovery {
  width: 100%;
  height: 100%;

  .scrollView {
    flex: 1;
    overflow: hidden;
    box-sizing: border-box;
    /*轮播图*/
    .swiper {
      height: 1000rpx;

      swiper-item {
        width: 100%;
        height: 100%;

        .swiper-item {
          width: 100%;
          height: 100%;
        }

        /*banner的页码计数器*/
        .page-counter {
          position: fixed;
          top: 16rpx;
          right: 16rpx;
          padding: 8rpx 16rpx;
          background-color: rgba(0, 0, 0, 0.4);
          border-radius: 16rpx;
          color: #ffffff;
        }
      }
    }

    /*内容*/
    .container {
      padding-bottom: 160rpx;
      background-color: #fff;

      /*文章内容*/
      .article-info {
        padding: 28rpx 24rpx 0;
        color: $color-title;

        .article-title {
          font-size: 36rpx;
          font-weight: 600;
          line-height: 48rpx;
        }
        .article-content {
          margin-top: 16rpx;
          font-size: 28rpx;
          line-height: 44rpx;
        }

        /*分割线*/
        .divider {
          margin-top: 32rpx;
          width: 100%;
          height: 2rpx;
          background-color: $color-divider;
        }
      }
    }
  }
}
</style>
