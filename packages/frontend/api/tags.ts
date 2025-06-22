import { Tag } from '@/types'
import { apiRequest } from './client'

export const tagApi = {
  // 获取所有标签
  getAll: (): Promise<Tag[]> => {
    return apiRequest<Tag[]>('/tags')
  },

  // 根据ID获取标签
  getById: (id: number): Promise<Tag> => {
    return apiRequest<Tag>(`/tags/${id}`)
  },

  // 创建标签
  create: (data: { name: string }): Promise<Tag> => {
    return apiRequest<Tag>('/tags', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // 更新标签
  update: (id: number, data: { name: string }): Promise<Tag> => {
    return apiRequest<Tag>(`/tags/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },

  // 删除标签
  delete: (id: number): Promise<void> => {
    return apiRequest<void>(`/tags/${id}`, {
      method: 'DELETE',
    })
  },
} 