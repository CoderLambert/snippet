'use client'

import { useState } from 'react'
import { Eye, Copy, Edit, Trash2, Maximize2, Code2, Tag, Folder, Calendar, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Snippet } from '@/types'
import CodeViewer from './CodeViewer'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface SnippetGridProps {
  snippets: Snippet[]
  onEdit: (snippet: Snippet) => void
  onDelete: (id: number) => void
  onSave?: (id: number, code: string) => Promise<boolean>
  searchTerm?: string
  viewMode?: 'grid' | 'list' | 'compact'
}

// 高亮搜索词的工具函数
const highlightSearchTerm = (text: string, searchTerm: string) => {
  if (!searchTerm) return text
  
  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(regex)
  
  return parts.map((part, index) => {
    if (part.toLowerCase() === searchTerm.toLowerCase()) {
      return (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
          {part}
        </mark>
      )
    }
    return part
  })
}

// 获取语言图标颜色
const getLanguageColor = (language: string) => {
  const colors: Record<string, string> = {
    javascript: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    typescript: 'bg-blue-100 text-blue-800 border-blue-200',
    python: 'bg-green-100 text-green-800 border-green-200',
    html: 'bg-orange-100 text-orange-800 border-orange-200',
    css: 'bg-purple-100 text-purple-800 border-purple-200',
    react: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    vue: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    sql: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  }
  return colors[language.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200'
}

// 代码预览组件
function CodePreview({ code, language, searchTerm }: { code: string, language: string, searchTerm?: string }) {
  const lines = code.split('\n').slice(0, 8) // 只显示前8行
  const hasMore = code.split('\n').length > 8

  return (
    <div className="relative">
      <div className="bg-gray-50 dark:bg-gray-900 rounded-md p-3 font-mono text-xs overflow-hidden">
        <div className="space-y-1">
          {lines.map((line, index) => (
            <div key={index} className="flex">
              <span className="text-gray-400 w-6 text-right mr-3 select-none">
                {index + 1}
              </span>
              <span className="text-gray-800 dark:text-gray-200 flex-1 whitespace-pre-wrap break-all">
                {searchTerm ? highlightSearchTerm(line || ' ', searchTerm) : line || ' '}
              </span>
            </div>
          ))}
          {hasMore && (
            <div className="text-gray-400 text-center py-1 border-t border-gray-200 dark:border-gray-700">
              ... 还有 {code.split('\n').length - 8} 行
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// 单个代码片段卡片
function SnippetGridCard({ 
  snippet, 
  onEdit, 
  onDelete, 
  onSave, 
  searchTerm,
  viewMode = 'grid'
}: {
  snippet: Snippet
  onEdit: (snippet: Snippet) => void
  onDelete: (id: number) => void
  onSave?: (id: number, code: string) => Promise<boolean>
  searchTerm?: string
  viewMode?: 'grid' | 'list' | 'compact'
}) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet.code)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('复制失败:', err)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (viewMode === 'compact') {
    return (
      <div className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all duration-200">
        <div className={`px-2 py-1 rounded text-xs font-medium border ${getLanguageColor(snippet.language)}`}>
          {snippet.language}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate">
            {searchTerm ? highlightSearchTerm(snippet.title, searchTerm) : snippet.title}
          </h3>
          <p className="text-sm text-gray-500 truncate">
            {snippet.description && (searchTerm ? highlightSearchTerm(snippet.description, searchTerm) : snippet.description)}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">
            {formatDate(snippet.updatedAt)}
          </span>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 w-8 p-0">
              {isCopied ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setIsPreviewOpen(true)} className="h-8 w-8 p-0">
              <Eye className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onEdit(snippet)} className="h-8 w-8 p-0">
              <Edit className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(snippet.id)} className="h-8 w-8 p-0 text-red-500">
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (viewMode === 'list') {
    return (
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardContent className="p-6">
          <div className="flex gap-6">
            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold mb-1">
                    {searchTerm ? highlightSearchTerm(snippet.title, searchTerm) : snippet.title}
                  </h3>
                  {snippet.description && (
                    <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
                      {searchTerm ? highlightSearchTerm(snippet.description, searchTerm) : snippet.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 w-8 p-0">
                    {isCopied ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setIsPreviewOpen(true)} className="h-8 w-8 p-0">
                    <Maximize2 className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onEdit(snippet)} className="h-8 w-8 p-0">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(snippet.id)} className="h-8 w-8 p-0 text-red-500">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${getLanguageColor(snippet.language)}`}>
                  <Code2 className="h-3 w-3 mr-1" />
                  {snippet.language}
                </span>
                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                  <Folder className="h-3 w-3 mr-1" />
                  {searchTerm ? highlightSearchTerm(snippet.category.name, searchTerm) : snippet.category.name}
                </span>
                {snippet.tags.map((tag) => (
                  <span key={tag.id} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200">
                    <Tag className="h-3 w-3 mr-1" />
                    {searchTerm ? highlightSearchTerm(tag.name, searchTerm) : tag.name}
                  </span>
                ))}
                <span className="inline-flex items-center px-2 py-1 rounded text-xs text-gray-500">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDate(snippet.updatedAt)}
                </span>
              </div>
              
              <CodePreview code={snippet.code} language={snippet.language} searchTerm={searchTerm} />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // 默认网格视图
  return (
    <Card 
      className="h-fit hover:shadow-lg transition-all duration-200 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold truncate mb-1">
              {searchTerm ? highlightSearchTerm(snippet.title, searchTerm) : snippet.title}
            </h3>
            {snippet.description && (
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                {searchTerm ? highlightSearchTerm(snippet.description, searchTerm) : snippet.description}
              </p>
            )}
          </div>
          
          <div className={`flex gap-1 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 w-8 p-0" title="复制代码">
              {isCopied ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setIsPreviewOpen(true)} className="h-8 w-8 p-0" title="全屏预览">
              <Maximize2 className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onEdit(snippet)} className="h-8 w-8 p-0" title="编辑">
              <Edit className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(snippet.id)} className="h-8 w-8 p-0 text-red-500" title="删除">
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${getLanguageColor(snippet.language)}`}>
            <Code2 className="h-3 w-3 mr-1" />
            {snippet.language}
          </span>
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-200">
            <Folder className="h-3 w-3 mr-1" />
            {searchTerm ? highlightSearchTerm(snippet.category.name, searchTerm) : snippet.category.name}
          </span>
          {snippet.tags.slice(0, 2).map((tag) => (
            <span key={tag.id} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200">
              <Tag className="h-3 w-3 mr-1" />
              {searchTerm ? highlightSearchTerm(tag.name, searchTerm) : tag.name}
            </span>
          ))}
          {snippet.tags.length > 2 && (
            <span className="inline-flex items-center px-2 py-1 rounded text-xs text-gray-500">
              +{snippet.tags.length - 2} 更多
            </span>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <CodePreview code={snippet.code} language={snippet.language} searchTerm={searchTerm} />
        
        <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
          <span>{snippet.code.split('\n').length} 行代码</span>
          <span>{formatDate(snippet.updatedAt)}</span>
        </div>
      </CardContent>

      {/* 全屏预览对话框 */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full p-0">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle className="flex items-center gap-2">
              <Code2 className="h-5 w-5" />
              {snippet.title}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 p-6">
            <CodeViewer
              code={snippet.code}
              language={snippet.language}
              height="calc(95vh - 120px)"
              title={snippet.title}
              onSave={onSave ? (code) => onSave(snippet.id, code) : undefined}
              searchTerm={searchTerm}
            />
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default function SnippetGrid({ 
  snippets, 
  onEdit, 
  onDelete, 
  onSave, 
  searchTerm,
  viewMode = 'grid'
}: SnippetGridProps) {
  const getGridClass = () => {
    switch (viewMode) {
      case 'grid':
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
      case 'list':
        return 'space-y-4'
      case 'compact':
        return 'space-y-2'
      default:
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
    }
  }

  return (
    <div className={getGridClass()}>
      {snippets.map((snippet) => (
        <SnippetGridCard
          key={snippet.id}
          snippet={snippet}
          onEdit={onEdit}
          onDelete={onDelete}
          onSave={onSave}
          searchTerm={searchTerm}
          viewMode={viewMode}
        />
      ))}
    </div>
  )
} 