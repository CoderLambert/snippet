'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DialogFooter } from '@/components/ui/dialog'
import { Snippet, Tag, Category, CreateSnippetDto } from '@/types'
import CodeEditor from './CodeEditor'

interface SnippetFormProps {
  snippet?: Snippet
  tags: Tag[]
  categories: Category[]
  onSubmit: (data: CreateSnippetDto) => Promise<boolean>
  onCancel: () => void
  isLoading?: boolean
}

export default function SnippetForm({
  snippet,
  tags,
  categories,
  onSubmit,
  onCancel,
  isLoading = false,
}: SnippetFormProps) {
  const [formData, setFormData] = useState<CreateSnippetDto>({
    title: '',
    description: '',
    language: '',
    code: '',
    categoryId: 0,
    tagIds: [],
  })

  useEffect(() => {
    if (snippet) {
      setFormData({
        title: snippet.title,
        description: snippet.description || '',
        language: snippet.language,
        code: snippet.code,
        categoryId: snippet.categoryId,
        tagIds: snippet.tags.map(tag => tag.id),
      })
    }
  }, [snippet])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await onSubmit(formData)
    if (success) {
      if (!snippet) {
        // 只在创建时重置表单
        setFormData({
          title: '',
          description: '',
          language: '',
          code: '',
          categoryId: 0,
          tagIds: [],
        })
      }
    }
  }

  const handleTagToggle = (tagId: number) => {
    setFormData(prev => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter(id => id !== tagId)
        : [...prev.tagIds, tagId]
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <label htmlFor="title" className="text-sm font-medium">
          标题 *
        </label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="输入代码片段标题"
          required
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="description" className="text-sm font-medium">
          描述
        </label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="描述这个代码片段的用途"
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="language" className="text-sm font-medium">
          编程语言 *
        </label>
        <Input
          id="language"
          value={formData.language}
          onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
          placeholder="例如: JavaScript, Python, Java"
          required
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="category" className="text-sm font-medium">
          分类 *
        </label>
        <select
          id="category"
          value={formData.categoryId}
          onChange={(e) => setFormData(prev => ({ ...prev, categoryId: Number(e.target.value) }))}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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

      <div className="grid gap-2">
        <label className="text-sm font-medium">代码 *</label>
        <CodeEditor
          value={formData.code}
          onChange={(value) => setFormData(prev => ({ ...prev, code: value || '' }))}
          language={formData.language}
          height="200px"
          hideErrors={true}
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium">标签</label>
        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
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

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          取消
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? '保存中...' : (snippet ? '更新' : '创建')}
        </Button>
      </DialogFooter>
    </form>
  )
} 