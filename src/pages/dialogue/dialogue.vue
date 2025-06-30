<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { AiCategoryItem } from '@/types/home'
import { aiChartDeepSeekApi, aiDetailApi } from '@/api/ai.ts'
import { useMemberStore } from '@/stores'
import { marked } from 'marked'

// 接收aiId参数
const props = defineProps({
  id: String,
})

// 获取当前ai信息
const aiData = ref<AiCategoryItem>()
const aiDetailGet = async (ai_id: string) => {
  const res = await aiDetailApi(ai_id)
  // 获取数组中的第一个项
  aiData.value = res.data
}

const memberStore = useMemberStore()

// 定义消息类型接口
interface Message {
  type: 'user' | 'ai' // 消息发送者类型
  content: string // 消息内容
  status: 'sending' | 'success' | 'error' // 消息状态
}

// 消息列表状态管理
const messagesList = ref<Message[]>([]) // 存储对话消息记录
const message = ref('') // 当前输入框的消息内容
const aiInitMessages = ref('你好呀，我是武汉的美食Ai,关于武汉美食的问题都可以问我哟') //Ai初始消息
const isLoading = ref(false) // 发送消息时的加载状态
const isInitialLoading = ref(true) // 首次加载对话的状态

// 发送消息处理函数
const sendMessage = async () => {
  if (!message.value.trim()) {
    return uni.showToast({
      icon: 'none',
      title: '消息不可以为空',
    })
  }
  // 1. 用户消息入列表
  messagesList.value.push({
    type: 'user',
    content: message.value,
    status: 'success',
  })
  const userMsgIndex = messagesList.value.length - 1
  const sendContent = message.value
  message.value = '' // 清空输入框
  isLoading.value = true

  try {
    const res = await aiChartDeepSeekApi(memberStore.profile._id, sendContent)
    if (res.code === 200) {
      messagesList.value.push({
        type: 'ai',
        content: marked.parse(res.data.reply) as string,
        status: 'success',
      })
    } else {
      // AI回复失败
      messagesList.value.push({
        type: 'ai',
        content: res.message || 'AI未能理解你的问题',
        status: 'error',
      })
    }
  } catch (e) {
    console.error(e)
    messagesList.value.push({
      type: 'ai',
      content: '网络异常，请稍后再试',
      status: 'error',
    })
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  if (props.id) {
    await aiDetailGet(props.id)
  }
  // 首次进入，展示AI欢迎语
  messagesList.value.push({
    type: 'ai',
    content: aiInitMessages.value,
    status: 'success',
  })
  isInitialLoading.value = false
})
</script>

<template>
  <view class="dialogue">
    <view class="header">
      <view class="userInfo">
        <image class="avatar" :src="aiData?.aiAvatar" mode="aspectFill"></image>
        <text class="nickname">{{ aiData?.aiName }}</text>
      </view>
      <view class="actions">
        <text class="iconfont icon-ai"></text>
      </view>
    </view>

    <scroll-view
      class="messageArea"
      :scroll-y="true"
      :scroll-into-view="'msg-' + (messagesList.length - 1)"
    >
      <template v-if="isInitialLoading">
        <view class="messageItem left">
          <view class="message loading">
            <view class="dot-flashing"></view>
            AI思考中...
          </view>
        </view>
      </template>
      <template v-else>
        <view
          v-for="(msg, index) in messagesList"
          :key="index"
          :id="'msg-' + index"
          :class="['messageItem', msg.type === 'user' ? 'right' : 'left']"
        >
          <!-- 仅限h5使用--因为v-html原生已经有了，用在view标签会覆盖，所以这里使用div，小程序环境rich-text来代替v-html -->
          <div class="message" v-if="msg.type === 'ai'" v-html="msg.content"></div>
          <view class="message" v-else>{{ msg.content }}</view>
        </view>
        <view v-if="isLoading" class="messageItem left">
          <view class="message loading">
            <view class="dot-flashing"></view>
            AI思考中...
          </view>
        </view>
      </template>
    </scroll-view>

    <view class="footer">
      <view class="tools">
        <view class="tool">
          <text class="iconfont icon-lvyou"></text>
          <text>游玩出行</text>
        </view>
        <view class="tool">
          <text class="iconfont icon-meishi"></text>
          <text>吃喝玩乐</text>
        </view>
      </view>
      <view class="inputArea">
        <input
          class="input"
          type="text"
          v-model="message"
          placeholder="发消息......"
          placeholder-class="placeholder"
        />
        <button class="sendBtn" @tap="sendMessage">发送</button>
      </view>
    </view>
  </view>
