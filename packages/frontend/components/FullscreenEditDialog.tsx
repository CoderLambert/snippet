'use client'

import { useState, useEffect } from 'react'
import { Maximize2, Minimize2, Save, X, Code2, Eye, Split } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
// 移除CustomTabs引用
import { Snippet, Tag, Category, CreateSnippetDto } from '@/types'
import CodeEditor from './CodeEditor'
import HtmlPreview from './HtmlPreview'

interface FullscreenEditDialogProps {
  isOpen: boolean
  onClose: () => void
  snippet?: Snippet
  tags: Tag[]
  categories: Category[]
  onSubmit: (data: CreateSnippetDto) => Promise<boolean>
  isLoading?: boolean
}

export default function FullscreenEditDialog({
  isOpen,
  onClose,
  snippet,
  tags,
  categories,
  onSubmit,
  isLoading = false,
}: FullscreenEditDialogProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [activeTab, setActiveTab] = useState('edit')
  const [formData, setFormData] = useState<CreateSnippetDto>({
    title: '',
    description: '',
    language: '',
    code: '',
    categoryId: 0,
    tagIds: [],
  })

  // 检查是否为HTML代码 - 更严格的判断
  const isHtmlCode = formData.language.toLowerCase() === 'html' || 
                     formData.language.toLowerCase() === 'htm' ||
                     formData.language.toLowerCase() === 'xhtml'



  useEffect(() => {
    if (isOpen) {
      if (snippet) {
        setFormData({
          title: snippet.title,
          description: snippet.description || '',
          language: snippet.language,
          code: snippet.code,
          categoryId: snippet.categoryId,
          tagIds: snippet.tags.map(tag => tag.id),
        })
      } else {
        // 重置表单
        setFormData({
          title: '',
          description: '',
          language: '',
          code: '',
          categoryId: 0,
          tagIds: [],
        })
      }
    } else {
      // 对话框关闭时重置全屏状态
      setIsFullscreen(false)
      setActiveTab('edit')
    }
  }, [snippet, isOpen])

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const success = await onSubmit(formData)
    if (success) {
      handleClose()
    }
  }

  const handleClose = () => {
    console.log('FullscreenEditDialog: handleClose called')
    setIsFullscreen(false)
    setActiveTab('edit')
    onClose()
  }

  const handleTagToggle = (tagId: number) => {
    setFormData(prev => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter(id => id !== tagId)
        : [...prev.tagIds, tagId]
    }))
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + S 保存
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        handleSubmit()
      }
      // ESC 退出全屏或关闭对话框
      if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false)
        } else {
          handleClose()
        }
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, isFullscreen, handleClose])

  // 全屏模式下的布局
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-background">
        {/* 全屏工具栏 */}
        <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Code2 className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold">
                {snippet ? '编辑代码片段' : '创建代码片段'}
              </h2>
            </div>
            
            {/* 全屏模式标签切换 */}
            <div className="ml-4">
              <div className="flex space-x-1">
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setActiveTab('edit')
                  }}
                  className={`flex items-center gap-1 px-3 py-1 text-sm font-medium rounded transition-colors ${
                    activeTab === 'edit'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  type="button"
                >
                  <Code2 className="h-3 w-3" />
                  编辑
                </button>
                {isHtmlCode && (
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setActiveTab('preview')
                    }}
                    className={`flex items-center gap-1 px-3 py-1 text-sm font-medium rounded transition-colors ${
                      activeTab === 'preview'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    type="button"
                  >
                    <Eye className="h-3 w-3" />
                    预览
                  </button>
                )}
                {isHtmlCode && (
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setActiveTab('split')
                    }}
                    className={`flex items-center gap-1 px-3 py-1 text-sm font-medium rounded transition-colors ${
                      activeTab === 'split'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    type="button"
                  >
                    <Split className="h-3 w-3" />
                    分屏
                  </button>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setIsFullscreen(false)
              }}
              className="flex items-center gap-1"
            >
              <Minimize2 className="h-4 w-4" />
              退出全屏
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleSubmit()
              }}
              disabled={isLoading}
              className="flex items-center gap-1"
            >
              <Save className="h-4 w-4" />
              {isLoading ? '保存中...' : '保存'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleClose()
              }}
              className="flex items-center gap-1"
            >
              <X className="h-4 w-4" />
              关闭
            </Button>
          </div>
        </div>

        {/* 全屏内容区域 */}
        <div className="flex h-[calc(100vh-73px)]">
          {/* 编辑区域 */}
          {(activeTab === 'edit' || activeTab === 'split') && (
            <div className={`flex flex-col ${activeTab === 'split' ? 'w-1/2 border-r' : 'flex-1'}`}>
              {/* 表单字段 */}
              <div className="p-4 border-b bg-gray-50 dark:bg-gray-900/50">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="标题"
                    className="md:col-span-2"
                  />
                  <Input
                    value={formData.language}
                    onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                    placeholder="编程语言"
                  />
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData(prev => ({ ...prev, categoryId: Number(e.target.value) }))}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value={0}>选择分类</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="描述"
                  className="mt-4"
                />
              </div>
              
              {/* 代码编辑器 */}
              <div className="flex-1 min-h-0">
                <CodeEditor
                  value={formData.code}
                  onChange={(value) => setFormData(prev => ({ ...prev, code: value || '' }))}
                  language={formData.language}
                  height="calc(100vh - 200px)"
                  hideErrors={true}
                />
              </div>
            </div>
          )}

          {/* 预览区域 */}
          {(activeTab === 'preview' || activeTab === 'split') && isHtmlCode && (
            <div className={`flex flex-col ${activeTab === 'split' ? 'w-1/2' : 'flex-1'}`}>
              <div className="p-4 border-b bg-gray-50 dark:bg-gray-900/50">
                <h3 className="font-medium">实时预览</h3>
              </div>
              <div className="flex-1 min-h-0">
                <HtmlPreview htmlCode={formData.code} className="h-full" />
              </div>
            </div>
          )}
        </div>

        {/* 标签选择悬浮面板 */}
        {tags.length > 0 && (
          <div className="absolute bottom-4 left-4 right-4 bg-background/95 backdrop-blur border rounded-lg p-4 max-h-32 overflow-y-auto">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400 mr-2">标签:</span>
              {tags.map((tag) => (
                <label key={tag.id} className="flex items-center space-x-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.tagIds.includes(tag.id)}
                    onChange={() => handleTagToggle(tag.id)}
                    className="rounded"
                  />
                  <span className="text-sm">{tag.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  // 普通对话框模式
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      // 只有在对话框被外部关闭时才调用handleClose
      if (!open) {
        handleClose()
      }
    }}>
      <DialogContent 
        className="max-w-6xl max-h-[95vh] overflow-hidden flex flex-col"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => {
          // 只在非全屏模式下允许ESC关闭
          if (!isFullscreen) {
            handleClose()
          }
          e.preventDefault()
        }}
      >
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Code2 className="h-5 w-5 text-blue-600" />
              {snippet ? '编辑代码片段' : '创建代码片段'}
            </DialogTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(true)}
              className="flex items-center gap-1"
            >
              <Maximize2 className="h-4 w-4" />
              全屏编辑
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto space-y-4 p-1">
            {/* 基本信息 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">标题 *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="输入代码片段标题"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">编程语言 *</label>
                <Input
                  value={formData.language}
                  onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                  placeholder="例如: JavaScript, Python, Java"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">描述</label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="描述这个代码片段的用途"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">分类 *</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData(prev => ({ ...prev, categoryId: Number(e.target.value) }))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                >
                  <option value={0}>选择分类</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 代码编辑器 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">代码 *</label>
              {isHtmlCode ? (
                <div 
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                  onMouseUp={(e) => e.stopPropagation()}
                >
                  <div className="w-full">
                    {/* 标签头部 */}
                    <div className="flex space-x-1 border-b border-gray-200 dark:border-gray-700 mb-4">
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setActiveTab('edit')
                        }}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                          activeTab === 'edit'
                            ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                        type="button"
                      >
                        <Code2 className="h-3 w-3" />
                        代码
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setActiveTab('preview')
                        }}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                          activeTab === 'preview'
                            ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                        type="button"
                      >
                        <Eye className="h-3 w-3" />
                        预览
                      </button>
                    </div>

                    {/* 标签内容 */}
                    <div>
                      {activeTab === 'edit' && (
                        <CodeEditor
                          value={formData.code}
                          onChange={(value) => setFormData(prev => ({ ...prev, code: value || '' }))}
                          language={formData.language}
                          height="300px"
                          hideErrors={true}
                        />
                      )}
                      {activeTab === 'preview' && (
                        <div className="border rounded-md" style={{ height: '300px' }}>
                          <HtmlPreview htmlCode={formData.code} className="h-full" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <CodeEditor
                  value={formData.code}
                  onChange={(value) => setFormData(prev => ({ ...prev, code: value || '' }))}
                  language={formData.language}
                  height="300px"
                  hideErrors={true}
                />
              )}
            </div>

            {/* 标签 */}
            {tags.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">标签</label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border rounded-md">
                  {tags.map((tag) => (
                    <label key={tag.id} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.tagIds.includes(tag.id)}
                        onChange={() => handleTagToggle(tag.id)}
                        className="rounded"
                      />
                      <span className="text-sm">{tag.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 底部按钮 */}
          <div className="flex-shrink-0 flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              取消
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? '保存中...' : (snippet ? '更新' : '创建')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 