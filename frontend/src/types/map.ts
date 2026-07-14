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
