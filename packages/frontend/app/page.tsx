'use client'

import { useState, useEffect } from 'react'
import { Plus, Code, Download, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Snippet, SnippetFilters, CreateSnippetDto } from '@/types'
import { useSnippets } from '@/hooks/useSnippets'
import SnippetCard from '@/components/SnippetCard'
import SnippetForm from '@/components/SnippetForm'
import SearchAndFilter from '@/components/SearchAndFilter'
import { importTailwindSnippets } from '@/scripts/importSnippets'

export default function Home() {
  const {
    filteredSnippets,
    tags,
    categories,
    loading,
    error,
    createSnippet,
    updateSnippet,
    deleteSnippet,
    filterSnippets,
    clearError,
    fetchData,
  } = useSnippets()

  const [filters, setFilters] = useState<SnippetFilters>({
    searchTerm: '',
    languageFilter: '',
    categoryFilter: '',
  })

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingSnippet, setEditingSnippet] = useState<Snippet | null>(null)
  const [isImporting, setIsImporting] = useState(false)

  // 应用过滤器
  useEffect(() => {
    filterSnippets(filters)
  }, [filters, filterSnippets])

  // 处理创建代码片段
  const handleCreateSnippet = async (data: CreateSnippetDto) => {
    const success = await createSnippet(data)
    if (success) {
      setIsCreateDialogOpen(false)
    }
    return success
  }

  // 处理更新代码片段
  const handleUpdateSnippet = async (data: CreateSnippetDto) => {
    if (!editingSnippet) return false
    
    const success = await updateSnippet(editingSnippet.id, data)
    if (success) {
      setIsEditDialogOpen(false)
      setEditingSnippet(null)
    }
    return success
  }

  // 处理编辑代码片段
  const handleEditSnippet = (snippet: Snippet) => {
    setEditingSnippet(snippet)
    setIsEditDialogOpen(true)
  }

  // 处理删除代码片段
  const handleDeleteSnippet = async (id: number) => {
    await deleteSnippet(id)
  }

  // 处理保存代码片段
  const handleSaveSnippet = async (id: number, code: string) => {
    const snippet = filteredSnippets.find(s => s.id === id)
    if (!snippet) return false
    
    const success = await updateSnippet(id, {
      title: snippet.title,
      description: snippet.description,
      code: code,
      language: snippet.language,
      categoryId: snippet.category.id,
      tagIds: snippet.tags.map(tag => tag.id),
    })
    
    return success
  }

  // 处理过滤器变化
  const handleFiltersChange = (newFilters: SnippetFilters) => {
    setFilters(newFilters)
  }

  // 关闭创建对话框
  const handleCloseCreateDialog = () => {
    setIsCreateDialogOpen(false)
  }

  // 关闭编辑对话框
  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false)
    setEditingSnippet(null)
  }

  // 导入 TailwindCSS 示例
  const handleImportExamples = async () => {
    if (isImporting) return

    setIsImporting(true)
    try {
      const result = await importTailwindSnippets()
      if (result.success) {
        alert(`🎉 成功导入 ${result.count} 个 TailwindCSS 示例代码片段！`)
        await fetchData() // 刷新数据
      } else {
        alert('❌ 导入失败，请检查控制台错误信息')
      }
    } catch (error) {
      console.error('导入失败:', error)
      alert('❌ 导入过程中出现错误')
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* 页头 */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Code className="h-8 w-8" />
            代码片段管理系统
          </h1>
          <p className="text-muted-foreground mt-2">管理和搜索您的代码片段</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleImportExamples}
            disabled={isImporting}
          >
            <Download className="h-4 w-4 mr-2" />
            {isImporting ? '导入中...' : '导入 TailwindCSS 示例'}
          </Button>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                添加代码片段
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>创建新的代码片段</DialogTitle>
              <DialogDescription>
                添加一个新的代码片段到您的收藏中
              </DialogDescription>
            </DialogHeader>
            
            <SnippetForm
              tags={tags}
              categories={categories}
              onSubmit={handleCreateSnippet}
              onCancel={handleCloseCreateDialog}
              isLoading={loading}
            />
                      </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="flex justify-between items-center">
            <p className="text-red-800">{error}</p>
            <Button variant="ghost" size="sm" onClick={clearError}>
              关闭
            </Button>
          </div>
        </div>
      )}

      {/* 搜索和过滤 */}
      <SearchAndFilter
        filters={filters}
        categories={categories}
        onFiltersChange={handleFiltersChange}
      />

      {/* 搜索结果统计 */}
      {!loading && (filters.searchTerm || filters.languageFilter || filters.categoryFilter) && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                搜索结果: 找到 {filteredSnippets.length} 个代码片段
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
              {filters.searchTerm && (
                <span className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded">
                  关键词: "{filters.searchTerm}"
                </span>
              )}
              {filters.languageFilter && (
                <span className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded">
                  语言: {filters.languageFilter}
                </span>
              )}
              {filters.categoryFilter && (
                <span className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded">
                  分类: {categories.find(c => c.id === Number(filters.categoryFilter))?.name}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 加载状态 */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">加载中...</p>
        </div>
      )}

      {/* 代码片段网格 */}
      {!loading && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredSnippets.map((snippet) => (
            <SnippetCard
              key={snippet.id}
              snippet={snippet}
              onEdit={handleEditSnippet}
              onDelete={handleDeleteSnippet}
              onSave={handleSaveSnippet}
              searchTerm={filters.searchTerm}
            />
          ))}
        </div>
      )}

      {/* 编辑对话框 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>编辑代码片段</DialogTitle>
            <DialogDescription>
              修改代码片段的信息
            </DialogDescription>
          </DialogHeader>
          
          {editingSnippet && (
            <SnippetForm
              snippet={editingSnippet}
              tags={tags}
              categories={categories}
              onSubmit={handleUpdateSnippet}
              onCancel={handleCloseEditDialog}
              isLoading={loading}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* 空状态 */}
      {!loading && filteredSnippets.length === 0 && (
        <div className="text-center py-12">
          <Code className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold">没有找到代码片段</h3>
          <p className="text-muted-foreground">
            {filters.searchTerm || filters.languageFilter || filters.categoryFilter
              ? '尝试调整搜索条件'
              : '开始创建您的第一个代码片段'}
          </p>
        </div>
      )}
    </div>
  )
} 