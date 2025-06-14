<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { AiCategoryItem } from '@/types/home'
import { aiDetailApi } from '@/api/ai.ts'
import { aiReplyApi, createDialogueApi } from '@/api/coze.ts'
import type { CozeAnswerContent } from '@/types/coze'
import { useMemberStore } from '@/stores'

const props = defineProps({
  id: String,
})

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
const conversation_id = ref('') // 当前会话ID
const chat_id = ref('') // 当前聊天ID
const isLoading = ref(false) // 发送消息时的加载状态
const isInitialLoading = ref(true) // 首次加载对话的状态

// 轮询配置参数
const POLL_CONFIG = {
  maxAttempts: 30, // 最大轮询次数
  interval: 1000, // 轮询间隔时间(ms)
  timeout: 30000, // 超时时间(ms)
}

// 获取对话消息
const dialogueGet = async (conversation_id: string, chat_id: string) => {
  try {
    const res = await aiReplyApi(conversation_id, chat_id)
    const replyList: CozeAnswerContent[] = res.data || []

    // 只获取AI的回复消息，并按时间排序
    const aiMessages = replyList
      .filter((item: CozeAnswerContent) => item.role === 'assistant' && item.type === 'answer')
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())

    // 获取当前已存在的AI消息内容，用于去重
    const existingContents = messagesList.value
      .filter((msg) => msg.type === 'ai')
      .map((msg) => msg.content)

    // 找出新消息并过滤掉重复内容
    const newMessages = aiMessages.filter((msg) => !existingContents.includes(msg.content))

    // 如果有新消息，一次性添加所有新消息到列表中
    if (newMessages.length > 0) {
      const typedMessages: Message[] = newMessages.map((msg) => ({
        type: 'ai' as const,
        content: msg.content,
        status: 'success' as const,
      }))
      messagesList.value.push(...typedMessages)
      return true // 返回true表示有新消息添加
    }

    return false // 返回false表示没有新消息
  } catch (error) {
    console.error('获取对话失败:', error)
    return false
  }
}

// 发送消息处理函数
const sendMessage = async () => {
  const content = message.value.trim()
  if (!content) return

  // 添加用户消息到列表
  messagesList.value.push({
    type: 'user',
    content,
    status: 'success',
  })

  message.value = '' // 清空输入框
  isLoading.value = true // 显示加载状态

  try {
    // 创建新的对话或在现有对话中发送消息
    const res = await createDialogueApi(memberStore.profile._id, conversation_id.value, content)
    chat_id.value = res.data.chat_id

    // 轮询获取AI回复
    let attempts = 0
    while (attempts < POLL_CONFIG.maxAttempts) {
      const hasNewMessage = await dialogueGet(conversation_id.value, chat_id.value)
      if (hasNewMessage) {
        break // 收到新消息后停止轮询
      }
      attempts++
      await new Promise((resolve) => setTimeout(resolve, POLL_CONFIG.interval))
    }
  } catch (error: any) {
    console.error('发送消息失败:', error)
    uni.showToast({
      title: error.message || '发送失败',
      icon: 'error',
    })
  } finally {
    isLoading.value = false // 无论成功失败都关闭加载状态
  }
}

// 初始化对话
const initDialogue = async () => {
  isInitialLoading.value = true // 显示初始加载状态
  try {
    // 创建新的对话
    const res = await createDialogueApi(memberStore.profile._id, '', '')
    conversation_id.value = String(res.data.conversation_id || '')
    chat_id.value = String(res.data.chat_id || '')

    if (conversation_id.value && chat_id.value) {
      // 首次加载使用特殊的轮询配置
      let attempts = 0
      const maxInitialAttempts = 5 // 首次加载的重试次数较少
      const initialInterval = 2000 // 首次加载的间隔时间较长

      // 轮询获取初始消息
      while (attempts < maxInitialAttempts) {
        const hasNewMessage = await dialogueGet(conversation_id.value, chat_id.value)
        if (hasNewMessage) {
          break // 收到消息后停止轮询
        }
        attempts++
        if (attempts < maxInitialAttempts) {
          await new Promise((resolve) => setTimeout(resolve, initialInterval))
        }
      }
    }
  } catch (error: any) {
    console.error('初始化对话错误:', error)
    uni.showToast({
      title: error.message || '初始化对话失败',
      icon: 'error',
    })
  } finally {
    isInitialLoading.value = false // 完成初始化后关闭加载状态
  }
}

onMounted(async () => {
  if (props.id) {
    await aiDetailGet(props.id)
  }
  await initDialogue()
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
          <view class="message">{{ msg.content }}</view>
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