</template>
<style scoped lang="scss">
.dialogue {
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  /* 头部样式 */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16rpx 24rpx;
    background-color: #fff;
    border-bottom: 1rpx solid $color-border;

    .userInfo {
      display: flex;
      align-items: center;
      gap: 24rpx;

      .avatar {
        width: 80rpx;
        height: 80rpx;
        border-radius: 50%;
      }

      .nickname {
        font-size: 32rpx;
        font-weight: 500;
        color: $color-title;
      }
    }

    .actions {
      display: flex;
      align-items: center;
      gap: 32rpx;

      .iconfont {
        font-size: 40rpx;
        color: $color-text;
      }
    }
  }

  /* 消息区域 */
  .messageArea {
    flex: 1;
    padding: 24rpx;
    padding-bottom: calc(300rpx + 84rpx);
    box-sizing: border-box;
    height: 100vh;
    position: relative;

    .messageItem {
      margin-bottom: 32rpx;
      display: flex;

      &.right {
        justify-content: flex-end;

        .message {
          background-color: $brand-color-primary;
          color: #fff;
          border-radius: 32rpx 4rpx 32rpx 32rpx;
        }
      }

      &.left {
        justify-content: flex-start;

        .message {
          background-color: #fff;
          color: #333;
          border-radius: 4rpx 32rpx 32rpx 32rpx;

          &.loading {
            display: flex;
            align-items: center;
            gap: 12rpx;
            color: #666;
            font-size: 26rpx;
          }
        }
      }

      .message {
        max-width: 70%;
        padding: 24rpx;
        font-size: 28rpx;
        line-height: 1.5;
        word-break: break-word;
        white-space: pre-wrap;
      }
    }
  }

  /* AI思考中动画 */
  .dot-flashing {
    position: relative;
    width: 8rpx;
    height: 8rpx;
    border-radius: 50%;
    background-color: #666;
    animation: dot-flashing 1s infinite linear alternate;
    animation-delay: 0.5s;

    &::before,
    &::after {
      content: '';
      display: inline-block;
      position: absolute;
      top: 0;
    }

    &::before {
      left: -16rpx;
      width: 8rpx;
      height: 8rpx;
      border-radius: 50%;
      background-color: #666;
      animation: dot-flashing 1s infinite alternate;
      animation-delay: 0s;
    }

    &::after {
      left: 16rpx;
      width: 8rpx;
      height: 8rpx;
      border-radius: 50%;
      background-color: #666;
      animation: dot-flashing 1s infinite alternate;
      animation-delay: 1s;
    }
  }

  @keyframes dot-flashing {
    0% {
      background-color: #666;
    }
    50%,
    100% {
      background-color: #ccc;
    }
  }

  /* 底部工具栏 */
  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding-bottom: 84rpx;
    background: #f5f5f5;
    z-index: 100;

    /* 工具栏 */
    .tools {
      display: flex;
      padding: 16rpx 24rpx;
      border-top: 1rpx solid $color-border;

      .tool {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 16rpx;
        padding: 16rpx 24rpx;

        border-radius: 16rpx;
        margin-right: 16rpx;
        border: 1px solid $color-border;

        .iconfont {
          font-size: 32rpx;
          color: #666;
        }

        text {
          font-size: 24rpx;
          color: #666;
        }
      }
    }

    /* 输入区域 */
    .inputArea {
      margin: 0 16rpx;
      background: #fff;
      border-radius: 16rpx;
      box-shadow: 0 0 16rpx 0 rgba(22, 24, 32, 0.25), 0 0 8rpx 0 rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      padding: 24rpx 16rpx;
      gap: 16rpx;

      .input {
        flex: 1;
        height: 72rpx;
        background-color: #f5f5f5;
        border-radius: 24rpx;
        padding: 8rpx 8rpx 8rpx 48rpx;
        font-size: 28rpx;
      }

      .placeholder {
        color: #999;
      }

      .sendBtn {
        width: 120rpx;
        height: 92rpx;
        line-height: 92rpx;
        text-align: center;
        background-color: $brand-color-primary;
        color: #fff;
        font-size: 28rpx;
        border-radius: 16rpx;
        padding: 0;
      }
    }
  }
}
</style>
