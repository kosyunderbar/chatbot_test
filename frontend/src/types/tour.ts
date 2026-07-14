/**
 * Tour feature types.
 * API DTOs represent the raw payload shape, while UI types match the screen layer.
 */

export type TourCategory =
  | 'attraction'
  | 'leisure'
  | 'culture'
  | 'shopping'
  | 'accommodation'
  | 'course'
  | 'festival'

/**
 * API DTO for a single tour item.
 * This keeps the transport contract separate from the UI contract.
 */
export interface TourApiItem {
  contentid: string
  contenttypeid: string
  title: string
  addr1: string
  addr2: string
  tel?: string
  firstimage?: string
  firstimage2?: string
  mapx?: string
  mapy?: string
  zipcode?: string
  modifiedtime?: string
}

/**
 * API DTO for a tour list response.
 */
export interface TourApiResponse {
  region: string
  contentType: string
  contentTypeId: number
  total: number
  items: TourApiItem[]
}

/**
 * UI model used by the Tour screen and components.
 */
export interface TourItem {
  id: string
  title: string
  category: TourCategory
  address: string
  imageUrl: string
  thumbnailUrl: string
  longitude: number | null
  latitude: number | null
  telephone: string
}
