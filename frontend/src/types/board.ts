export type PostCategory = 'all' | 'free' | 'question' | 'recommendation'

export interface BoardPost {
  id: number
  title: string
  category: Exclude<PostCategory, 'all'>
  author: string
  createdAt: string
  viewCount: number
  commentCount: number
  content: string
}
