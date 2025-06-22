'use client'

import { useState } from 'react'
import { Maximize2, Copy, Check, Eye, Code, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import CodeEditor from './CodeEditor'
import HtmlPreview from './HtmlPreview'
import FullscreenEditor from './FullscreenEditor'

interface CodeViewerProps {
  code: string
  language: string
  height?: string
  className?: string
  title?: string
  onSave?: (code: string) => Promise<boolean>
  readOnly?: boolean
  hideLineNumbers?: boolean
  searchTerm?: string
}

export default function CodeViewer({
  code,
  language,
  height = '250px',
  className,
  title,
  onSave,
  readOnly = false,
  hideLineNumbers = false,
  searchTerm = '',
}: CodeViewerProps) {
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  
  // 检查是否为HTML代码
  const isHtmlCode = language.toLowerCase() === 'html' || 
                     code.trim().startsWith('<!DOCTYPE html') ||
                     code.trim().startsWith('<html')

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('复制失败:', err)
    }
  }

  return (
    <>
      <div className={`relative group ${className}`}>
        {isHtmlCode ? (
          // HTML代码显示标签页
          <Tabs defaultValue="code" className="w-full">
            {/* <TabsList className="mb-2">
              <TabsTrigger value="code" className="flex items-center gap-1">
                <Code className="h-3 w-3" />
                代码
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                预览
              </TabsTrigger>
            </TabsList> */}
            <TabsContent value="code">
              <CodeEditor
                value={code}
                language={language}
                height={height}
                readOnly
                hideErrors
                hideLineNumbers={hideLineNumbers}
                searchTerm={searchTerm}
              />
            </TabsContent>
            <TabsContent value="preview">
              <div style={{ height }} className="flex items-center justify-center">
                <Button
                  variant="outline"
                  onClick={() => setIsPreviewOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  点击查看预览
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          // 非HTML代码只显示代码编辑器
          <CodeEditor
            value={code}
            language={language}
            height={height}
            readOnly
            hideErrors
            hideLineNumbers={hideLineNumbers}
            searchTerm={searchTerm}
          />
        )}
        
        {/* 悬浮操作按钮 */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1 code-viewer-buttons p-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-7 w-7 p-0 hover:bg-black/10 dark:hover:bg-white/10"
            title={isCopied ? "已复制" : "复制代码"}
          >
            {isCopied ? (
              <Check className="h-3 w-3 text-green-600" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
          {isHtmlCode && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPreviewOpen(true)}
              className="h-7 w-7 p-0 hover:bg-black/10 dark:hover:bg-white/10"
              title="预览"
            >
              <Eye className="h-3 w-3" />
            </Button>
          )}
          {!readOnly && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditorOpen(true)}
              className="h-7 w-7 p-0 hover:bg-black/10 dark:hover:bg-white/10"
              title="实时编辑"
            >
              <Edit className="h-3 w-3" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFullscreenOpen(true)}
            className="h-7 w-7 p-0 hover:bg-black/10 dark:hover:bg-white/10"
            title="全屏查看"
          >
            <Maximize2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* 预览弹窗 */}
      {isHtmlCode && (
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="max-w-[90vw] max-h-[90vh] w-full h-full p-0">
            <DialogHeader className="px-6 py-4 border-b">
              <DialogTitle>
                {title || `${language} 预览`}
              </DialogTitle>
            </DialogHeader>
            
            <div className="flex-1 p-4">
              <div style={{ height: 'calc(90vh - 120px)' }}>
                <HtmlPreview 
                  htmlCode={code} 
                  className="h-full"
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* 实时编辑器 */}
      <FullscreenEditor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        initialCode={code}
        language={language}
        title={title}
        onSave={onSave}
        readOnly={readOnly}
      />

      {/* 全屏对话框 */}
      <Dialog open={isFullscreenOpen} onOpenChange={setIsFullscreenOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full p-0 fullscreen-dialog">
          <DialogHeader className="px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <DialogTitle>
                {title || `${language} 代码`}
              </DialogTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                >
                  {isCopied ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      已复制
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      复制代码
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogHeader>
          
          <div className="flex-1 p-4">
            {isHtmlCode ? (
              // HTML代码全屏模式：代码和预览各占一半宽度
              <div className="flex gap-4 h-full">
                <div className="w-1/2">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <Code className="h-4 w-4" />
                      代码
                    </h3>
                  </div>
                  <CodeEditor
                    value={code}
                    language={language}
                    height="calc(95vh - 180px)"
                    readOnly
                    hideErrors
                    hideLineNumbers={hideLineNumbers}
                    searchTerm={searchTerm}
                  />
                </div>
                <div className="w-1/2">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      预览
                    </h3>
                  </div>
                  <HtmlPreview 
                    htmlCode={code} 
                    className="h-full"
                  />
                </div>
              </div>
            ) : (
              // 非HTML代码全屏模式
              <CodeEditor
                value={code}
                language={language}
                height="calc(95vh - 120px)"
                readOnly
                hideErrors
                hideLineNumbers={hideLineNumbers}
                searchTerm={searchTerm}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
} 