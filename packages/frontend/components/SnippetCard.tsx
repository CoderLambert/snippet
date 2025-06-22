'use client'

import { Edit, Trash2, Search, Code2, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Snippet } from '@/types'
import CodeViewer from './CodeViewer'
import { useState } from 'react'

interface SnippetCardProps {
  snippet: Snippet
  onEdit: (snippet: Snippet) => void
  onDelete: (id: number) => void
  onSave?: (id: number, code: string) => Promise<boolean>
  readOnly?: boolean
  searchTerm?: string
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

// 获取代码片段中匹配搜索词的行
const getMatchingCodeLines = (code: string, searchTerm: string) => {
  if (!searchTerm) return []
  
  const lines = code.split('\n')
  const searchLower = searchTerm.toLowerCase()
  const matchingLines: { lineNumber: number; content: string }[] = []
  
  lines.forEach((line, index) => {
    if (line.toLowerCase().includes(searchLower)) {
      matchingLines.push({
        lineNumber: index + 1,
        content: line.trim()
      })
    }
  })
  
  return matchingLines
}

export default function SnippetCard({ 
  snippet, 
  onEdit, 
  onDelete, 
  onSave,
  readOnly = false,
  searchTerm = ''
}: SnippetCardProps) {
  const [showAllMatches, setShowAllMatches] = useState(false)
  const [copiedLine, setCopiedLine] = useState<number | null>(null)
  
  const handleSave = async (code: string) => {
    if (onSave) {
      return await onSave(snippet.id, code)
    }
    return false
  }

  // 复制代码行
  const handleCopyLine = async (lineNumber: number, content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedLine(lineNumber)
      setTimeout(() => setCopiedLine(null), 2000)
    } catch (err) {
      console.error('复制失败:', err)
    }
  }

  const hasSearchTerm = Boolean(searchTerm)
  const allMatchingLines = hasSearchTerm ? getMatchingCodeLines(snippet.code, searchTerm) : []
  
  // 检查搜索词是否在代码中匹配
  const codeMatches = hasSearchTerm && snippet.code.toLowerCase().includes(searchTerm.toLowerCase())
  
  // 根据展开状态决定显示的行数
  const maxPreviewLines = 3
  const displayedLines = showAllMatches ? allMatchingLines : allMatchingLines.slice(0, maxPreviewLines)
  const hasMoreLines = allMatchingLines.length > maxPreviewLines

  return (
    <Card className="h-fit hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate">
              {hasSearchTerm ? highlightSearchTerm(snippet.title, searchTerm) : snippet.title}
            </CardTitle>
            {snippet.description && (
              <CardDescription className="mt-1 line-clamp-2">
                {hasSearchTerm ? highlightSearchTerm(snippet.description, searchTerm) : snippet.description}
              </CardDescription>
            )}
          </div>
          
          <div className="flex gap-1 ml-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(snippet)}
              className="h-8 w-8"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(snippet.id)}
              className="h-8 w-8"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
            {snippet.language}
          </span>
          <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-700/10">
            {hasSearchTerm ? highlightSearchTerm(snippet.category.name, searchTerm) : snippet.category.name}
          </span>
          {snippet.tags.map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
            >
              {hasSearchTerm ? highlightSearchTerm(tag.name, searchTerm) : tag.name}
            </span>
          ))}
        </div>
      </CardHeader>
      
      <CardContent>
        {/* 搜索匹配的代码行预览 */}
        {hasSearchTerm && codeMatches && allMatchingLines.length > 0 && (
          <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md search-matches-container">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  搜索匹配 ({allMatchingLines.length} 行)
                </span>
              </div>
              {hasMoreLines && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAllMatches(!showAllMatches)}
                  className="h-6 px-2 text-xs text-yellow-700 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-800/50 transition-all duration-200"
                >
                  {showAllMatches ? (
                    <>
                      <ChevronUp className="h-3 w-3 mr-1" />
                      收起
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3 w-3 mr-1" />
                      更多 ({allMatchingLines.length - maxPreviewLines})
                    </>
                  )}
                </Button>
              )}
            </div>
            
            <div className={`space-y-1 search-matches-scroll ${showAllMatches ? 'max-h-64 search-matches-expanded' : 'max-h-32'} overflow-y-auto`}>
              {displayedLines.map((line, index) => (
                <div 
                  key={index} 
                  className="flex gap-2 text-sm hover:bg-yellow-100 dark:hover:bg-yellow-800/30 px-2 py-1 rounded transition-colors duration-150 group"
                >
                  <button
                    onClick={() => handleCopyLine(line.lineNumber, line.content)}
                    className={`text-yellow-600 dark:text-yellow-400 w-8 text-right font-mono text-xs shrink-0 hover:text-yellow-800 dark:hover:text-yellow-200 cursor-pointer transition-colors ${copiedLine === line.lineNumber ? 'text-green-600 dark:text-green-400' : ''}`}
                    title={`点击复制第 ${line.lineNumber} 行代码`}
                  >
                    {line.lineNumber}:
                  </button>
                  <code className="flex-1 text-gray-800 dark:text-gray-200 font-mono text-xs leading-relaxed break-all">
                    {highlightSearchTerm(line.content || '(空行)', searchTerm)}
                  </code>
                  <button
                    onClick={() => handleCopyLine(line.lineNumber, line.content)}
                    className={`opacity-0 group-hover:opacity-100 text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-200 transition-all duration-200 px-1 ${copiedLine === line.lineNumber ? 'text-green-600 dark:text-green-400' : ''}`}
                    title="复制这行代码"
                  >
                    {copiedLine === line.lineNumber ? '✅' : '📋'}
                  </button>
                </div>
              ))}
            </div>
            
            {showAllMatches && allMatchingLines.length > 5 && (
              <div className="mt-2 pt-2 border-t border-yellow-200 dark:border-yellow-700 animate-in fade-in duration-300">
                <div className="text-xs text-yellow-600 dark:text-yellow-400 text-center">
                  显示了所有 {allMatchingLines.length} 行匹配结果
                </div>
              </div>
            )}
          </div>
        )}

        {/* 代码预览区域 */}
        <div className={hasSearchTerm && codeMatches ? 'opacity-75' : ''}>
          <CodeViewer
            code={snippet.code}
            language={snippet.language}
            height={hasSearchTerm && codeMatches ? "150px" : "200px"}
            title={snippet.title}
            onSave={handleSave}
            readOnly={readOnly}
            hideLineNumbers={true}
            searchTerm={searchTerm}
          />
        </div>
        
        <div className="text-xs text-muted-foreground mt-3">
          创建于: {new Date(snippet.createdAt).toLocaleDateString('zh-CN')}
          {snippet.updatedAt !== snippet.createdAt && (
            <span className="ml-2">
              更新于: {new Date(snippet.updatedAt).toLocaleDateString('zh-CN')}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 