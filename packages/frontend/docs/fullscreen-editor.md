# 全屏实时编辑器功能

## 概述

全屏实时编辑器是一个强大的代码编辑和预览工具，支持在同一个界面中同时编辑代码和查看实时预览结果。

## 主要功能

### 🎯 核心特性

- **实时编辑**: 支持实时代码编辑，修改代码时立即生效
- **实时预览**: HTML代码支持实时预览，所见即所得
- **全屏模式**: 充分利用屏幕空间，提供最佳的编辑体验
- **响应式设计**: 支持桌面和移动设备
- **多语言支持**: 支持HTML、JavaScript、CSS等多种编程语言

### 🛠️ 操作功能

- **保存代码**: 将修改后的代码保存到数据库
- **重置代码**: 一键恢复到原始代码状态
- **下载代码**: 将当前代码下载为文件
- **关闭确认**: 有未保存更改时提示用户确认

## 使用方法

### 1. 在代码片段卡片中使用

每个代码片段卡片都有一个"实时编辑"按钮（铅笔图标），点击即可打开全屏编辑器：

```tsx
<SnippetCard
  snippet={snippet}
  onEdit={handleEditSnippet}
  onDelete={handleDeleteSnippet}
  onSave={handleSaveSnippet}  // 保存函数
  readOnly={false}            // 是否只读
/>
```

### 2. 直接使用FullscreenEditor组件

```tsx
import FullscreenEditor from '@/components/FullscreenEditor'

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false)
  
  const handleSave = async (code: string) => {
    // 处理保存逻辑
    return true
  }
  
  return (
    <FullscreenEditor
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      initialCode="<h1>Hello World</h1>"
      language="html"
      title="我的编辑器"
      onSave={handleSave}
      readOnly={false}
    />
  )
}
```

### 3. 测试页面

访问 `/test-editor` 页面可以体验全屏编辑器的功能。

## 组件属性

### FullscreenEditor Props

| 属性 | 类型 | 必需 | 默认值 | 描述 |
|------|------|------|--------|------|
| `isOpen` | `boolean` | ✅ | - | 控制编辑器是否打开 |
| `onClose` | `() => void` | ✅ | - | 关闭编辑器的回调函数 |
| `initialCode` | `string` | ✅ | - | 初始代码内容 |
| `language` | `string` | ✅ | - | 编程语言（html, javascript, css等） |
| `title` | `string` | ❌ | - | 编辑器标题 |
| `onSave` | `(code: string) => Promise<boolean>` | ❌ | - | 保存代码的回调函数 |
| `readOnly` | `boolean` | ❌ | `false` | 是否只读模式 |

## 布局说明

### HTML代码布局
- **左侧**: 代码编辑器（50%宽度）
- **右侧**: 实时预览（50%宽度）
- **响应式**: 在移动设备上自动切换为上下布局

### 其他代码布局
- **全宽**: 代码编辑器占据整个宽度
- **无预览**: 不显示预览区域

## 样式定制

### CSS类名

- `.fullscreen-editor`: 主容器
- `.fullscreen-editor .monaco-editor`: Monaco编辑器样式

### 响应式断点

```css
@media (max-width: 768px) {
  .fullscreen-editor .flex {
    flex-direction: column;
  }
  
  .fullscreen-editor .w-1/2 {
    width: 100%;
  }
}
```

## 技术实现

### 核心技术栈

- **Monaco Editor**: 代码编辑器
- **React Hooks**: 状态管理
- **TailwindCSS**: 样式框架
- **iframe**: HTML预览

### 关键特性

1. **实时更新**: 使用 `useCallback` 优化代码变化处理
2. **状态管理**: 跟踪代码变化和保存状态
3. **错误处理**: 完善的错误处理和用户提示
4. **性能优化**: 避免不必要的重新渲染

## 注意事项

1. **HTML预览**: 仅支持HTML代码的实时预览
2. **保存功能**: 需要提供 `onSave` 回调函数才能使用保存功能
3. **文件下载**: 自动根据语言类型设置正确的文件扩展名
4. **内存管理**: 大文件编辑时注意内存使用

## 未来改进

- [ ] 支持更多语言的语法高亮
- [ ] 添加代码格式化功能
- [ ] 支持多文件编辑
- [ ] 添加代码片段收藏功能
- [ ] 支持协作编辑 