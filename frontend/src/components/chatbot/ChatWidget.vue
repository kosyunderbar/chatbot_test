<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import ChatFloatingButton from './ChatFloatingButton.vue'
import ChatWindow from './ChatWindow.vue'

const isOpen = ref(false)
const isFullscreen = ref(false)
const width = ref(420)
const height = ref(650)
const isMobile = ref(false)
const isResizing = ref(false)
const startX = ref(0)
const startY = ref(0)
const startWidth = ref(420)
const startHeight = ref(650)

const openChat = () => {
  isOpen.value = true
  isFullscreen.value = false
  width.value = 420
  height.value = 650
}

const closeChat = () => {
  isOpen.value = false
  isFullscreen.value = false
}

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
}

const updateViewport = () => {
  isMobile.value = window.innerWidth < 768
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

const startResize = (event: PointerEvent) => {
  if (isFullscreen.value) return
  isResizing.value = true
  startX.value = event.clientX
  startY.value = event.clientY
  startWidth.value = width.value
  startHeight.value = height.value
  event.preventDefault()
}

const onPointerMove = (event: PointerEvent) => {
  if (!isResizing.value) return
  const deltaX = event.clientX - startX.value
  const deltaY = event.clientY - startY.value
  const maxWidth = Math.max(320, Math.floor(window.innerWidth * 0.9))
  const maxHeight = Math.max(400, Math.floor(window.innerHeight * 0.85))

  width.value = clamp(startWidth.value + deltaX, 320, maxWidth)
  height.value = clamp(startHeight.value + deltaY, 400, maxHeight)
}

const stopResize = () => {
  isResizing.value = false
}

onMounted(() => {
  updateViewport()
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', stopResize)
  window.addEventListener('resize', updateViewport)
})

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', stopResize)
  window.removeEventListener('resize', updateViewport)
})

const panelClasses = computed(() => {
  return isFullscreen.value
    ? 'fixed inset-0 z-[60] rounded-none bg-white'
    : 'fixed bottom-6 right-6 z-[60] rounded-3xl border border-gray-200 bg-white shadow-2xl overflow-hidden md:bottom-6 md:right-6'
})

const panelStyle = computed(() => {
  if (isFullscreen.value) {
    return {
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
    }
  }

  if (isMobile.value) {
    return {
      width: 'calc(100vw - 32px)',
      height: 'calc(100vh - 100px)',
      maxWidth: 'calc(100vw - 32px)',
      maxHeight: 'calc(100vh - 100px)',
    }
  }

  return {
    width: `${width.value}px`,
    height: `${height.value}px`,
    maxWidth: '90vw',
    maxHeight: '85vh',
  }
})
</script>

<template>
  <div>
    <Transition name="chat-fade">
      <div v-if="isOpen" class="fixed inset-0 z-[55] bg-black/10" @click="closeChat" />
    </Transition>

    <Transition name="chat-scale">
      <div v-if="isOpen" :class="panelClasses" :style="panelStyle" @click.stop>
        <ChatWindow
          :is-fullscreen="isFullscreen"
          :width="width"
          :height="height"
          @close="closeChat"
          @toggle-fullscreen="toggleFullscreen"
          @resize-start="startResize"
        />
      </div>
    </Transition>

    <ChatFloatingButton :is-open="isOpen" @open="openChat" />
  </div>
</template>

<style scoped>
.chat-fade-enter-active,
.chat-fade-leave-active {
  transition: opacity 0.2s ease;
}

.chat-fade-enter-from,
.chat-fade-leave-to {
  opacity: 0;
}

.chat-scale-enter-active,
.chat-scale-leave-active {
  transition: all 0.2s ease;
}

.chat-scale-enter-from,
.chat-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
