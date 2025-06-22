# 代码片段管理系统 - 前端

这是一个现代化的代码片段管理系统前端应用，使用 Next.js 14 + TypeScript 构建。

## 🏗️ 项目架构

```
packages/frontend/
├── app/                    # Next.js App Router
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 主页面
├── components/             # 可复用组件
│   ├── ui/                # 基础UI组件
│   ├── CodeEditor.tsx     # Monaco代码编辑器
│   ├── CodeViewer.tsx     # 代码查看器
│   ├── SnippetCard.tsx    # 代码片段卡片
│   ├── SnippetForm.tsx    # 代码片段表单
│   ├── SearchAndFilter.tsx # 搜索过滤器
│   └── index.ts           # 组件索引
├── hooks/                  # 自定义Hooks
│   └── useSnippets.ts     # 代码片段管理Hook
├── api/                   # API请求层
│   ├── index.ts           # 基础API配置
│   ├── snippets.ts        # 代码片段API
│   ├── categories.ts      # 分类API
│   └── tags.ts            # 标签API
├── types/                 # TypeScript类型定义
│   └── index.ts           # 所有类型定义
└── lib/                   # 工具函数
    └── utils.ts           # 通用工具
```

## 🚀 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **代码编辑器**: Monaco Editor React
- **UI组件**: shadcn/ui
- **状态管理**: React Hooks
- **HTTP客户端**: Fetch API

## 🎯 特性

- ✅ **代码高亮**: 使用 Monaco Editor 提供专业的代码编辑体验
- ✅ **响应式设计**: 完全响应式的现代化UI
- ✅ **类型安全**: 完整的 TypeScript 类型定义
- ✅ **模块化架构**: 清晰的文件结构和关注点分离
- ✅ **错误处理**: 完整的错误处理和用户反馈
- ✅ **搜索过滤**: 支持多维度搜索和过滤
- ✅ **加载状态**: 优雅的加载和空状态处理

## 🔧 核心组件

### CodeEditor
基于 Monaco Editor 的代码编辑器组件，支持：
- 语法高亮
- 自动补全
- 代码折叠
- 多语言支持

### CodeViewer
只读的代码查看器，固定高度 250px，适合卡片展示

### SnippetCard
代码片段卡片组件，包含：
- 代码预览
- 标签显示
- 操作按钮
- 创建/更新时间

### useSnippets Hook
统一管理代码片段的自定义Hook：
- 数据获取和缓存
- CRUD操作
- 错误处理
- 搜索过滤

## 📦 API层设计

- **统一错误处理**: 所有API请求都经过统一的错误处理
- **类型安全**: 所有API返回值都有明确的类型定义
- **模块化**: 按功能划分API模块
- **可扩展**: 易于添加新的API端点

## 🎨 样式优化

- 使用 Tailwind CSS 的设计系统
- 支持深色模式（已预留）
- Monaco Editor 的自定义样式
- 响应式布局

## 🔄 状态管理

采用 React Hooks 进行状态管理：
- `useSnippets`: 代码片段数据管理
- `useState`: 本地组件状态
- `useEffect`: 副作用处理
- `useCallback`: 性能优化

## 🚀 使用方法

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build

# 启动生产服务器
npm start
```

## 📝 开发说明

1. **组件开发**: 所有组件都应该是可复用的，并提供完整的类型定义
2. **API调用**: 统一使用 API 层，不要在组件中直接使用 fetch
3. **错误处理**: 所有异步操作都应该有错误处理
4. **类型安全**: 充分利用 TypeScript 的类型系统
5. **性能优化**: 使用 React.memo、useMemo、useCallback 进行优化

## 🎯 未来优化方向

- [ ] 添加代码片段收藏功能
- [ ] 实现代码片段导入/导出
- [ ] 添加代码片段分享功能
- [ ] 实现主题切换
- [ ] 添加代码片段版本控制
- [ ] 实现代码片段协作编辑 