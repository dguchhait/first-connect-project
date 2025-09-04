'use client'
import { Editor } from '@tiptap/react'
import { useEffect, useRef, useState } from 'react'

interface FloatingToolbarProps {
  editor: Editor
  onAIPreview: (data: { original: string, suggestion: string }) => void
}

export default function FloatingToolbar({ editor, onAIPreview }: FloatingToolbarProps) {
  const [show, setShow] = useState(false)
  const [coords, setCoords] = useState<{top: number, left: number}>({ top: 0, left: 0 })
  const toolbarRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(false)

  // Detect selection and position toolbar
  useEffect(() => {
    const handleSelectionChange = () => {
      if (!editor) return
      const { from, to } = editor.state.selection
      if (from === to) {
        setShow(false)
        return
      }
      const domSelection = window.getSelection()
      if (!domSelection?.rangeCount) {
        setShow(false)
        return
      }
      const range = domSelection.getRangeAt(0)
      const rect = range.getBoundingClientRect()
      setCoords({
        top: rect.top + window.scrollY - 48,
        left: rect.left + window.scrollX + rect.width / 2,
      })
      setShow(true)
    }
    document.addEventListener('selectionchange', handleSelectionChange)
    return () => document.removeEventListener('selectionchange', handleSelectionChange)
  }, [editor])

  // Helpers for actions
  const getSelectedText = () => {
    const { from, to } = editor.state.selection
    return editor.state.doc.textBetween(from, to, ' ')
  }

  const handleAIEdit = async () => {
    setLoading(true)
    const selectedText = getSelectedText()
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: `Edit this: ${selectedText}` }),
      })
      const data = await res.json()
      onAIPreview({
        original: selectedText,
        suggestion: data.result || 'AI suggestion',
      })
    } catch (err) {
      onAIPreview({
        original: selectedText,
        suggestion: 'Error contacting AI',
      })
    } finally {
      setLoading(false)
    }
  }

  // Optionally: Implement these with similar AI calls and PreviewModal
  const stubAction = (action: string) => {
    alert(`${action} action is a stub. You can implement with AI like 'Edit with AI'.`)
  }

  if (!show) return null

  return (
    <div
      ref={toolbarRef}
      style={{
        position: 'absolute',
        top: coords.top,
        left: coords.left,
        transform: 'translate(-50%, -100%)',
        zIndex: 50,
      }}
      className="bg-white shadow-lg border rounded flex gap-2 px-4 py-2"
    >
      <button className="text-sm hover:bg-gray-100 rounded px-2" onClick={() => stubAction('Shorten')}>Shorten</button>
      <button className="text-sm hover:bg-gray-100 rounded px-2" onClick={() => stubAction('Lengthen')}>Lengthen</button>
      <button className="text-sm hover:bg-gray-100 rounded px-2" onClick={() => stubAction('Convert to table')}>Convert to table</button>
      <button
        className="text-sm bg-blue-600 text-white rounded px-2"
        onClick={handleAIEdit}
        disabled={loading}
      >
        {loading ? 'AI...' : 'Edit with AI'}
      </button>
    </div>
  )
}