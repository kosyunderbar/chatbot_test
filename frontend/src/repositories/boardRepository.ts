import {
  createPost,
  deletePost,
  deleteUploadedImage,
  getPostById,
  getPosts,
  getTags,
  searchPosts,
  togglePostLike,
  updatePost,
  uploadPostImage,
} from '../api/boardApi'
import type { BoardPost, PostFormData } from '../types/board'

const uploadImages = (files: File[]) => Promise.all(files.map(uploadPostImage))

export const getBoardPosts = getPosts
export const searchBoardPosts = searchPosts
export const getBoardPostById = getPostById
export const getTagSuggestions = getTags
export const deleteTemporaryImage = deleteUploadedImage

export const createBoardPost = async (form: PostFormData): Promise<BoardPost> => {
  const uploaded = await uploadImages(form.newImages)
  try {
    return await createPost({ title: form.title, content: form.content, password: form.password, region: form.region || undefined, category: form.category || undefined, tags: form.tags, image_ids: uploaded.map((image) => image.id) })
  } catch (error) {
    await Promise.allSettled(uploaded.map((image) => deleteUploadedImage(image.id)))
    throw error
  }
}

export const updateBoardPost = async (id: number, form: PostFormData): Promise<BoardPost> => {
  const uploaded = await uploadImages(form.newImages)
  try {
    return await updatePost(id, { title: form.title, content: form.content, password: form.password, region: form.region || undefined, category: form.category || undefined, tags: form.tags, image_ids: [...form.existingImages.map((image) => image.id), ...uploaded.map((image) => image.id)] })
  } catch (error) {
    await Promise.allSettled(uploaded.map((image) => deleteUploadedImage(image.id)))
    throw error
  }
}

export const removeBoardPost = (id: number, password: string) => deletePost(id, { password })
export const toggleBoardPostLike = togglePostLike
