import { posts as mockPosts } from '../mock/posts'
import type { BoardPost, PostApiItem, PostCategory } from '../types/board'

const postMetadata: Record<number, { author: string; viewCount: number; commentCount: number }> = {
  1: { author: '민지', viewCount: 128, commentCount: 5 },
  2: { author: '도윤', viewCount: 102, commentCount: 3 },
  3: { author: '서연', viewCount: 86, commentCount: 2 },
  4: { author: '준호', viewCount: 145, commentCount: 6 },
  5: { author: '하린', viewCount: 71, commentCount: 4 },
  6: { author: '유진', viewCount: 94, commentCount: 3 },
  7: { author: '태현', viewCount: 112, commentCount: 5 },
  8: { author: '소희', viewCount: 63, commentCount: 2 },
  9: { author: '예린', viewCount: 88, commentCount: 4 },
  10: { author: '지훈', viewCount: 77, commentCount: 2 },
  11: { author: '은우', viewCount: 132, commentCount: 7 },
  12: { author: '나연', viewCount: 59, commentCount: 1 },
}

export const mapPostApiItemToBoardPost = (item: PostApiItem): BoardPost => {
  return {
    id: item.id,
    title: item.title,
    content: item.content,
    region: item.region ?? '',
    category: item.category ?? '',
    createdAt: item.created_at,
    updatedAt: item.updated_at,
    ...postMetadata[item.id],
  }
}

const sortByNewest = (items: BoardPost[]): BoardPost[] => {
  return [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export const getMockPosts = async (): Promise<BoardPost[]> => {
  return sortByNewest(mockPosts.map(mapPostApiItemToBoardPost))
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
  const item = mockPosts.find((postItem) => postItem.id === id)
  return item ? mapPostApiItemToBoardPost(item) : null
}
