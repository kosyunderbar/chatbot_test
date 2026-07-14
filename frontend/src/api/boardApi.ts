import { posts } from '../mock/posts'
import type { BoardPost, PostCategory } from '../types/board'

const sortByNewest = (items: BoardPost[]): BoardPost[] => {
  return [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export const getMockPosts = async (): Promise<BoardPost[]> => {
  return sortByNewest(posts)
}

export const searchMockPosts = async (keyword: string, category: PostCategory = 'all'): Promise<BoardPost[]> => {
  const normalizedKeyword = keyword.trim().toLowerCase()
  const source = await getMockPosts()

  const filteredByCategory = category === 'all' ? source : source.filter((post) => post.category === category)

  if (!normalizedKeyword) {
    return filteredByCategory
  }

  return sortByNewest(
    filteredByCategory.filter((post) => {
      const haystack = `${post.title} ${post.content}`.toLowerCase()
      return haystack.includes(normalizedKeyword)
    }),
  )
}

export const getMockPostById = async (id: number): Promise<BoardPost | null> => {
  const post = posts.find((item) => item.id === id)
  return post ? { ...post } : null
}
