# iframe 快速参考卡片

## 🚀 快速选择指南

### 使用 srcDoc 的场景 ✅
```javascript
// HTML预览功能
<iframe srcDoc={htmlContent} sandbox="allow-scripts" />

// 内容展示
<iframe srcDoc={userContent} />

// 避免跨域问题
<iframe srcDoc={safeHtml} />
```

### 使用 contentDocument 的场景 ⚠️
```javascript
// 需要动态修改内容
const doc = iframe.contentDocument
doc.body.innerHTML = newContent

// 需要与内容交互
const button = iframe.contentDocument.getElementById('btn')

// 支持旧浏览器
// IE 不支持 srcDoc
```

## 📋 代码模板

### 安全的 HTML 预览组件
```typescript
const HtmlPreview = ({ htmlCode }) => {
  const fullHtml = useMemo(() => {
    return `<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>${htmlCode}</body>
</html>`
  }, [htmlCode])

  return (
    <iframe
      srcDoc={fullHtml}
      sandbox="allow-scripts"
      title="HTML Preview"
    />
  )
}
```

### 带错误处理的 iframe
```typescript
const SafeIframe = ({ content }) => {
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return <div>加载失败</div>
  }

  return (
    <iframe
      srcDoc={content}
      onError={() => setHasError(true)}
      sandbox="allow-scripts"
    />
  )
}
```

## ⚡ 性能优化技巧

### 1. 懒加载
```typescript
const LazyIframe = ({ content, isVisible }) => {
  if (!isVisible) return <div>加载中...</div>
  return <iframe srcDoc={content} />
}
```

### 2. 内容缓存
```typescript
const fullHtml = useMemo(() => generateHtml(content), [content])
```

### 3. 内存清理
```typescript
useEffect(() => {
  return () => {
    if (iframeRef.current) {
      iframeRef.current.srcDoc = ''
    }
  }
}, [])
```

## 🛡️ 安全配置

### 推荐的沙盒配置
```html
<!-- 只允许脚本 -->
<iframe sandbox="allow-scripts" />

<!-- 允许脚本和表单 -->
<iframe sandbox="allow-scripts allow-forms" />

<!-- 最严格配置 -->
<iframe sandbox="" />
```

### 内容安全策略
```html
<!-- 设置 CSP -->
<meta http-equiv="Content-Security-Policy" 
      content="frame-src 'self'; script-src 'self' https://cdn.tailwindcss.com">
```

## 🔧 常见问题解决

### 跨域错误
```javascript
// ❌ 错误方式
const doc = iframe.contentDocument // SecurityError

// ✅ 正确方式
<iframe srcDoc={content} />
```

### 高度自适应
```css
/* CSS 方式 */
iframe {
  height: 100vh;
  min-height: 300px;
}

/* JavaScript 方式 */
const resizeIframe = (iframe) => {
  iframe.style.height = iframe.contentWindow.document.body.scrollHeight + 'px'
}
```

### 加载状态
```typescript
const [isLoading, setIsLoading] = useState(true)

<iframe
  srcDoc={content}
  onLoad={() => setIsLoading(false)}
  style={{ opacity: isLoading ? 0.5 : 1 }}
/>
```

## 📊 性能对比

| 操作 | contentDocument | srcDoc |
|------|----------------|---------|
| 设置内容 | 60-250ms | 0-10ms |
| 内存使用 | 较高 | 较低 |
| 错误处理 | 复杂 | 简单 |
| 跨域支持 | ❌ | ✅ |

## 🎯 最佳实践总结

1. **优先使用 srcDoc** - 更安全、更快
2. **设置沙盒属性** - 限制权限
3. **使用 useMemo 缓存** - 避免重复计算
4. **添加错误处理** - 优雅降级
5. **监控性能** - 跟踪加载时间

---

*快速参考 - 2024年12月* 