import { Category } from '@/types'
import { apiRequest } from './client'

export const categoryApi = {
  // 获取所有分类
  getAll: (): Promise<Category[]> => {
    return apiRequest<Category[]>('/categories')
  },

  // 根据ID获取分类
  getById: (id: number): Promise<Category> => {
    return apiRequest<Category>(`/categories/${id}`)
  },

  // 创建分类
  create: (data: { name: string; description?: string }): Promise<Category> => {
    return apiRequest<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // 更新分类
  update: (id: number, data: { name?: string; description?: string }): Promise<Category> => {
    return apiRequest<Category>(`/categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },

  // 删除分类
  delete: (id: number): Promise<void> => {
    return apiRequest<void>(`/categories/${id}`, {
      method: 'DELETE',
    })
  },
} 