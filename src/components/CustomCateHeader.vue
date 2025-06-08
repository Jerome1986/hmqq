<script setup lang="ts">
import { computed, onMounted, ref, nextTick } from 'vue'
import type { FindCateItem } from '@/types/find'
import { findCateGetApi } from '@/api/find.ts'
import { useFindCateStore } from '@/stores/modules/find.ts'

// 定义store
const findCateStore = useFindCateStore()
// 获取分类
const cateList = ref<FindCateItem[]>([])
const cateListGet = async () => {
  try {
    const res = await findCateGetApi()
    cateList.value = res.data

    // 始终设置当前分类并触发数据加载
    const currentCateId = findCateStore.currentCate
    if (!currentCateId || !cateList.value.find((item) => item._id === currentCateId)) {
      // 如果没有当前分类或当前分类不在列表中，设置第一个分类
      findCateStore.setCurrentCate(cateList.value[0]._id)
      cateActiveIndex.value = 0
    } else {
      // 如果有当前分类，找到对应索引
      const index = cateList.value.findIndex((item) => item._id === currentCateId)
      cateActiveIndex.value = index
    }
    // 始终触发一次changeCate以确保数据加载
    emits('changeCate')
  } catch (error) {
    console.error('获取分类数据失败:', error)
    throw error
  }
}

//下标
const cateActiveIndex = ref(0)

// 计算浮标的位置
const fubiaoStyle = computed(() => {
  const gap = 40 // gap: 40rpx
  const baseWidth = 72 // 基础宽度
  const charWidth = 36 // 每个字的宽度
  const fubiaoWidth = 64 // 浮标宽度

  // 计算当前选中项之前所有项的总宽度
  let totalWidth = 0
  for (let i = 0; i < cateActiveIndex.value; i++) {
    const itemLength = cateList.value[i]?.name.length
    const itemWidth = itemLength > 2 ? baseWidth + (itemLength - 2) * charWidth : baseWidth
    totalWidth += itemWidth + gap
  }

  // 计算当前选中项的文字宽度
  const currentLength = cateList.value[cateActiveIndex.value]?.name.length
  const currentItemWidth =
    currentLength > 2 ? baseWidth + (currentLength - 2) * charWidth : baseWidth

  // 计算居中偏移：(文字宽度 - 浮标宽度) / 2
  const centerOffset = (currentItemWidth - fubiaoWidth) / 2

  return {
    transform: `translateX(${totalWidth + centerOffset}rpx)`,
    transition: 'transform 0.3s',
  }
})
const emits = defineEmits(['changeCate'])
// 处理切换分类
const handleChangeCate = (item: FindCateItem, index: number) => {
  cateActiveIndex.value = index
  findCateStore.setCurrentCate(item._id)
  emits('changeCate')
}

defineExpose({
  cateListGet,
})
</script>

<template>
  <view class="findHead">
    <!-- 添加滚动容器 -->
    <scroll-view
      :scroll-x="true"
      class="scrollContainer"
      :show-scrollbar="false"
      :scroll-into-view="`cate${cateActiveIndex}`"
      :scroll-with-animation="true"
    >
      <view class="cate">
        <view
          class="cateItem"
          :id="`cate${index}`"
          :class="{ itemActive: cateActiveIndex === index }"
          v-for="(item, index) in cateList"
          :key="item._id"
          @tap="handleChangeCate(item, index)"
          >{{ item.name }}</view
        >
        <!-- 浮标  -->
        <view class="fubiao" :style="fubiaoStyle"></view>
      </view>
    </scroll-view>
    <text class="send iconfont icon-fabu"></text>
  </view>
</template>

<style scoped lang="scss">
.findHead {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 24rpx;
  height: 96rpx;
  border-bottom: 1rpx solid #e3e5e7;
  background-color: #ffffff;

  /* 滚动容器 */
  .scrollContainer {
    flex: 1;
    width: 0; // 防止溢出
    white-space: nowrap;

    /* 隐藏滚动条 */
    ::-webkit-scrollbar {
      display: none;
    }
  }

  .cate {
    position: relative;
    display: inline-flex; // 改为 inline-flex
    gap: 40rpx;
    padding: 0 4rpx; // 添加两端内边距

    .cateItem {
      font-size: 36rpx;
      font-weight: 400;
      line-height: 48rpx;
      color: $color-text;
      white-space: nowrap; // 文字不换行
    }
    .itemActive {
      color: $brand-color-primary;
    }
    .fubiao {
      position: absolute;
      left: 4rpx;
      bottom: -10rpx;
      width: 64rpx;
      height: 8rpx;
      border-radius: 4rpx;
      background-color: $brand-color-primary;
      will-change: transform;
    }
  }

  /*发布文章*/
  .send {
    font-size: 56rpx;
    color: #61666d;
    margin-left: 24rpx; // 添加左边距
  }
}
</style>
