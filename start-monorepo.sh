#!/bin/bash

echo "🚀 启动代码片段管理系统 (Monorepo)"
echo "================================="

# 检查 pnpm 是否安装
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm 未安装，正在安装..."
    npm install -g pnpm
fi

echo "✅ pnpm 版本: $(pnpm --version)"

# 检查是否存在后端环境文件
if [ ! -f "packages/backend/.env" ]; then
    echo "⚠️  后端 .env 文件不存在，创建默认配置..."
    mkdir -p packages/backend
    cat > packages/backend/.env << EOF
# Database Configuration
DATABASE_URL="postgresql://postgres:lambert@localhost:5432/snippet?schema=public"

# Application Configuration
PORT=3001
EOF
    echo "✅ 已创建 packages/backend/.env 文件"
fi

# 安装依赖
echo "📦 安装依赖..."
if [ ! -d "node_modules" ]; then
    pnpm install
else
    echo "✅ 依赖已安装"
fi

# 生成 Prisma 客户端
echo "🔧 生成 Prisma 客户端..."
pnpm db:generate

echo ""
echo "🌟 启动开发服务器..."
echo "   - 后端 API: http://localhost:3001"
echo "   - 前端界面: http://localhost:3000"
echo ""
echo "按 Ctrl+C 停止服务器"
echo ""

# 启动前后端
pnpm dev 