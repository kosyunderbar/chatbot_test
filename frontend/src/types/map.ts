export interface MapLocation {
  id: string
  title: string
  address: string
  latitude: number
  longitude: number
  image_url: string | null
}

export interface MapLocationResponse {
  items: MapLocation[]
  total: number
}

export interface MapPopularPost {
  id: number
  title: string
  view_count: number
  comment_count: number
  like_count: number
}
