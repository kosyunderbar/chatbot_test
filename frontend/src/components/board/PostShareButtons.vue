<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  title?: string
  description?: string
  shareUrl?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '게시글',
  description: '',
  shareUrl: '',
})

const statusMessage = ref('')

interface KakaoLinkPayload {
  objectType: string
  text: string
  link: {
    webUrl: string
    mobileWebUrl: string
  }
}

type KakaoWindow = Window & {
  Kakao?: {
    Link?: {
      sendDefault?: (payload: KakaoLinkPayload) => void
    }
  }
}

const resolvedShareUrl = computed(() => {
  if (props.shareUrl) {
    return props.shareUrl
  }

  if (typeof window !== 'undefined') {
    return window.location.href
  }

  return ''
})

const canUseWebShare = computed(() => {
  return typeof window !== 'undefined' && typeof navigator !== 'undefined' && 'share' in navigator
})

const canUseKakao = computed(() => {
  if (typeof window === 'undefined') {
    return false
  }

  const kakaoWindow = window as KakaoWindow
  return Boolean(kakaoWindow.Kakao?.Link?.sendDefault)
})

const copyLink = async () => {
  if (!resolvedShareUrl.value) {
    return
  }

  try {
    await navigator.clipboard.writeText(resolvedShareUrl.value)
    statusMessage.value = '링크가 복사되었습니다.'
    window.alert('링크가 복사되었습니다.')
  } catch {
    statusMessage.value = '링크 복사에 실패했습니다.'
  }
}

const shareWithWebApi = async () => {
  if (!canUseWebShare.value || !resolvedShareUrl.value) {
    return
  }

  try {
    await navigator.share({
      title: props.title,
      text: props.description,
      url: resolvedShareUrl.value,
    })
  } catch {
    statusMessage.value = ''
  }
}

const shareWithKakao = () => {
  if (!canUseKakao.value || !resolvedShareUrl.value) {
    return
  }

  const kakaoWindow = window as KakaoWindow
  kakaoWindow.Kakao?.Link?.sendDefault?.({
    objectType: 'text',
    text: props.title,
    link: {
      webUrl: resolvedShareUrl.value,
      mobileWebUrl: resolvedShareUrl.value,
    },
  })
}
</script>

<template>
  <div class="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">
    <p class="text-sm text-gray-600">이 게시글을 공유해 보세요.</p>
    <div class="flex flex-wrap gap-2">
      <button
        type="button"
        class="rounded-xl border border-sky-200 bg-white px-3 py-2 text-sm font-medium text-sky-700 transition hover:border-sky-300 hover:bg-sky-50"
        @click="copyLink"
      >
        링크 복사
      </button>
      <button
        v-if="canUseWebShare"
        type="button"
        class="rounded-xl border border-emerald-200 bg-white px-3 py-2 text-sm font-medium text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-50"
        @click="shareWithWebApi"
      >
        Web Share
      </button>
      <button
        type="button"
        class="rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm font-medium text-amber-700 transition hover:border-amber-300 hover:bg-amber-50"
        :disabled="!canUseKakao"
        :class="canUseKakao ? '' : 'cursor-not-allowed opacity-60'"
        @click="shareWithKakao"
      >
        카카오톡 공유
      </button>
    </div>
    <p v-if="statusMessage" class="text-sm text-sky-700">{{ statusMessage }}</p>
  </div>
</template>
