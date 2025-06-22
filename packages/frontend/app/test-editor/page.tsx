'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import FullscreenEditor from '@/components/FullscreenEditor'

export default function TestEditorPage() {
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  
  const sampleHtmlCode = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TailwindCSS 示例</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen">
    <div class="container mx-auto px-4 py-8">
        <div class="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            <div class="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
                <h1 class="text-white text-xl font-bold">欢迎使用</h1>
                <p class="text-blue-100 mt-1">实时编辑器演示</p>
            </div>
            <div class="p-6">
                <div class="space-y-4">
                    <div class="flex items-center space-x-3">
                        <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span class="text-gray-700">功能特性</span>
                    </div>
                    <div class="flex items-center space-x-3">
                        <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span class="text-gray-700">实时预览</span>
                    </div>
                    <div class="flex items-center space-x-3">
                        <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span class="text-gray-700">代码编辑</span>
                    </div>
                </div>
                <button class="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                    开始编辑
                </button>
            </div>
        </div>
    </div>
</body>
</html>`

  const sampleJsCode = `// JavaScript 示例代码
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// 计算前10个斐波那契数
const fibSequence = [];
for (let i = 0; i < 10; i++) {
  fibSequence.push(fibonacci(i));
}

console.log('斐波那契数列:', fibSequence);

// 使用现代JavaScript特性
const doubled = fibSequence.map(n => n * 2);
const evenNumbers = doubled.filter(n => n % 2 === 0);

console.log('双倍后的偶数:', evenNumbers);

// 异步函数示例
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('获取数据失败:', error);
    return null;
  }
}`

  const handleSave = async (code: string) => {
    // 模拟保存操作
    console.log('保存代码:', code)
    await new Promise(resolve => setTimeout(resolve, 1000))
    return true
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">全屏实时编辑器测试</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* HTML 示例 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-blue-600">HTML</span>
                <span className="text-sm text-gray-500">实时预览</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                点击下方按钮打开HTML全屏编辑器，支持实时预览功能。
              </p>
              <Button 
                onClick={() => setIsEditorOpen(true)}
                className="w-full"
              >
                打开HTML编辑器
              </Button>
            </CardContent>
          </Card>

          {/* JavaScript 示例 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-yellow-600">JavaScript</span>
                <span className="text-sm text-gray-500">代码编辑</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                点击下方按钮打开JavaScript全屏编辑器。
              </p>
              <Button 
                variant="outline"
                onClick={() => {
                  // 这里可以添加JavaScript编辑器的逻辑
                  alert('JavaScript编辑器功能待实现')
                }}
                className="w-full"
              >
                打开JS编辑器
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* 功能说明 */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>功能特性</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>实时代码编辑和预览</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>支持HTML实时预览</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>代码保存和重置功能</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>响应式布局设计</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>代码下载功能</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* HTML 全屏编辑器 */}
      <FullscreenEditor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        initialCode={sampleHtmlCode}
        language="html"
        title="HTML 实时编辑器"
        onSave={handleSave}
      />
    </div>
  )
} 