export type TourCategory =
  | 'attraction'
  | 'leisure'
  | 'culture'
  | 'shopping'
  | 'accommodation'
  | 'course'
  | 'festival'

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

export interface TourApiResponse {
  region: string
  contentType: string
  contentTypeId: number
  total: number
  items: TourApiItem[]
}

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
