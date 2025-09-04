use client
import { useImperativeHandle, useRef, useState, forwardRef } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import FloatingToolbar from './FloatingToolbar'
import PreviewModal from './PreviewModal'

export interface EditorHandle {
  insertText: (text: string) => void
}

const Editor = forwardRef<EditorHandle, {}>(function Editor(_, ref) {
  const [preview, setPreview] = useState<{ open: boolean, original: string, suggestion: string }>({ open: false, original: '', suggestion: '' })
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Hello! This is your collaborative editor.<br/>Select some text and try "Edit with AI".</p>',
    editorProps: {
      attributes: {
        class: 'prose min-h-[300px] max-w-full outline-none p-4 bg-white rounded border',
      }
    }
  })

  useImperativeHandle(ref, () => ({
    insertText: (text: string) => {
      editor?.commands.insertContent(text)
    }
  }), [editor])

  // Replace selected text with AI suggestion
  const handlePreviewConfirm = () => {
    if (!editor) return
    const { from, to } = editor.state.selection
    editor.commands.insertContentAt({ from, to }, preview.suggestion)
    setPreview({ ...preview, open: false })
  }

  return (
    <div className="relative flex flex-col flex-1 w-full">
      {editor && (
        <FloatingToolbar
          editor={editor}
          onAIPreview={({ original, suggestion }) =>
            setPreview({ open: true, original, suggestion })
          }
        />
      )}
      <EditorContent editor={editor} />
      <PreviewModal
        open={preview.open}
        original={preview.original}
        suggestion={preview.suggestion}
        onConfirm={handlePreviewConfirm}
        onCancel={() => setPreview({ ...preview, open: false })}
      />
    </div>
  )
})

export default Editor
