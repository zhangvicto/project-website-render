// src/components/NewProjectModal.tsx
'use client'

import { useState, FormEvent } from 'react'

interface NewProjectModalProps {
  onClose: () => void
  onCreated: () => void
}

export default function NewProjectModal({ onClose, onCreated }: NewProjectModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const formData = new FormData()
    formData.append('name', name)
    formData.append('description', description)
    if (imageFile) formData.append('image', imageFile)

    const res = await fetch('/api/projects', {
      method: 'POST',
      body: formData,
    })
    if (res.ok) {
      onCreated()
      onClose()
    } else {
      console.error('Error creating project:', await res.text())
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-6 rounded shadow w-96 space-y-4"
      >
        <h2 className="text-xl font-semibold">New Project</h2>
        <input
          required
          placeholder="Project Name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full p-2 border rounded h-24"
        />
        <input
          type="file"
          accept="image/*"
          onChange={e => setImageFile(e.target.files?.[0] ?? null)}
          className="w-full"
        />
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 border rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-3 py-1 border rounded bg-gray-100"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  )
}
