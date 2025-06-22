'use client'

import { Grid3x3, List, Rows } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ViewModeToggleProps {
  viewMode: 'grid' | 'list' | 'compact'
  onViewModeChange: (mode: 'grid' | 'list' | 'compact') => void
}

export default function ViewModeToggle({ viewMode, onViewModeChange }: ViewModeToggleProps) {
  const modes = [
    {
      key: 'grid' as const,
      icon: Grid3x3,
      label: '网格视图',
      description: '卡片式展示，适合快速浏览'
    },
    {
      key: 'list' as const,
      icon: List,
      label: '列表视图',
      description: '详细信息展示，适合查看详情'
    },
    {
      key: 'compact' as const,
      icon: Rows,
      label: '紧凑视图',
      description: '紧凑排列，适合大量数据'
    }
  ]

  return (
    <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
      {modes.map((mode) => {
        const Icon = mode.icon
        const isActive = viewMode === mode.key
        
        return (
          <Button
            key={mode.key}
            variant={isActive ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange(mode.key)}
            className={`h-8 px-3 transition-all duration-200 ${
              isActive 
                ? 'bg-white dark:bg-gray-700 shadow-sm' 
                : 'hover:bg-white/50 dark:hover:bg-gray-700/50'
            }`}
            title={mode.description}
          >
            <Icon className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">{mode.label}</span>
          </Button>
        )
      })}
    </div>
  )
} 