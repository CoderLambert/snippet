'use client'

import { useState } from 'react'
import { Search, Code2, Hash, Folder, Calendar, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Snippet } from '@/types'

interface SearchResultsPanelProps {
  snippets: Snippet[]
  searchTerm: string
  onSnippetClick: (snippet: Snippet) => void
}

// 高亮搜索词的工具函数
const highlightSearchTerm = (text: string, searchTerm: string) => {
  if (!searchTerm) return text
  
  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(regex)
  
  return parts.map((part, index) => {
    if (part.toLowerCase() === searchTerm.toLowerCase()) {
      return (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded font-medium">
          {part}
        </mark>
      )
    }
    return part
  })
}

// 获取代码中的搜索匹配信息
const getCodeMatches = (code: string, searchTerm: string) => {
  if (!searchTerm) return []
  
  const lines = code.split('\n')
  const searchLower = searchTerm.toLowerCase()
  const matches: Array<{
    lineNumber: number
    content: string
    beforeContext: string
    afterContext: string
    matchCount: number
  }> = []
  
  lines.forEach((line, index) => {
    const lineLower = line.toLowerCase()
    if (lineLower.includes(searchLower)) {
      // 计算匹配次数
      const matchCount = (lineLower.match(new RegExp(searchLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length
      
      // 获取上下文
      const beforeContext = index > 0 ? lines[index - 1]?.trim() || '' : ''
      const afterContext = index < lines.length - 1 ? lines[index + 1]?.trim() || '' : ''
      
      matches.push({
        lineNumber: index + 1,
        content: line.trim(),
        beforeContext,
        afterContext,
        matchCount
      })
    }
  })
  
  return matches
}

// 获取匹配的标签和分类
const getMetadataMatches = (snippet: Snippet, searchTerm: string) => {
  const matches = {
    title: snippet.title.toLowerCase().includes(searchTerm.toLowerCase()),
    description: snippet.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false,
    category: snippet.category.name.toLowerCase().includes(searchTerm.toLowerCase()),
    tags: snippet.tags.filter(tag => tag.name.toLowerCase().includes(searchTerm.toLowerCase())),
    language: snippet.language.toLowerCase().includes(searchTerm.toLowerCase())
  }
  
  return matches
}

// 单个搜索结果组件
function SearchResultItem({ snippet, searchTerm, onSnippetClick }: {
  snippet: Snippet
  searchTerm: string
  onSnippetClick: (snippet: Snippet) => void
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [copiedLine, setCopiedLine] = useState<number | null>(null)
  
  const codeMatches = getCodeMatches(snippet.code, searchTerm)
  const metadataMatches = getMetadataMatches(snippet, searchTerm)
  const totalMatches = codeMatches.reduce((sum, match) => sum + match.matchCount, 0) +
    (metadataMatches.title ? 1 : 0) +
    (metadataMatches.description ? 1 : 0) +
    (metadataMatches.category ? 1 : 0) +
    metadataMatches.tags.length +
    (metadataMatches.language ? 1 : 0)

  const displayedMatches = isExpanded ? codeMatches : codeMatches.slice(0, 3)
  const hasMoreMatches = codeMatches.length > 3

  const handleCopyLine = async (lineNumber: number, content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedLine(lineNumber)
      setTimeout(() => setCopiedLine(null), 2000)
    } catch (err) {
      console.error('复制失败:', err)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer" onClick={() => onSnippetClick(snippet)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg flex items-center gap-2 mb-2">
              <Code2 className="h-5 w-5 text-blue-600" />
              <span className="truncate">
                {highlightSearchTerm(snippet.title, searchTerm)}
              </span>
              <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {totalMatches} 个匹配
              </span>
            </CardTitle>
            
            {snippet.description && (
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                {highlightSearchTerm(snippet.description, searchTerm)}
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="h-3 w-3" />
            {formatDate(snippet.updatedAt)}
          </div>
        </div>
        
        {/* 元数据匹配 */}
        <div className="flex flex-wrap gap-2">
          {metadataMatches.language && (
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
              <Code2 className="h-3 w-3 mr-1" />
              {highlightSearchTerm(snippet.language, searchTerm)}
            </span>
          )}
          {metadataMatches.category && (
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800 border border-green-200">
              <Folder className="h-3 w-3 mr-1" />
              {highlightSearchTerm(snippet.category.name, searchTerm)}
            </span>
          )}
          {metadataMatches.tags.map((tag) => (
            <span key={tag.id} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
              <Hash className="h-3 w-3 mr-1" />
              {highlightSearchTerm(tag.name, searchTerm)}
            </span>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* 代码匹配 */}
        {codeMatches.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-900 rounded-md p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  代码匹配 ({codeMatches.length} 行)
                </span>
              </div>
              {hasMoreMatches && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsExpanded(!isExpanded)
                  }}
                  className="h-6 px-2 text-xs"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="h-3 w-3 mr-1" />
                      收起
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3 w-3 mr-1" />
                      显示全部 ({codeMatches.length - 3} 更多)
                    </>
                  )}
                </Button>
              )}
            </div>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {displayedMatches.map((match, index) => (
                <div key={index} className="text-xs font-mono">
                  {/* 上下文 */}
                  {match.beforeContext && (
                    <div className="text-gray-400 dark:text-gray-600 pl-8">
                      {match.lineNumber - 1}: {match.beforeContext}
                    </div>
                  )}
                  
                  {/* 匹配行 */}
                  <div className="flex items-start gap-2 bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded group">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCopyLine(match.lineNumber, match.content)
                      }}
                      className={`text-blue-600 dark:text-blue-400 w-8 text-right shrink-0 hover:text-blue-800 dark:hover:text-blue-200 cursor-pointer transition-colors ${
                        copiedLine === match.lineNumber ? 'text-green-600 dark:text-green-400' : ''
                      }`}
                      title={`复制第 ${match.lineNumber} 行`}
                    >
                      {copiedLine === match.lineNumber ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        match.lineNumber
                      )}:
                    </button>
                    <code className="flex-1 text-gray-800 dark:text-gray-200 break-all">
                      {highlightSearchTerm(match.content || '(空行)', searchTerm)}
                    </code>
                    {match.matchCount > 1 && (
                      <span className="text-xs bg-yellow-200 dark:bg-yellow-800 px-1 rounded shrink-0">
                        {match.matchCount}x
                      </span>
                    )}
                  </div>
                  
                  {/* 下文 */}
                  {match.afterContext && (
                    <div className="text-gray-400 dark:text-gray-600 pl-8">
                      {match.lineNumber + 1}: {match.afterContext}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* 代码统计 */}
        <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
          <span>{snippet.code.split('\n').length} 行代码</span>
          <span>点击查看完整代码</span>
        </div>
      </CardContent>
    </Card>
  )
}

export default function SearchResultsPanel({ snippets, searchTerm, onSnippetClick }: SearchResultsPanelProps) {
  if (!searchTerm || snippets.length === 0) {
    return null
  }

  // 计算搜索统计
  const totalMatches = snippets.reduce((total, snippet) => {
    const codeMatches = getCodeMatches(snippet.code, searchTerm)
    const metadataMatches = getMetadataMatches(snippet, searchTerm)
    return total + codeMatches.reduce((sum, match) => sum + match.matchCount, 0) +
      (metadataMatches.title ? 1 : 0) +
      (metadataMatches.description ? 1 : 0) +
      (metadataMatches.category ? 1 : 0) +
      metadataMatches.tags.length +
      (metadataMatches.language ? 1 : 0)
  }, 0)

  return (
    <div className="space-y-4">
      {/* 搜索统计 */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Search className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <span className="font-medium text-blue-800 dark:text-blue-200">
            搜索结果详情
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{snippets.length}</div>
            <div className="text-gray-600 dark:text-gray-400">个代码片段</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{totalMatches}</div>
            <div className="text-gray-600 dark:text-gray-400">个匹配项</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {new Set(snippets.map(s => s.language)).size}
            </div>
            <div className="text-gray-600 dark:text-gray-400">种语言</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {new Set(snippets.map(s => s.category.name)).size}
            </div>
            <div className="text-gray-600 dark:text-gray-400">个分类</div>
          </div>
        </div>
        <div className="mt-3 text-xs text-blue-600 dark:text-blue-400">
          搜索关键词: <span className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded font-mono">"{searchTerm}"</span>
        </div>
      </div>

      {/* 搜索结果 */}
      <div className="space-y-4">
        {snippets.map((snippet) => (
          <SearchResultItem
            key={snippet.id}
            snippet={snippet}
            searchTerm={searchTerm}
            onSnippetClick={onSnippetClick}
          />
        ))}
      </div>
    </div>
  )
} 