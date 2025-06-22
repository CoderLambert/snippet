import { tailwindSnippets } from './createTailwindSnippets'
import { moreTailwindSnippets } from './addMoreSnippets'

// 合并所有代码片段
const allSnippets = [...tailwindSnippets, ...moreTailwindSnippets]

// 导入代码片段到数据库的函数
export async function importTailwindSnippets() {
  const API_BASE_URL = 'http://localhost:3001'
  
  try {
    console.log('开始导入 TailwindCSS 代码片段...')
    
    // 获取或创建分类
    const categories = new Map()
    const tags = new Map()
    
    // 收集所有分类和标签
    for (const snippet of allSnippets) {
      if (!categories.has(snippet.category)) {
        categories.set(snippet.category, null)
      }
      
      for (const tag of snippet.tags) {
        if (!tags.has(tag)) {
          tags.set(tag, null)
        }
      }
    }
    
    // 创建分类
    for (const categoryName of Array.from(categories.keys())) {
      try {
        const response = await fetch(`${API_BASE_URL}/categories`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: categoryName,
            description: `${categoryName}相关的代码片段`
          })
        })
        
        if (response.ok) {
          const category = await response.json()
          categories.set(categoryName, category.id)
          console.log(`✅ 创建分类: ${categoryName}`)
        } else {
          // 可能分类已存在，尝试获取
          const getResponse = await fetch(`${API_BASE_URL}/categories`)
          if (getResponse.ok) {
            const existingCategories = await getResponse.json()
            const existing = existingCategories.find((c: any) => c.name === categoryName)
            if (existing) {
              categories.set(categoryName, existing.id)
              console.log(`📂 使用已存在的分类: ${categoryName}`)
            }
          }
        }
      } catch (error) {
        console.error(`❌ 创建分类失败 ${categoryName}:`, error)
      }
    }
    
    // 创建标签
    for (const tagName of Array.from(tags.keys())) {
      try {
        const response = await fetch(`${API_BASE_URL}/tags`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: tagName })
        })
        
        if (response.ok) {
          const tag = await response.json()
          tags.set(tagName, tag.id)
          console.log(`🏷️ 创建标签: ${tagName}`)
        } else {
          // 可能标签已存在，尝试获取
          const getResponse = await fetch(`${API_BASE_URL}/tags`)
          if (getResponse.ok) {
            const existingTags = await getResponse.json()
            const existing = existingTags.find((t: any) => t.name === tagName)
            if (existing) {
              tags.set(tagName, existing.id)
              console.log(`🔖 使用已存在的标签: ${tagName}`)
            }
          }
        }
      } catch (error) {
        console.error(`❌ 创建标签失败 ${tagName}:`, error)
      }
    }
    
    // 创建代码片段
    let successCount = 0
    for (const snippet of allSnippets) {
      try {
        const categoryId = categories.get(snippet.category)
        const tagIds = snippet.tags.map(tag => tags.get(tag)).filter(id => id)
        
        if (!categoryId) {
          console.error(`❌ 分类 ${snippet.category} 不存在，跳过代码片段: ${snippet.title}`)
          continue
        }
        
        const response = await fetch(`${API_BASE_URL}/snippets`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: snippet.title,
            description: snippet.description,
            language: snippet.language,
            code: snippet.code,
            categoryId: categoryId,
            tagIds: tagIds
          })
        })
        
        if (response.ok) {
          successCount++
          console.log(`✅ 创建代码片段: ${snippet.title}`)
        } else {
          const errorData = await response.text()
          console.error(`❌ 创建代码片段失败 ${snippet.title}:`, errorData)
        }
      } catch (error) {
        console.error(`❌ 创建代码片段失败 ${snippet.title}:`, error)
      }
    }
    
    console.log(`\n🎉 导入完成！成功创建 ${successCount} 个代码片段`)
    return { success: true, count: successCount }
    
  } catch (error) {
    console.error('❌ 导入过程出错:', error)
    return { success: false, error }
  }
} 