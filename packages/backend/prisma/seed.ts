import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 创建分类
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: '前端开发',
        description: 'HTML, CSS, JavaScript 相关代码片段'
      }
    }),
    prisma.category.create({
      data: {
        name: '后端开发',
        description: '服务器端开发相关代码片段'
      }
    }),
    prisma.category.create({
      data: {
        name: '数据库',
        description: '数据库查询和操作相关代码片段'
      }
    }),
    prisma.category.create({
      data: {
        name: '工具函数',
        description: '通用工具函数和辅助方法'
      }
    })
  ])

  // 创建标签
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: 'JavaScript' } }),
    prisma.tag.create({ data: { name: 'TypeScript' } }),
    prisma.tag.create({ data: { name: 'React' } }),
    prisma.tag.create({ data: { name: 'Vue' } }),
    prisma.tag.create({ data: { name: 'Node.js' } }),
    prisma.tag.create({ data: { name: 'Python' } }),
    prisma.tag.create({ data: { name: 'SQL' } }),
    prisma.tag.create({ data: { name: 'CSS' } }),
    prisma.tag.create({ data: { name: 'HTML' } }),
    prisma.tag.create({ data: { name: 'API' } }),
    prisma.tag.create({ data: { name: 'Hook' } }),
    prisma.tag.create({ data: { name: '组件' } })
  ])

  console.log('种子数据创建完成')
  console.log('分类:', categories.map(c => c.name))
  console.log('标签:', tags.map(t => t.name))
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 