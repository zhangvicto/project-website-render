'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownEditorProps {
  initialContent: string
  onSave: (content: string) => void
}

export default function MarkdownEditor({
  initialContent,
  onSave,
}: MarkdownEditorProps) {
  const [content, setContent] = useState(initialContent)
  const [editing, setEditing] = useState(false)

  return editing ? (
    <div className="space-y-2">
      <textarea
        className="w-full h-48 p-2 border rounded font-mono"
        value={content}
        onChange={e => setContent(e.target.value)}
      />
      <div className="flex justify-end space-x-2">
        <button
          onClick={() => {
            setContent(initialContent)
            setEditing(false)
          }}
          className="px-3 py-1 border rounded"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            onSave(content)
            setEditing(false)
          }}
          className="px-3 py-1 border rounded bg-gray-100"
        >
          Save
        </button>
      </div>
    </div>
  ) : (
    <div className="space-y-2">
      <div className="prose dark:prose-dark">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content}
        </ReactMarkdown>
      </div>
      <button
        onClick={() => setEditing(true)}
        className="px-2 py-1 border rounded text-sm"
      >
        Edit
      </button>
    </div>
  )
}
