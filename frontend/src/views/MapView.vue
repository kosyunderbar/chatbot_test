<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import axios from 'axios'
import { getMapLocations } from '../api/mapApi'
import { loadKakaoMap, type KakaoMaps } from '../utils/kakaoMapLoader'
import type { MapLocation } from '../types/map'

const mapElement = ref<HTMLElement | null>(null)
const selected = ref<MapLocation | null>(null)
const category = ref('all')
const markerCount = ref(0)
const total = ref(0)
const errorMessage = ref('')
const categories = [{ value: 'all', label: '전체' }, { value: 'attraction', label: '관광지' }, { value: 'culture', label: '문화' }, { value: 'festival', label: '축제' }, { value: 'course', label: '코스' }, { value: 'leisure', label: '레저' }, { value: 'accommodation', label: '숙박' }, { value: 'shopping', label: '쇼핑' }]

let kakao: KakaoMaps
let map: any
let clusterer: any
let idleTimer: ReturnType<typeof setTimeout> | undefined
let controller: AbortController | undefined

const updateMarkers = async () => {
  if (!map || !kakao) return
  controller?.abort()
  controller = new AbortController()
  const bounds = map.getBounds()
  const southWest = bounds.getSouthWest()
  const northEast = bounds.getNorthEast()
  try {
    const response = await getMapLocations({ minLat: southWest.getLat(), maxLat: northEast.getLat(), minLng: southWest.getLng(), maxLng: northEast.getLng(), category: category.value, signal: controller.signal })
    const locations = response.data.items
    clusterer.clear()
    const markers = locations.map((location) => {
      const marker = new kakao.Marker({ position: new kakao.LatLng(location.latitude, location.longitude) })
      kakao.event.addListener(marker, 'click', () => { selected.value = location })
      return marker
    })
    clusterer.addMarkers(markers)
    markerCount.value = locations.length
    total.value = response.data.total
    errorMessage.value = ''
  } catch (error) {
    if (!axios.isCancel(error)) errorMessage.value = '지도 위치 정보를 불러오지 못했습니다.'
  }
}

const scheduleMarkerUpdate = () => {
  if (idleTimer) clearTimeout(idleTimer)
  idleTimer = setTimeout(updateMarkers, 300)
}

watch(category, () => { selected.value = null; scheduleMarkerUpdate() })

onMounted(async () => {
  try {
    kakao = await loadKakaoMap()
    if (!mapElement.value) return
    map = new kakao.Map(mapElement.value, { center: new kakao.LatLng(37.5665, 126.978), level: 8 })
    clusterer = new kakao.MarkerClusterer({ map, averageCenter: true, minLevel: 5 })
    kakao.event.addListener(map, 'idle', scheduleMarkerUpdate)
    await updateMarkers()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '지도를 초기화하지 못했습니다.'
  }
})

onBeforeUnmount(() => { controller?.abort(); if (idleTimer) clearTimeout(idleTimer) })
</script>

<template>
  <main class="bg-gray-50 py-8">
    <section class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mb-5 flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div><h1 class="text-2xl font-semibold text-gray-900">서울 관광 지도</h1><p class="mt-1 text-sm text-gray-600">지도를 움직여 주변 관광지를 찾아보세요.</p></div>
        <select v-model="category" class="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm"><option v-for="option in categories" :key="option.value" :value="option.value">{{ option.label }}</option></select>
      </div>
      <p v-if="errorMessage" class="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{{ errorMessage }}</p>
      <div class="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"><div ref="mapElement" class="h-[620px] w-full" /><p class="border-t px-4 py-2 text-xs text-gray-500">현재 영역: {{ markerCount }}개 표시 / {{ total }}개 검색</p></div>
        <aside class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"><template v-if="selected"><img v-if="selected.image_url" :src="selected.image_url" :alt="selected.title" class="mb-4 h-44 w-full rounded-xl object-cover" /><div v-else class="mb-4 flex h-44 items-center justify-center rounded-xl bg-gray-100 text-sm text-gray-500">이미지 없음</div><h2 class="text-xl font-semibold text-gray-900">{{ selected.title }}</h2><p class="mt-3 text-sm leading-6 text-gray-600">{{ selected.address || '주소 정보 없음' }}</p></template><div v-else class="flex h-full min-h-48 items-center justify-center text-center text-sm text-gray-500">지도 위의 마커를 클릭하면<br />사진, 이름, 주소를 확인할 수 있습니다.</div></aside>
      </div>
    </section>
  </main>
</template>
