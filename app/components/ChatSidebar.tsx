// use client
import { useRef, useState } from 'react'

interface ChatSidebarProps {
  onInsertToEditor: (text: string) => void
}

type Message = {
  role: 'user' | 'agent'
  text: string
}

export default function ChatSidebar({ onInsertToEditor }: ChatSidebarProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Handles chat and search
  const handleSend = async () => {
    const text = input.trim()
    if (!text) return
    setMessages((ms) => [...ms, { role: 'user', text }])
    setInput('')
    setLoading(true)

    // If the prompt looks like a search, do search
    const isSearch = text.toLowerCase().startsWith('search ') || text.toLowerCase().startsWith('news ')
    if (isSearch) {
      try {
        const q = text.replace(/^search\s+/i, '').replace(/^news\s+/i, '')
        const res = await fetch('/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: q }),
        })
        const data = await res.json()
        const top = data.results?.[0]
        if (top) {
          setMessages((ms) => [...ms, {
            role: 'agent',
            text: `**${top.title}**\n${top.snippet}\n[Read more](${top.link})`
          }])
        } else {
          setMessages((ms) => [...ms, { role: 'agent', text: 'No results found.' }])
        }
      } catch (err) {
        setMessages((ms) => [...ms, { role: 'agent', text: 'Error fetching search.' }])
      } finally {
        setLoading(false)
      }
      return
    }

    // Otherwise, use AI
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text }),
      })
      const data = await res.json()
      setMessages((ms) => [...ms, { role: 'agent', text: data.result || '...' }])
    } catch (err) {
      setMessages((ms) => [...ms, { role: 'agent', text: 'Error contacting AI.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-gray-400 text-sm pt-8">Ask me to summarize, explain, or type <span className="font-mono bg-gray-100 px-1 rounded">search react server components</span></div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? "text-right" : ""}>
            <div className={"inline-block px-3 py-2 rounded " + (m.role === 'user' ? 'bg-blue-100' : 'bg-green-50')}> 
              <span className={m.role === 'agent' ? "prose" : ""} dangerouslySetInnerHTML={{ __html: m.text.replace(/\n/g, '<br/>') }} />
            </div>
            {m.role === 'agent' && (
              <button
                className="ml-2 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => onInsertToEditor(m.text.replace(/<br\/>(g, '\n'))}
              >
                Insert
              </button>
            )}
          </div>
        ))}
        {loading && <div className="text-gray-400 text-xs">Thinking...</div>}
      </div>
      <form
        className="flex border-t p-2"
        onSubmit={e => {
          e.preventDefault()
          handleSend()
        }}
      >
        <input
          ref={inputRef}
          className="flex-1 px-3 py-2 text-sm border rounded"
          placeholder="Ask or search news..."
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={loading}
        />
        <button type="submit" className="ml-2 px-3 py-2 bg-blue-600 text-white rounded" disabled={loading}>
          Send
        </button>
      </form>
    </div>
  )
}