export interface Tag {
  id: number
  name: string
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: number
  name: string
  description?: string
  createdAt: string
  updatedAt: string
}

export interface Snippet {
  id: number
  title: string
  description?: string
  language: string
  code: string
  categoryId: number
  category: Category
  tags: Tag[]
  createdAt: string
  updatedAt: string
}

export interface CreateSnippetDto {
  title: string
  description?: string
  language: string
  code: string
  categoryId: number
  tagIds: number[]
}

export interface UpdateSnippetDto {
  title?: string
  description?: string
  language?: string
  code?: string
  categoryId?: number
  tagIds?: number[]
}

export interface SnippetFilters {
  searchTerm: string
  languageFilter: string
  categoryFilter: string
} 