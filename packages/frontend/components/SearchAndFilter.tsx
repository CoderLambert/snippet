'use client'

import { Search, Filter, X, RotateCcw } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Category, SnippetFilters } from '@/types'

interface SearchAndFilterProps {
  filters: SnippetFilters
  categories: Category[]
  onFiltersChange: (filters: SnippetFilters) => void
}

export default function SearchAndFilter({
  filters,
  categories,
  onFiltersChange,
}: SearchAndFilterProps) {
  const updateFilter = (key: keyof SnippetFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    })
  }

  const clearAllFilters = () => {
    onFiltersChange({
      searchTerm: '',
      languageFilter: '',
      categoryFilter: '',
    })
  }

  const hasActiveFilters = filters.searchTerm || filters.languageFilter || filters.categoryFilter

  return (
    <div className="space-y-4 mb-6">
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索代码片段的标题、描述、代码内容或标签..."
              value={filters.searchTerm}
              onChange={(e) => updateFilter('searchTerm', e.target.value)}
              className="pl-10 pr-10"
            />
            {filters.searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateFilter('searchTerm', '')}
                className="absolute right-1 top-1 h-8 w-8 p-0"
                title="清除搜索"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        
        <div className="w-48">
          <div className="relative">
            <Filter className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="按语言过滤..."
              value={filters.languageFilter}
              onChange={(e) => updateFilter('languageFilter', e.target.value)}
              className="pl-10 pr-10"
            />
            {filters.languageFilter && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateFilter('languageFilter', '')}
                className="absolute right-1 top-1 h-8 w-8 p-0"
                title="清除语言过滤"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="w-48">
          <select
            value={filters.categoryFilter}
            onChange={(e) => updateFilter('categoryFilter', e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">所有分类</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={clearAllFilters}
            className="flex items-center gap-2"
            title="清除所有过滤条件"
          >
            <RotateCcw className="h-4 w-4" />
            清除过滤
          </Button>
        )}
      </div>

      {/* 搜索提示 */}
      {!hasActiveFilters && (
        <div className="text-sm text-muted-foreground">
          💡 提示：您可以搜索代码片段的标题、描述、代码内容或标签。支持多个过滤条件同时使用。
        </div>
      )}
    </div>
  )
} 