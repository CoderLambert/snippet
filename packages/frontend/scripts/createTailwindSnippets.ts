// TailwindCSS 经典代码片段数据
export const tailwindSnippets = [
  {
    title: "响应式导航栏",
    description: "使用 Flexbox 和响应式设计的现代导航栏",
    language: "html",
    category: "导航组件",
    tags: ["导航", "响应式", "Flexbox"],
    code: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>响应式导航栏</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">
    <nav class="bg-white shadow-lg">
        <div class="max-w-7xl mx-auto px-4">
            <div class="flex justify-between items-center h-16">
                <div class="flex-shrink-0">
                    <h1 class="text-2xl font-bold text-gray-800">Logo</h1>
                </div>
                <div class="hidden md:block">
                    <div class="ml-10 flex items-baseline space-x-4">
                        <a href="#" class="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">首页</a>
                        <a href="#" class="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">产品</a>
                        <a href="#" class="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">服务</a>
                        <a href="#" class="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">联系</a>
                    </div>
                </div>
                <div class="md:hidden">
                    <button class="text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900">
                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </nav>
</body>
</html>`
  },
  
  {
    title: "卡片网格布局",
    description: "响应式的卡片网格，展示产品或文章列表",
    language: "html", 
    category: "布局组件",
    tags: ["网格", "卡片", "响应式"],
    code: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>卡片网格布局</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
            <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                特色产品
            </h2>
            <p class="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                精心挑选的优质产品，为您提供最佳体验
            </p>
        </div>
        
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <!-- 产品卡片 1 -->
            <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div class="h-48 bg-gradient-to-r from-purple-400 to-pink-400"></div>
                <div class="p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">产品名称</h3>
                    <p class="text-gray-600 text-sm mb-4">产品的简短描述，介绍主要特点和优势。</p>
                    <div class="flex items-center justify-between">
                        <span class="text-2xl font-bold text-gray-900">¥299</span>
                        <button class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                            购买
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- 产品卡片 2 -->
            <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div class="h-48 bg-gradient-to-r from-green-400 to-blue-400"></div>
                <div class="p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">产品名称</h3>
                    <p class="text-gray-600 text-sm mb-4">产品的简短描述，介绍主要特点和优势。</p>
                    <div class="flex items-center justify-between">
                        <span class="text-2xl font-bold text-gray-900">¥199</span>
                        <button class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                            购买
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- 产品卡片 3 -->
            <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div class="h-48 bg-gradient-to-r from-yellow-400 to-red-400"></div>
                <div class="p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">产品名称</h3>
                    <p class="text-gray-600 text-sm mb-4">产品的简短描述，介绍主要特点和优势。</p>
                    <div class="flex items-center justify-between">
                        <span class="text-2xl font-bold text-gray-900">¥399</span>
                        <button class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                            购买
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- 产品卡片 4 -->
            <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div class="h-48 bg-gradient-to-r from-indigo-400 to-purple-400"></div>
                <div class="p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">产品名称</h3>
                    <p class="text-gray-600 text-sm mb-4">产品的简短描述，介绍主要特点和优势。</p>
                    <div class="flex items-center justify-between">
                        <span class="text-2xl font-bold text-gray-900">¥499</span>
                        <button class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                            购买
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`
  }
]; 