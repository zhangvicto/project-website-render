'use client'
import { useState, FormEvent } from 'react'
import useSWR from 'swr'

export default function NewProjectModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const { mutate } = useSWR('/api/projects', url => fetch(url).then(r => r.json()))

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const body = new FormData()
    body.append('name', name)
    body.append('description', description)
    if (image) body.append('image', image)

    await fetch('/api/projects', {
      method: 'POST',
      body,
    })
    setName(''); setDescription(''); setImage(null)
    mutate()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-md space-y-4"
      >
        <h2 className="text-xl font-semibold">New Project</h2>
        <input
          required
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="file"
          accept="image/*"
          onChange={e => setImage(e.target.files?.[0] || null)}
        />
        <div className="flex justify-end space-x-2">
          <button type="button" onClick={onClose} className="px-4 py-2">Cancel</button>
          <button type="submit" className="px-4 py-2 border">Create</button>
        </div>
      </form>
    </div>
  )
}
