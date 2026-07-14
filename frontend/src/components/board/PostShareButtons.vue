<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

interface Props { title?: string; description?: string; shareUrl?: string }
const props = withDefaults(defineProps<Props>(), { title: '게시글', description: '', shareUrl: '' })
const statusMessage = ref('')
const kakaoReady = ref(false)

type KakaoWindow = Window & { Kakao?: { init: (key: string) => void; isInitialized: () => boolean; Share?: { sendDefault: (payload: unknown) => void } } }

const resolvedShareUrl = computed(() => props.shareUrl || window.location.href)
const canUseWebShare = computed(() => 'share' in navigator)

const initializeKakao = () => {
  const key = import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY
  const kakao = (window as KakaoWindow).Kakao
  if (!key || !kakao) return false
  if (!kakao.isInitialized()) kakao.init(key)
  return Boolean(kakao.Share?.sendDefault)
}

onMounted(() => {
  kakaoReady.value = initializeKakao()
  if (!kakaoReady.value) statusMessage.value = '카카오 SDK 또는 JavaScript 키를 확인해 주세요.'
})

const copyLink = async () => { try { await navigator.clipboard.writeText(resolvedShareUrl.value); statusMessage.value = '링크를 복사했습니다.' } catch { statusMessage.value = '링크 복사에 실패했습니다.' } }
const shareWithWebApi = async () => { try { await navigator.share({ title: props.title, text: props.description, url: resolvedShareUrl.value }) } catch { /* user cancellation */ } }
const shareWithKakao = () => {
  const kakao = (window as KakaoWindow).Kakao
  if (!kakaoReady.value || !kakao?.Share) { statusMessage.value = '카카오 JavaScript 키를 설정해 주세요.'; return }
  kakao.Share.sendDefault({
    objectType: 'feed',
    content: { title: props.title, description: props.description.slice(0, 200), imageUrl: `${window.location.origin}/favicon.svg`, link: { webUrl: resolvedShareUrl.value, mobileWebUrl: resolvedShareUrl.value } },
    buttons: [{ title: '게시글 보기', link: { webUrl: resolvedShareUrl.value, mobileWebUrl: resolvedShareUrl.value } }],
  })
}
</script>

<template>
  <div class="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">
    <p class="text-sm text-gray-600">이 게시글을 공유해 보세요.</p>
    <div class="flex flex-wrap gap-2">
      <button type="button" class="rounded-xl border border-sky-200 bg-white px-3 py-2 text-sm font-medium text-sky-700" @click="copyLink">링크 복사</button>
      <button v-if="canUseWebShare" type="button" class="rounded-xl border border-emerald-200 bg-white px-3 py-2 text-sm font-medium text-emerald-700" @click="shareWithWebApi">공유</button>
      <button type="button" class="rounded-xl border border-yellow-300 bg-yellow-300 px-3 py-2 text-sm font-medium text-gray-900" @click="shareWithKakao">카카오톡 공유</button>
    </div>
    <p v-if="statusMessage" class="text-sm text-sky-700">{{ statusMessage }}</p>
  </div>
</template>
