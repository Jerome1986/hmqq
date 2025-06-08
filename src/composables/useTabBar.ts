import { ref, onMounted } from 'vue'

export function useTabBar() {
  const tabBarHeight = ref<number>(50)

  const updateHeight = (): void => {
    const systemInfo = uni.getSystemInfoSync()
    tabBarHeight.value = systemInfo.safeArea?.bottom
      ? systemInfo.windowHeight - systemInfo.safeArea.bottom
      : 50
  }

  onMounted(() => {
    updateHeight()
    uni.onWindowResize(updateHeight)
  })

  return { tabBarHeight }
}
