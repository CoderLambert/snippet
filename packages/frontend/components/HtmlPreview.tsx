'use client'

import { useMemo } from 'react'

interface HtmlPreviewProps {
  htmlCode: string
  className?: string
}

export default function HtmlPreview({ htmlCode, className }: HtmlPreviewProps) {
  // 使用 useMemo 来优化性能，只在 htmlCode 变化时重新生成
  const fullHtml = useMemo(() => {
    // 检查是否已经是完整的HTML文档
    const isCompleteHtml = htmlCode.trim().toLowerCase().includes('<!doctype html') ||
                          htmlCode.trim().toLowerCase().includes('<html')
    
    if (isCompleteHtml) {
      // 如果已经是完整的HTML，确保包含TailwindCSS
      if (!htmlCode.includes('tailwindcss')) {
        // 在head标签中插入TailwindCSS
        return htmlCode.replace(
          /<head[^>]*>/i,
          '$&\n    <script src="https://cdn.tailwindcss.com"></script>'
        )
      }
      return htmlCode
    }
    
    // 如果不是完整的HTML，包装成完整文档
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
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        line-height: 1.5;
        background: #f8fafc;
        min-height: 100vh;
      }
      /* 确保内容正常显示 */
      * {
        box-sizing: border-box;
      }
      /* 避免滚动条问题 */
      html, body {
        overflow-x: hidden;
      }
    </style>
</head>
<body>
    ${htmlCode}
</body>
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