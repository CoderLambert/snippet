'use client'

import { useMemo, useState } from 'react'

interface HtmlPreviewProps {
  htmlCode: string
  className?: string
}

export default function HtmlPreview({ htmlCode, className }: HtmlPreviewProps) {
  const [previewError, setPreviewError] = useState<string | null>(null)
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

  // 如果没有代码，显示提示
  if (!htmlCode.trim()) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-gray-50 rounded-md ${className}`}>
        <p className="text-gray-500">请输入HTML代码以查看预览</p>
      </div>
    )
  }

  // 如果有错误，显示错误信息
  if (previewError) {
    return (
      <div className={`w-full h-full flex flex-col items-center justify-center bg-red-50 rounded-md p-4 ${className}`}>
        <p className="text-red-600 mb-2">预览加载失败</p>
        <p className="text-red-500 text-sm">{previewError}</p>
        <button 
          onClick={() => setPreviewError(null)}
          className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
        >
          重试
        </button>
      </div>
    )
  }

  return (
    <div className={`w-full h-full ${className}`}>
      <iframe
        srcDoc={fullHtml}
        className="w-full h-full border-0 bg-white rounded-md"
        title="HTML Preview"
        sandbox="allow-scripts allow-same-origin allow-forms"
        style={{ minHeight: '300px', maxWidth: '100%' }}
        onLoad={() => {
          setPreviewError(null)
        }}
        onError={(e) => {
          console.error('Preview iframe error:', e)
          setPreviewError('iframe加载失败')
        }}
      />
    </div>
  )
} 