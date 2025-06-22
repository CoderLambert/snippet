# 代码片段管理系统 (Monorepo)

一个全栈代码片段管理系统，使用 Monorepo 架构管理前后端项目。

## 🏗️ 项目结构

```
snippet-management-system/
├── packages/
│   ├── backend/               # 后端项目 (NestJS)
│   │   ├── src/              # 源代码
│   │   ├── prisma/           # 数据库模式
│   │   ├── package.json      # 后端依赖
│   │   └── tsconfig.json     # 后端TS配置
│   └── frontend/             # 前端项目 (Next.js)
│       ├── app/              # Next.js App Router
│       ├── components/       # React 组件
│       ├── lib/              # 工具函数
│       ├── package.json      # 前端依赖
│       └── tsconfig.json     # 前端TS配置
├── package.json              # 根package.json (monorepo配置)
├── pnpm-workspace.yaml       # pnpm工作区配置
└── README.md
```

## 🛠️ 技术栈

### 后端 (packages/backend)
- **框架**: NestJS
- **数据库**: PostgreSQL
- **ORM**: Prisma
- **验证**: class-validator
- **语言**: TypeScript

### 前端 (packages/frontend)
- **框架**: Next.js 14 (App Router)
- **UI 库**: shadcn/ui + Radix UI
- **样式**: TailwindCSS
- **图标**: Lucide React
- **语言**: TypeScript

### Monorepo 工具
- **包管理器**: pnpm
- **工作区**: pnpm workspaces
- **并发运行**: concurrently

## ✨ 功能特性

- ✅ **完整的 CRUD 操作**: 创建、读取、更新、删除代码片段
- ✅ **实时搜索**: 按标题、描述、代码内容搜索
- ✅ **智能筛选**: 按编程语言和标签快速筛选
- ✅ **响应式设计**: 完美适配移动端和桌面端
- ✅ **实时数据同步**: 前后端无缝交互
- ✅ **数据验证**: 完整的输入验证和错误处理
- ✅ **Monorepo 架构**: 统一管理前后端项目

## 🚀 快速开始

### 环境要求
- Node.js 18+
- PostgreSQL 12+
- pnpm 8+ (推荐)

### 1. 安装依赖

```bash
# 安装 pnpm (如果没有)
npm install -g pnpm

# 安装所有依赖
pnpm install
```

### 2. 环境配置

在 `packages/backend/` 目录下创建 `.env` 文件：

```env
# Database Configuration
DATABASE_URL="postgresql://postgres:lambert@localhost:5432/snippet?schema=public"

# Application Configuration  
PORT=3001
```

### 3. 数据库设置

```bash
# 创建数据库
psql -U postgres -c "CREATE DATABASE snippet"

# 生成 Prisma 客户端并推送模式
pnpm db:generate
pnpm db:push
```

### 4. 启动项目

**方法一：同时启动前后端 (推荐)**
```bash
pnpm dev
```

**方法二：分别启动**
```bash
# 后端 (端口 3001)
pnpm dev:backend

# 前端 (端口 3000) 
pnpm dev:frontend
```

### 5. 访问应用

- 🌐 **前端界面**: http://localhost:3000
- 🔧 **后端 API**: http://localhost:3001
- 📊 **Prisma Studio**: `pnpm db:studio`

## 📦 Monorepo 命令

### 全局命令 (在根目录运行)

```bash
# 开发
pnpm dev                  # 同时启动前后端
pnpm dev:backend         # 仅启动后端
pnpm dev:frontend        # 仅启动前端

# 构建
pnpm build               # 构建前后端
pnpm build:backend       # 仅构建后端
pnpm build:frontend      # 仅构建前端

# 数据库
pnpm db:generate         # 生成 Prisma 客户端
pnpm db:push             # 推送数据库模式
pnpm db:migrate          # 数据库迁移
pnpm db:studio           # 打开 Prisma Studio

# 测试和检查
pnpm test                # 运行后端测试
pnpm lint                # 检查代码规范
```

### 单项目命令

