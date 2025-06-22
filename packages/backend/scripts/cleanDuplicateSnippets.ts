import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanDuplicateSnippets() {
  try {
    console.log('🔍 开始检查重复的代码片段...')

    // 获取所有代码片段
    const allSnippets = await prisma.snippet.findMany({
      include: {
        category: true,
        tags: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    console.log(`📊 总共找到 ${allSnippets.length} 个代码片段`)

    // 按标题分组，找出重复的
    const titleGroups = new Map<string, any[]>()
    
    allSnippets.forEach(snippet => {
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

    console.log(`🔍 发现 ${duplicates.length} 个重复标题的代码片段组`)

    if (duplicates.length === 0) {
      console.log('✅ 没有发现重复的代码片段')
      return
    }

    // 显示重复的代码片段
    duplicates.forEach(({ title, snippets }) => {
      console.log(`\n📝 重复标题: "${title}"`)
      console.log(`   找到 ${snippets.length} 个相同标题的代码片段:`)
      
      snippets.forEach((snippet, index) => {
        console.log(`   ${index + 1}. ID: ${snippet.id}, 创建时间: ${snippet.createdAt.toISOString()}`)
        console.log(`      语言: ${snippet.language}, 分类: ${snippet.category.name}`)
        console.log(`      代码长度: ${snippet.code.length} 字符`)
        
        // 检查是否包含TailwindCSS脚本
        const hasTailwindScript = snippet.code.includes('tailwindcss')
        console.log(`      包含TailwindCSS: ${hasTailwindScript ? '✅' : '❌'}`)
      })
    })

    // 询问用户是否要删除重复项
    console.log('\n⚠️  是否要删除重复的代码片段？')
    console.log('   将保留最早创建的代码片段，删除其他重复项')
    
    // 这里可以添加用户交互，现在先自动处理
    console.log('🔄 自动处理：保留最早的代码片段，删除其他重复项...')

    let deletedCount = 0

    for (const { title, snippets } of duplicates) {
      // 按创建时间排序，保留最早的
      const sortedSnippets = snippets.sort((a, b) => 
        a.createdAt.getTime() - b.createdAt.getTime()
      )
      
      const keepSnippet = sortedSnippets[0]
      const deleteSnippets = sortedSnippets.slice(1)

      console.log(`\n📝 处理重复标题: "${title}"`)
      console.log(`   保留: ID ${keepSnippet.id} (创建时间: ${keepSnippet.createdAt.toISOString()})`)

      // 删除重复的代码片段
      for (const deleteSnippet of deleteSnippets) {
        console.log(`   删除: ID ${deleteSnippet.id}`)
        
        // 删除代码片段（关联的标签会自动处理）
        await prisma.snippet.delete({
          where: { id: deleteSnippet.id }
        })
        
        deletedCount++
      }
    }

    console.log(`\n✅ 清理完成！`)
    console.log(`   删除了 ${deletedCount} 个重复的代码片段`)
    console.log(`   保留了 ${duplicates.length} 个最早的代码片段`)

    // 检查是否还有重复
    const remainingSnippets = await prisma.snippet.findMany({
      select: { title: true }
    })
    
    const remainingTitles = remainingSnippets.map(s => s.title.trim())
    const uniqueTitles = new Set(remainingTitles)
    
    console.log(`\n📊 清理后的统计:`)
    console.log(`   总代码片段数: ${remainingSnippets.length}`)
    console.log(`   唯一标题数: ${uniqueTitles.size}`)
    console.log(`   重复标题数: ${remainingSnippets.length - uniqueTitles.size}`)

  } catch (error) {
    console.error('❌ 清理过程中出现错误:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// 运行清理脚本
cleanDuplicateSnippets() 