export interface KakaoMaps {
  load(callback: () => void): void
  Map: new (container: HTMLElement, options: { center: unknown; level: number }) => {
    getBounds(): { getSouthWest(): { getLat(): number; getLng(): number }; getNorthEast(): { getLat(): number; getLng(): number } }
    setCenter(position: unknown): void
  }
  LatLng: new (lat: number, lng: number) => unknown
  Marker: new (options: { position: unknown }) => { setMap(map: unknown): void }
  MarkerClusterer: new (options: { map: unknown; averageCenter: boolean; minLevel: number }) => { addMarkers(markers: unknown[]): void; clear(): void }
  event: { addListener(target: unknown, event: string, callback: () => void): void }
}

declare global { interface Window { kakao?: { maps: KakaoMaps } } }

let loading: Promise<KakaoMaps> | null = null

export const loadKakaoMap = (): Promise<KakaoMaps> => {
  if (window.kakao?.maps) return Promise.resolve(window.kakao.maps)
  if (loading) return loading
  const appKey = import.meta.env.VITE_KAKAO_MAP_JAVASCRIPT_KEY || import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY
  if (!appKey) return Promise.reject(new Error('카카오 지도 JavaScript 키가 설정되지 않았습니다.'))
  loading = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false&libraries=clusterer`
    script.async = true
    script.onload = () => window.kakao?.maps.load(() => resolve(window.kakao!.maps))
    script.onerror = () => reject(new Error('카카오 지도 SDK를 불러오지 못했습니다.'))
    document.head.appendChild(script)
  })
  return loading
}