```bash
# 对特定项目执行命令
pnpm --filter backend [command]    # 后端项目
pnpm --filter frontend [command]   # 前端项目

# 示例
pnpm --filter backend test
pnpm --filter frontend build
```

## 🔧 API 接口

### 代码片段 API

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/snippets` | 获取所有代码片段 |
| GET | `/snippets?language=javascript` | 按语言筛选 |
| GET | `/snippets?tags=react,hooks` | 按标签筛选 |
| GET | `/snippets/:id` | 获取单个代码片段 |
| POST | `/snippets` | 创建新代码片段 |
| PATCH | `/snippets/:id` | 更新代码片段 |
| DELETE | `/snippets/:id` | 删除代码片段 |

### 请求示例

```bash
# 创建代码片段
curl -X POST http://localhost:3001/snippets \
  -H "Content-Type: application/json" \
  -d '{
    "title": "React Hook示例",
    "description": "一个简单的React Hook示例",
    "language": "javascript",
    "code": "import { useState } from \"react\";\n\nfunction useCounter(initialValue = 0) {\n  const [count, setCount] = useState(initialValue);\n  \n  const increment = () => setCount(count + 1);\n  const decrement = () => setCount(count - 1);\n  \n  return { count, increment, decrement };\n}",
    "tags": ["react", "hooks", "javascript"]
  }'

# 获取所有代码片段
curl http://localhost:3001/snippets
```

## 📋 数据模型

```typescript
interface Snippet {
  id: number
  title: string
  description?: string
  language: string
  code: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}
```

## 🎨 界面特性

### 主要功能
- 📝 **代码片段列表**: 响应式网格布局展示
- 🔍 **实时搜索**: 即时搜索代码片段内容
- 🏷️ **标签管理**: 灵活的标签分类系统
- ➕ **快速创建**: 一键添加新代码片段
- ✏️ **在线编辑**: 直观的编辑界面
- 🗑️ **安全删除**: 确认式删除机制

### UI 设计
- 🎨 **现代化界面**: 基于 shadcn/ui 的精美设计
- 📱 **完全响应式**: 完美适配各种设备
- ⚡ **流畅交互**: 快速响应的用户体验
- 🌙 **深色模式**: 支持主题切换 (可扩展)

## 🔧 开发指南

### 添加新的后端功能

```bash
# 进入后端目录
cd packages/backend

# 生成新模块
nest g module [module-name]
nest g service [service-name]
nest g controller [controller-name]
```

### 添加新的前端组件

```bash
# 进入前端目录  
cd packages/frontend

# 创建新组件
mkdir -p components/[component-name]
```

### 数据库更改

```bash
# 修改 packages/backend/prisma/schema.prisma 后
pnpm db:generate
pnpm db:push

# 或者使用迁移
pnpm db:migrate
```

## 🚨 故障排除

### 常见问题

1. **pnpm 命令不存在**
   ```bash
   npm install -g pnpm
   ```

2. **数据库连接失败**
   ```bash
   # 检查 PostgreSQL 状态
   sudo systemctl status postgresql
   
   # 检查 .env 文件配置
   cat packages/backend/.env
   ```

3. **端口冲突**
   ```bash
   # 检查端口占用
   lsof -i :3000  # 前端
   lsof -i :3001  # 后端
   ```

4. **依赖安装失败**
   ```bash
   # 清理缓存重新安装
   pnpm store prune
   rm -rf node_modules packages/*/node_modules
   pnpm install
   ```

### 性能优化

- 🚀 **并行构建**: 利用 pnpm 的并行安装特性
- 📦 **依赖共享**: Monorepo 共享公共依赖
- ⚡ **增量构建**: 只构建变更的项目
- 🔄 **热重载**: 开发时的快速重载

## 📈 扩展功能

可以考虑添加的功能：

- 🔐 **用户认证**: JWT 认证系统
- 👥 **团队协作**: 多用户权限管理
- 📊 **使用统计**: 代码片段使用分析
- 🔄 **版本控制**: 代码片段历史版本
- 📤 **导入导出**: 支持多种格式
- 🌐 **国际化**: 多语言支持
- 📱 **PWA**: 离线访问支持

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目仅用于学习和演示目的。
