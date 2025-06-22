# iframe 内容访问方法对比

## 概述

在Web开发中，访问iframe内容有两种主要方法：
1. **传统方式**：`iframe.contentDocument` 直接访问
2. **现代方式**：`srcDoc` 属性设置

## 方法对比

### iframe.contentDocument 方式

```javascript
// 传统方式
const iframe = document.getElementById('myIframe')
const doc = iframe.contentDocument || iframe.contentWindow?.document
doc.open()
doc.write(htmlContent)
doc.close()
```

**特点：**
- ✅ 可以动态修改内容
- ✅ 支持所有浏览器
- ❌ 受同源策略限制
- ❌ 需要等待加载
- ❌ 容易产生跨域错误

### srcDoc 方式

```javascript
// 现代方式
<iframe srcDoc={htmlContent} sandbox="allow-scripts" />
```

**特点：**
- ✅ 无跨域问题
- ✅ 内容立即生效
- ✅ 更安全
- ✅ 性能更好
- ❌ 不支持IE
- ❌ 无法动态修改

## 性能对比

**传统方式：** 60-250ms (需要等待加载)
**srcDoc方式：** 0-10ms (立即生效)

## 安全性

**contentDocument：** 受同源策略限制，可能产生跨域错误
**srcDoc：** 沙盒环境隔离，更安全

## 实际应用示例

### 代码片段管理系统中的使用

```typescript
// HtmlPreview.tsx
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

## 最佳实践

**使用 contentDocument 的场景：**
- 需要动态修改内容
- 需要支持旧浏览器
- 需要与内容交互

**使用 srcDoc 的场景：**
- HTML预览功能
- 避免跨域问题
- 追求更好性能

## 迁移指南

```javascript
// 旧代码
const updateContent = (html) => {
  const iframe = document.getElementById('myIframe')
  const doc = iframe.contentDocument
  doc.open()
  doc.write(html)
  doc.close()
}

// 新代码
const updateContent = (html) => {
  const iframe = document.getElementById('myIframe')
  iframe.srcDoc = html
}
```

## 总结

| 特性 | contentDocument | srcDoc |
|------|----------------|---------|
| 安全性 | ❌ 跨域限制 | ✅ 无问题 |
| 性能 | ⚠️ 较慢 | ✅ 更快 |
| 兼容性 | ✅ 全支持 | ✅ 现代浏览器 |
| 易用性 | ❌ 复杂 | ✅ 简单 |

**推荐：** 对于HTML预览功能，优先使用 `srcDoc` 方式。 