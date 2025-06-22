import { Snippet, CreateSnippetDto, UpdateSnippetDto } from '@/types'
import { apiRequest } from './client'

export const snippetApi = {
  // 获取所有代码片段
  getAll: (): Promise<Snippet[]> => {
    return apiRequest<Snippet[]>('/snippets')
  },

  // 根据ID获取代码片段
  getById: (id: number): Promise<Snippet> => {
    return apiRequest<Snippet>(`/snippets/${id}`)
  },

  // 创建代码片段
  create: (data: CreateSnippetDto): Promise<Snippet> => {
    return apiRequest<Snippet>('/snippets', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // 更新代码片段
  update: (id: number, data: UpdateSnippetDto): Promise<Snippet> => {
    return apiRequest<Snippet>(`/snippets/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },

  // 删除代码片段
  delete: (id: number): Promise<void> => {
    return apiRequest<void>(`/snippets/${id}`, {
      method: 'DELETE',
    })
  },
} 