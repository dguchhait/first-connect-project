'use client'
import { useRef } from 'react'
import Editor, { EditorHandle } from './components/Editor'
import ChatSidebar from './components/ChatSidebar'

export default function HomePage() {
  const editorRef = useRef<EditorHandle>(null)
  return (
    <main className="flex min-h-screen bg-gray-50">
      <section className="flex-1 flex flex-col">
        <Editor ref={editorRef} />
      </section>
      <aside className="w-[380px] border-l bg-white flex flex-col">
        <ChatSidebar
          onInsertToEditor={(text) => {
            editorRef.current?.insertText(text)
          }}
        />
      </aside>
    </main>
  )
}