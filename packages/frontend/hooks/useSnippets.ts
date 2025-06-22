import { useState, useEffect, useCallback } from 'react'
import { Snippet, Tag, Category, CreateSnippetDto, UpdateSnippetDto, SnippetFilters } from '@/types'
import { snippetApi } from '@/api/snippets'
import { tagApi } from '@/api/tags'
import { categoryApi } from '@/api/categories'
import { ApiError } from '@/api/client'

export const useSnippets = () => {
  const [snippets, setSnippets] = useState<Snippet[]>([])
  const [filteredSnippets, setFilteredSnippets] = useState<Snippet[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 获取所有数据
  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const [snippetsData, tagsData, categoriesData] = await Promise.all([
        snippetApi.getAll(),
        tagApi.getAll(),
        categoryApi.getAll(),
      ])
      
      setSnippets(snippetsData)
      setFilteredSnippets(snippetsData)
      setTags(tagsData)
      setCategories(categoriesData)
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : '获取数据失败'
      setError(errorMessage)
      console.error('获取数据失败:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // 创建代码片段
  const createSnippet = useCallback(async (data: CreateSnippetDto) => {
    try {
      await snippetApi.create(data)
      await fetchData() // 重新获取数据
      return true
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : '创建代码片段失败'
      setError(errorMessage)
      console.error('创建失败:', err)
      return false
    }
  }, [fetchData])

  // 更新代码片段
  const updateSnippet = useCallback(async (id: number, data: UpdateSnippetDto) => {
    try {
      await snippetApi.update(id, data)
      await fetchData() // 重新获取数据
      return true
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : '更新代码片段失败'
      setError(errorMessage)
      console.error('更新失败:', err)
      return false
    }
  }, [fetchData])

  // 删除代码片段
  const deleteSnippet = useCallback(async (id: number) => {
    if (!confirm('确定要删除这个代码片段吗？')) return false
    
    try {
      await snippetApi.delete(id)
      await fetchData() // 重新获取数据
      return true
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : '删除代码片段失败'
      setError(errorMessage)
      console.error('删除失败:', err)
      return false
    }
  }, [fetchData])

  // 过滤代码片段
  const filterSnippets = useCallback((filters: SnippetFilters) => {
    let filtered = snippets

    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase()
      filtered = filtered.filter(snippet =>
        snippet.title.toLowerCase().includes(searchLower) ||
        snippet.description?.toLowerCase().includes(searchLower) ||
        snippet.code.toLowerCase().includes(searchLower) ||
        snippet.tags.some(tag => tag.name.toLowerCase().includes(searchLower))
      )
    }

    if (filters.languageFilter) {
      filtered = filtered.filter(snippet =>
        snippet.language.toLowerCase().includes(filters.languageFilter.toLowerCase())
      )
    }

    if (filters.categoryFilter) {
      filtered = filtered.filter(snippet =>
        snippet.category.id === Number(filters.categoryFilter)
      )
    }

    setFilteredSnippets(filtered)
  }, [snippets])

  // 清除错误
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    snippets,
    filteredSnippets,
    tags,
    categories,
    loading,
    error,
    fetchData,
    createSnippet,
    updateSnippet,
    deleteSnippet,
    filterSnippets,
    clearError,
  }
} 