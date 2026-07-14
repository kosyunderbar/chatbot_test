import { posts as mockPosts } from '../mock/posts'
import type {
  BoardPost,
  PostApiItem,
  PostCategory,
  PostCreateRequest,
  PostUpdateRequest,
  PostDeleteRequest,
} from '../types/board'

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

const postPasswordMap = new Map<number, string>([
  [1, 'pass1'],
  [2, 'pass2'],
  [3, 'pass3'],
  [4, 'pass4'],
  [5, 'pass5'],
  [6, 'pass6'],
  [7, 'pass7'],
  [8, 'pass8'],
  [9, 'pass9'],
  [10, 'pass10'],
  [11, 'pass11'],
  [12, 'pass12'],
])

let mutablePosts: PostApiItem[] = [...mockPosts]
let nextPostId = Math.max(...mutablePosts.map((item) => item.id), 0) + 1

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
  return sortByNewest(mutablePosts.map(mapPostApiItemToBoardPost))
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
  const item = mutablePosts.find((postItem) => postItem.id === id)
  return item ? mapPostApiItemToBoardPost(item) : null
}

export const createMockPost = async (payload: PostCreateRequest): Promise<BoardPost> => {
  const createdAt = new Date().toISOString().slice(0, 10)
  const newPost: PostApiItem = {
    id: nextPostId,
    title: payload.title,
    content: payload.content,
    region: payload.region ?? null,
    category: payload.category ?? null,
    created_at: createdAt,
    updated_at: createdAt,
  }

  mutablePosts = [newPost, ...mutablePosts]
  postPasswordMap.set(newPost.id, payload.password)
  nextPostId += 1

  return mapPostApiItemToBoardPost(newPost)
}

export const updateMockPost = async (id: number, payload: PostUpdateRequest): Promise<BoardPost> => {
  const postIndex = mutablePosts.findIndex((item) => item.id === id)
  if (postIndex < 0) {
    throw new Error('게시글을 찾을 수 없습니다.')
  }

  const savedPassword = postPasswordMap.get(id)
  if (savedPassword !== payload.password) {
    throw new Error('비밀번호가 일치하지 않습니다.')
  }

  const updatedAt = new Date().toISOString().slice(0, 10)
  const currentPost = mutablePosts[postIndex]
  const updatedPost: PostApiItem = {
    ...currentPost,
    title: payload.title,
    content: payload.content,
    region: payload.region ?? null,
    category: payload.category ?? null,
    updated_at: updatedAt,
  }

  mutablePosts = [...mutablePosts.slice(0, postIndex), updatedPost, ...mutablePosts.slice(postIndex + 1)]
  return mapPostApiItemToBoardPost(updatedPost)
}

export const deleteMockPost = async (id: number, payload: PostDeleteRequest): Promise<void> => {
  const postIndex = mutablePosts.findIndex((item) => item.id === id)
  if (postIndex < 0) {
    throw new Error('게시글을 찾을 수 없습니다.')
  }

  const savedPassword = postPasswordMap.get(id)
  if (savedPassword !== payload.password) {
    throw new Error('비밀번호가 일치하지 않습니다.')
  }

  mutablePosts = [...mutablePosts.slice(0, postIndex), ...mutablePosts.slice(postIndex + 1)]
  postPasswordMap.delete(id)
}
