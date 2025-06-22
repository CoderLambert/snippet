'use client'

import { useState, useCallback, useEffect } from 'react'
import { Save, RotateCcw, X, Code, Eye, Download, Terminal, FileText, Maximize2, Minimize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import CodeEditor from './CodeEditor'
import HtmlPreview from './HtmlPreview'

interface FullscreenEditorProps {
  isOpen: boolean
  onClose: () => void
  initialCode: string
  language: string
  title?: string
  onSave?: (code: string) => Promise<boolean>
  readOnly?: boolean
}

export default function FullscreenEditor({
  isOpen,
  onClose,
  initialCode,
  language,
  title,
  onSave,
  readOnly = false,
}: FullscreenEditorProps) {
  const [code, setCode] = useState(initialCode)
  const [originalCode] = useState(initialCode)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [showOutput, setShowOutput] = useState(false)
  const [panelSizes, setPanelSizes] = useState<number[]>([50, 50])
  
  // 检查是否为HTML代码
  const isHtmlCode = language.toLowerCase() === 'html' || 
                     code.trim().startsWith('<!DOCTYPE html') ||
                     code.trim().startsWith('<html')

  // 键盘快捷键处理
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      
      // Ctrl/Cmd + S 保存
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        if (onSave && hasChanges && !isSaving) {
          handleSave()
        }
      }
      
      // Ctrl/Cmd + R 重置
      if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault()
        if (hasChanges) {
          handleReset()
        }
      }
      
      // Ctrl/Cmd + ` 切换输出面板（非HTML代码）
      if ((e.ctrlKey || e.metaKey) && e.key === '`' && !isHtmlCode) {
        e.preventDefault()
        toggleOutput()
      }
      
      // Escape 关闭编辑器
      if (e.key === 'Escape') {
        e.preventDefault()
        handleClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, hasChanges, isSaving, isHtmlCode])

  // 处理代码变化
  const handleCodeChange = useCallback((value: string | undefined) => {
    const newCode = value || ''
    setCode(newCode)
    setHasChanges(newCode !== originalCode)
  }, [originalCode])

  // 处理面板大小变化
  const handlePanelResize = useCallback((sizes: number[]) => {
    setPanelSizes(sizes)
  }, [])

  // 处理保存
  const handleSave = async () => {
    if (!onSave || isSaving) return
    
    setIsSaving(true)
    try {
      const success = await onSave(code)
      if (success) {
        setHasChanges(false)
      }
    } catch (error) {
      console.error('保存失败:', error)
    } finally {
      setIsSaving(false)
    }
  }

  // 重置代码
  const handleReset = () => {
    setCode(originalCode)
    setHasChanges(false)
  }

  // 下载代码
  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title || 'code'}.${language === 'html' ? 'html' : language}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // 关闭编辑器
  const handleClose = () => {
    if (hasChanges) {
      const confirmed = window.confirm('您有未保存的更改，确定要关闭吗？')
      if (!confirmed) return
    }
    onClose()
  }

  // 切换输出面板
  const toggleOutput = () => {
    setShowOutput(!showOutput)
  }

  // 重置面板大小
  const resetPanelSizes = () => {
    setPanelSizes([50, 50])
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[98vw] max-h-[98vh] w-full h-full p-0 fullscreen-editor">
        <DialogHeader className="px-6 py-4 border-b bg-gray-50 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DialogTitle className="text-lg font-semibold">
                {title || `${language} 实时编辑器`}
              </DialogTitle>
              {hasChanges && (
                <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                  未保存的更改
                </span>
              )}
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {isHtmlCode ? '左右布局' : showOutput ? '上下布局' : '单面板'}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {!readOnly && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    disabled={!hasChanges}
                    className="flex items-center gap-2"
                    title="重置代码 (Ctrl+R)"
                  >
                    <RotateCcw className="h-4 w-4" />
                    重置
                  </Button>
                  
                  {onSave && (
                    <Button
                      size="sm"
                      onClick={handleSave}
                      disabled={isSaving || !hasChanges}
                      className="flex items-center gap-2"
                      title="保存更改 (Ctrl+S)"
                    >
                      <Save className="h-4 w-4" />
                      {isSaving ? '保存中...' : '保存'}
                    </Button>
                  )}
                </>
              )}
              
              {!isHtmlCode && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleOutput}
                  className="flex items-center gap-2"
                  title="切换输出面板 (Ctrl+`)"
                >
                  <Terminal className="h-4 w-4" />
                  {showOutput ? '隐藏输出' : '显示输出'}
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={resetPanelSizes}
                className="flex items-center gap-2"
                title="重置面板大小"
              >
                <Maximize2 className="h-4 w-4" />
                重置布局
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="flex items-center gap-2"
                title="下载代码"
              >
                <Download className="h-4 w-4" />
                下载
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="flex items-center gap-2"
                title="关闭编辑器 (Escape)"
              >
                <X className="h-4 w-4" />
                关闭
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 flex h-full">
          {isHtmlCode ? (
            // HTML代码：可拖拽的左右分栏布局
            <PanelGroup 
              direction="horizontal" 
              className="w-full"
              onLayout={handlePanelResize}
            >
              {/* 左侧代码编辑器面板 */}
              <Panel defaultSize={panelSizes[0]} minSize={25} maxSize={75}>
                <div className="h-full flex flex-col">
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                    <h3 className="text-sm font-medium flex items-center gap-2">
                      <Code className="h-4 w-4" />
                      代码编辑器
                    </h3>
                  </div>
                  <div className="flex-1 p-4">
                    <CodeEditor
                      value={code}
                      onChange={handleCodeChange}
                      language={language}
                      height="100%"
                      readOnly={readOnly}
                      hideErrors={false}
                      className="h-full"
                    />
                  </div>
                </div>
              </Panel>
              
              {/* 拖拽分隔条 */}
              <PanelResizeHandle className="w-1 bg-gray-200 dark:bg-gray-700 hover:bg-blue-400 dark:hover:bg-blue-500 transition-all duration-200 relative group cursor-col-resize">
                <div className="resize-handle-indicator horizontal" />
              </PanelResizeHandle>
              
              {/* 右侧实时预览面板 */}
              <Panel defaultSize={panelSizes[1]} minSize={25} maxSize={75}>
                <div className="h-full flex flex-col">
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                    <h3 className="text-sm font-medium flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      实时预览
                    </h3>
                  </div>
                  <div className="flex-1 p-4">
                    <HtmlPreview 
                      htmlCode={code} 
                      className="h-full border rounded-md"
                    />
                  </div>
                </div>
              </Panel>
            </PanelGroup>
          ) : (
            // 非HTML代码：可拖拽的上下分栏布局
            <PanelGroup 
              direction="vertical" 
              className="w-full"
              onLayout={handlePanelResize}
            >
              {/* 上方代码编辑器面板 */}
              <Panel defaultSize={showOutput ? 70 : 100} minSize={30}>
                <div className="h-full flex flex-col">
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                    <h3 className="text-sm font-medium flex items-center gap-2">
                      <Code className="h-4 w-4" />
                      代码编辑器
                    </h3>
                  </div>
                  <div className="flex-1 p-4">
                    <CodeEditor
                      value={code}
                      onChange={handleCodeChange}
                      language={language}
                      height="100%"
                      readOnly={readOnly}
                      hideErrors={false}
                      className="h-full"
                    />
                  </div>
                </div>
              </Panel>
              
              {/* 输出面板（可选显示） */}
              {showOutput && (
                <>
                  {/* 拖拽分隔条 */}
                  <PanelResizeHandle className="h-1 bg-gray-200 dark:bg-gray-700 hover:bg-blue-400 dark:hover:bg-blue-500 transition-all duration-200 relative group cursor-row-resize">
                    <div className="resize-handle-indicator vertical" />
                  </PanelResizeHandle>
                  
                  {/* 下方输出面板 */}
                  <Panel defaultSize={30} minSize={15} maxSize={70}>
                    <div className="h-full flex flex-col">
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium flex items-center gap-2">
                            <Terminal className="h-4 w-4" />
                            输出/控制台
                          </h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleOutput}
                            className="h-6 w-6 p-0"
                            title="关闭输出面板"
                          >
                            <Minimize2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex-1 p-4 bg-gray-50 dark:bg-gray-900">
                        <div className="h-full bg-black text-green-400 font-mono text-sm p-4 rounded-md overflow-auto">
                          <div className="opacity-60">
                            # 代码输出将在这里显示
                          </div>
                          <div className="mt-2 opacity-40">
                            # 快捷键：Ctrl+` 切换此面板
                          </div>
                          <div className="mt-2">
                            <span className="text-gray-500">{`> `}</span>
                            <span className="animate-pulse">_</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Panel>
                </>
              )}
            </PanelGroup>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 