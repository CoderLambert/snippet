'use client'

import { Editor } from '@monaco-editor/react'
import { useEffect, useRef } from 'react'

interface CodeEditorProps {
  value: string
  onChange?: (value: string | undefined) => void
  language?: string
  height?: string
  readOnly?: boolean
  className?: string
  hideErrors?: boolean
  hideLineNumbers?: boolean
  searchTerm?: string
}

export default function CodeEditor({
  value,
  onChange,
  language = 'javascript',
  height = '300px',
  readOnly = false,
  className,
  hideErrors = false,
  hideLineNumbers = false,
  searchTerm = '',
}: CodeEditorProps) {
  const editorRef = useRef<any>(null)

  // 处理编辑器挂载
  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor
    
    // 如果有搜索词，则高亮显示
    if (searchTerm) {
      highlightSearchTerm(editor, monaco, searchTerm)
    }
  }

  // 高亮搜索词
  const highlightSearchTerm = (editor: any, monaco: any, term: string) => {
    if (!term || !editor) return

    // 清除之前的高亮
    const model = editor.getModel()
    if (!model) return

    // 查找所有匹配项
    const matches = model.findMatches(
      term,
      false, // 不搜索全词
      false, // 不区分大小写
      false, // 不使用正则
      null,
      false
    )

    // 添加高亮装饰
    const decorations = matches.map((match: any) => ({
      range: match.range,
      options: {
        className: 'search-highlight',
        inlineClassName: 'search-highlight-inline',
        stickiness: monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges
      }
    }))

    editor.deltaDecorations([], decorations)
  }

  // 当搜索词改变时重新高亮
  useEffect(() => {
    if (editorRef.current && searchTerm) {
      const monaco = (window as any).monaco
      if (monaco) {
        highlightSearchTerm(editorRef.current, monaco, searchTerm)
      }
    } else if (editorRef.current && !searchTerm) {
      // 清除高亮
      editorRef.current.deltaDecorations([], [])
    }
  }, [searchTerm])

  return (
    <div className={`border rounded-md overflow-hidden ${className}`}>
      <Editor
        height={height}
        language={language.toLowerCase()}
        value={value}
        onChange={onChange}
        theme="vs"
        onMount={handleEditorDidMount}
        options={{
          readOnly,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          lineNumbers: hideLineNumbers ? 'off' : 'on',
          automaticLayout: true,
          wordWrap: 'on',
          tabSize: 2,
          insertSpaces: true,
          folding: true,
          lineDecorationsWidth: hideLineNumbers ? 0 : 10,
          lineNumbersMinChars: hideLineNumbers ? 0 : 3,
          // 禁用语法错误提示和自动补全
          quickSuggestions: hideErrors ? false : true,
          parameterHints: { enabled: !hideErrors },
          suggestOnTriggerCharacters: !hideErrors,
          acceptSuggestionOnEnter: hideErrors ? 'off' : 'on',
          tabCompletion: hideErrors ? 'off' : 'on',
          wordBasedSuggestions: hideErrors ? 'off' : 'currentDocument',
          // 禁用错误提示的下划线
          renderValidationDecorations: hideErrors ? 'off' : 'on',
        }}
      />
    </div>
  )
} 