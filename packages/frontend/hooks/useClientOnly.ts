import { useEffect, useState } from 'react'

/**
 * 用于避免hydration不匹配的Hook
 * 只有在客户端挂载后才返回true
 */
export const useClientOnly = () => {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  return hasMounted
}

interface ClientOnlyProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * 包装器组件，只在客户端渲染子组件
 */
export function ClientOnly({ 
  children, 
  fallback = null 
}: ClientOnlyProps) {
  const hasMounted = useClientOnly()

  if (!hasMounted) {
    return fallback as React.ReactElement
  }

  return children as React.ReactElement
} 