# iframe 安全性与性能深度分析

## 安全风险分析

### 1. 同源策略 (Same-Origin Policy)

**问题描述：**
```javascript
// 当iframe内容来自不同域名时
const iframe = document.getElementById('external-iframe')
try {
  const doc = iframe.contentDocument
  // SecurityError: Failed to read a named property 'document'
} catch (error) {
  console.error('跨域访问被阻止:', error)
}
```

**安全影响：**
- 无法访问跨域iframe的DOM
- 无法执行跨域iframe的脚本
- 无法读取跨域iframe的cookie

### 2. XSS 攻击风险

**contentDocument 方式的风险：**
```javascript
// 危险：直接写入用户输入
const userInput = '<script>alert("XSS")</script>'
const doc = iframe.contentDocument
doc.write(userInput) // 可能执行恶意脚本
```

**srcDoc 方式的安全优势：**
```javascript
// 安全：沙盒环境隔离
<iframe 
  srcDoc={userInput}
  sandbox="allow-scripts" // 限制权限
/>
```

## 性能优化策略

### 1. 懒加载优化

```typescript
// 优化前：立即加载所有iframe
const IframeGrid = ({ items }) => (
  <div>
    {items.map(item => (
      <iframe key={item.id} srcDoc={item.html} />
    ))}
  </div>
)

// 优化后：懒加载
const LazyIframe = ({ html, isVisible }) => {
  if (!isVisible) {
    return <div className="placeholder">加载中...</div>
  }
  
  return <iframe srcDoc={html} />
}
```

### 2. 内存管理

```typescript
// 避免内存泄漏
const HtmlPreview = ({ htmlCode }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  
  useEffect(() => {
    return () => {
      // 清理iframe引用
      if (iframeRef.current) {
        iframeRef.current.srcDoc = ''
      }
    }
  }, [])
  
  return <iframe ref={iframeRef} srcDoc={htmlCode} />
}
```

### 3. 内容缓存

```typescript
// 使用 useMemo 缓存生成的HTML
const HtmlPreview = ({ htmlCode }) => {
  const fullHtml = useMemo(() => {
    return generateFullHtml(htmlCode)
  }, [htmlCode]) // 只在 htmlCode 变化时重新计算
  
  return <iframe srcDoc={fullHtml} />
}
```

## 实际项目中的应用

### 代码片段管理系统

**项目需求：**
- HTML代码实时预览
- TailwindCSS样式支持
- 安全的内容渲染
- 良好的性能表现

**解决方案：**
```typescript
// HtmlPreview.tsx
interface HtmlPreviewProps {
  htmlCode: string
  className?: string
}

export default function HtmlPreview({ htmlCode, className }: HtmlPreviewProps) {
  const fullHtml = useMemo(() => {
    // 检查是否已经是完整的HTML文档
    const isCompleteHtml = htmlCode.trim().toLowerCase().includes('<!doctype html')
    
    if (isCompleteHtml) {
      // 确保包含TailwindCSS
      if (!htmlCode.includes('tailwindcss')) {
        return htmlCode.replace(
          /<head[^>]*>/i,
          '$&\n    <script src="https://cdn.tailwindcss.com"></script>'
        )
      }
      return htmlCode
    }
    
    // 包装成完整文档
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TailwindCSS Preview</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.5;
        background: #f8fafc;
        min-height: 100vh;
      }
      * {
        box-sizing: border-box;
      }
      html, body {
        overflow-x: hidden;
      }
    </style>
</head>
<body>${htmlCode}</body>
</html>`
  }, [htmlCode])

  return (
    <iframe
      srcDoc={fullHtml}
      className={`w-full border-0 bg-white rounded-md ${className}`}
      title="HTML Preview"
      sandbox="allow-scripts"
      style={{ minHeight: '300px', maxWidth: '100%' }}
    />
  )
}
```

## 错误处理最佳实践

### 1. 优雅降级

```typescript
// 检测浏览器支持
const supportsSrcDoc = 'srcDoc' in document.createElement('iframe')

const HtmlPreview = ({ htmlCode }) => {
  if (supportsSrcDoc) {
    return <iframe srcDoc={htmlCode} />
  } else {
    // 降级到传统方式
    return <LegacyIframe htmlCode={htmlCode} />
  }
}
```

### 2. 错误边界

```typescript
// ErrorBoundary.tsx
class IframeErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <p>预览加载失败</p>
          <button onClick={() => this.setState({ hasError: false })}>
            重试
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
```

### 3. 加载状态

```typescript
const HtmlPreview = ({ htmlCode }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {hasError && (
        <div className="p-4 text-center text-red-600">
          预览加载失败
        </div>
      )}
      
      <iframe
        srcDoc={htmlCode}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false)
          setHasError(true)
        }}
        style={{ opacity: isLoading ? 0 : 1 }}
      />
    </div>
  )
}
```

## 性能监控

### 1. 加载时间监控

```typescript
const HtmlPreview = ({ htmlCode }) => {
  const startTime = useRef(Date.now())
  
  const handleLoad = () => {
    const loadTime = Date.now() - startTime.current
    console.log(`iframe加载时间: ${loadTime}ms`)
    
    // 发送性能数据
    if (loadTime > 1000) {
      console.warn('iframe加载时间过长')
    }
  }
  
  return (
    <iframe
      srcDoc={htmlCode}
      onLoad={handleLoad}
    />
  )
}
```

### 2. 内存使用监控

```typescript
// 监控iframe数量
const iframeCount = document.querySelectorAll('iframe').length
if (iframeCount > 10) {
  console.warn('iframe数量过多，可能影响性能')
}
```

## 总结

### 安全建议
1. **优先使用 srcDoc**：避免跨域问题
2. **设置沙盒属性**：限制iframe权限
3. **内容验证**：确保HTML内容安全
4. **错误处理**：优雅处理加载失败

### 性能建议
1. **懒加载**：只在需要时加载iframe
2. **内容缓存**：使用useMemo避免重复计算
3. **内存管理**：及时清理不需要的iframe
4. **监控性能**：跟踪加载时间和内存使用

### 兼容性建议
1. **检测支持**：检查浏览器是否支持srcDoc
2. **优雅降级**：为旧浏览器提供替代方案
3. **渐进增强**：先提供基础功能，再增强体验

通过这些最佳实践，可以构建安全、高性能的iframe应用。 