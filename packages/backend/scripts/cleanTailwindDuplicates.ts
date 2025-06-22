import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 代码质量评分函数
function getCodeQualityScore(snippet: any): number {
  let score = 0
  
  // 完整HTML文档 +3分
  if (snippet.code.includes('<!DOCTYPE html') || snippet.code.includes('<html')) {
    score += 3
  }
  
  // 包含TailwindCSS CDN +2分
  if (snippet.code.includes('cdn.tailwindcss.com')) {
    score += 2
  }
  
  // 包含TailwindCSS类 +1分
  if (snippet.code.includes('class="') && snippet.code.includes('bg-')) {
    score += 1
  }
  
  // 代码长度适中 +1分 (100-2000字符)
  if (snippet.code.length >= 100 && snippet.code.length <= 2000) {
    score += 1
  }
  
  return score
}

async function cleanTailwindDuplicates() {
  try {
    console.log('🔍 开始检查TailwindCSS重复导入问题...')

    // 获取所有包含TailwindCSS的代码片段
    const tailwindSnippets = await prisma.snippet.findMany({
      where: {
        OR: [
          { code: { contains: 'tailwindcss' } },
          { code: { contains: 'cdn.tailwindcss.com' } },
          { title: { contains: 'TailwindCSS' } },
          { title: { contains: 'Tailwind' } }
        ]
      },
      include: {
        category: true,
        tags: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    console.log(`📊 找到 ${tailwindSnippets.length} 个包含TailwindCSS的代码片段`)

    if (tailwindSnippets.length === 0) {
      console.log('✅ 没有找到包含TailwindCSS的代码片段')
      return
    }

    // 显示所有TailwindCSS相关的代码片段
    console.log('\n📝 所有TailwindCSS相关的代码片段:')
    tailwindSnippets.forEach((snippet, index) => {
      console.log(`\n${index + 1}. ID: ${snippet.id}`)
      console.log(`   标题: ${snippet.title}`)
      console.log(`   语言: ${snippet.language}`)
      console.log(`   分类: ${snippet.category.name}`)
      console.log(`   创建时间: ${snippet.createdAt.toISOString()}`)
      console.log(`   代码长度: ${snippet.code.length} 字符`)
      
      // 检查代码内容特征
      const hasTailwindScript = snippet.code.includes('cdn.tailwindcss.com')
      const hasTailwindClasses = snippet.code.includes('class="') && snippet.code.includes('bg-')
      const isCompleteHtml = snippet.code.includes('<!DOCTYPE html') || snippet.code.includes('<html')
      
      console.log(`   特征分析:`)
      console.log(`     - 包含TailwindCSS CDN: ${hasTailwindScript ? '✅' : '❌'}`)
      console.log(`     - 包含TailwindCSS类: ${hasTailwindClasses ? '✅' : '❌'}`)
      console.log(`     - 完整HTML文档: ${isCompleteHtml ? '✅' : '❌'}`)
      
      // 显示代码片段的前100个字符
      const preview = snippet.code.substring(0, 100).replace(/\n/g, ' ')
      console.log(`   代码预览: ${preview}...`)
    })

    // 按标题分组，找出重复的
    const titleGroups = new Map<string, any[]>()
    
    tailwindSnippets.forEach(snippet => {
      const title = snippet.title.trim()
      if (!titleGroups.has(title)) {
        titleGroups.set(title, [])
      }
      titleGroups.get(title)!.push(snippet)
    })

    // 找出有重复的标题
    const duplicates = Array.from(titleGroups.entries())
      .filter(([title, snippets]) => snippets.length > 1)
      .map(([title, snippets]) => ({ title, snippets }))

    console.log(`🔍 发现 ${duplicates.length} 个重复标题的TailwindCSS代码片段组`)

    if (duplicates.length === 0) {
      console.log('✅ 没有发现重复的TailwindCSS代码片段')
      return
    }

    // 显示重复的代码片段
    console.log('\n📝 重复的TailwindCSS代码片段:')
    duplicates.forEach(({ title, snippets }) => {
      console.log(`\n重复标题: "${title}"`)
      console.log(`找到 ${snippets.length} 个相同标题的代码片段:`)
      
      snippets.forEach((snippet, index) => {
        console.log(`  ${index + 1}. ID: ${snippet.id}`)
        console.log(`     创建时间: ${snippet.createdAt.toISOString()}`)
        console.log(`     语言: ${snippet.language}`)
        console.log(`     分类: ${snippet.category.name}`)
        
        // 分析代码质量
        const hasTailwindScript = snippet.code.includes('cdn.tailwindcss.com')
        const hasTailwindClasses = snippet.code.includes('class="') && snippet.code.includes('bg-')
        const isCompleteHtml = snippet.code.includes('<!DOCTYPE html')
        
        console.log(`     代码质量:`)
        console.log(`       - 包含TailwindCSS CDN: ${hasTailwindScript ? '✅' : '❌'}`)
        console.log(`       - 包含TailwindCSS类: ${hasTailwindClasses ? '✅' : '❌'}`)
        console.log(`       - 完整HTML文档: ${isCompleteHtml ? '✅' : '❌'}`)
      })
    })

    // 智能选择要保留的代码片段
    console.log('\n🔄 开始智能清理重复项...')
    let deletedCount = 0

    for (const { title, snippets } of duplicates) {
      console.log(`\n处理重复标题: "${title}"`)
      
      // 按代码质量排序，优先保留质量更高的
      const sortedSnippets = snippets.sort((a, b) => {
        const scoreA = getCodeQualityScore(a)
        const scoreB = getCodeQualityScore(b)
        
        if (scoreA !== scoreB) {
          return scoreB - scoreA // 分数高的排在前面
        }
        
        // 分数相同时，保留最早的
        return a.createdAt.getTime() - b.createdAt.getTime()
      })
      
      const keepSnippet = sortedSnippets[0]
      const deleteSnippets = sortedSnippets.slice(1)

      console.log(`保留: ID ${keepSnippet.id} (质量评分: ${getCodeQualityScore(keepSnippet)})`)

      // 删除重复的代码片段
      for (const deleteSnippet of deleteSnippets) {
        console.log(`删除: ID ${deleteSnippet.id} (质量评分: ${getCodeQualityScore(deleteSnippet)})`)
        
        await prisma.snippet.delete({
          where: { id: deleteSnippet.id }
        })
        
        deletedCount++
      }
    }

    console.log(`\n✅ 清理完成！`)
    console.log(`删除了 ${deletedCount} 个重复的TailwindCSS代码片段`)

    // 最终统计
    const finalTailwindSnippets = await prisma.snippet.findMany({
      where: {
        OR: [
          { code: { contains: 'tailwindcss' } },
          { code: { contains: 'cdn.tailwindcss.com' } },
          { title: { contains: 'TailwindCSS' } },
          { title: { contains: 'Tailwind' } }
        ]
      },
      select: { id: true, title: true }
    })

    console.log(`\n📊 清理后的统计:`)
    console.log(`剩余TailwindCSS相关代码片段: ${finalTailwindSnippets.length}`)
    
    if (finalTailwindSnippets.length > 0) {
      console.log('\n剩余的TailwindCSS代码片段:')
      finalTailwindSnippets.forEach(snippet => {
        console.log(`- ID ${snippet.id}: ${snippet.title}`)
      })
    }

  } catch (error) {
    console.error('❌ 清理过程中出现错误:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// 运行清理脚本
cleanTailwindDuplicates() 