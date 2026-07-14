/**
 * Tour feature types
 * Separates backend API DTOs from frontend UI types
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
 * Backend API DTO for a single tour item
 * Uses snake_case to match backend naming convention
 */
export interface TourApiItem {
  contentid: string
  contenttypeid: string
  title: string
  addr1: string
  addr2: string
  tel: string
  firstimage: string
  firstimage2: string
  mapx: string
  mapy: string
  zipcode: string
  modifiedtime: string
}

/**
 * Backend API response DTO for tour list
 */
export interface TourApiResponse {
  region: string
  contentType: string
  contentTypeId: number
  total: number
  items: TourApiItem[]
}

/**
 * Frontend UI type for displaying tour information
 * Uses camelCase naming for consistency with UI layer
 * Derived from TourApiItem during transformation
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
