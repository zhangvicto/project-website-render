// src/components/AddModal.tsx
'use client'

import { useState, useEffect, FormEvent } from 'react'
import { TaskData, MsData } from '@/components/ProjectGantt'

export type AddType = 'task' | 'milestone' | 'document'

export type EditItem =
  | { type: 'task'; data: TaskData }
  | { type: 'milestone'; data: MsData }

interface AddModalProps {
  projectId: number
  onClose: () => void
  onCreated: () => void
  editItem?: EditItem | null
}

// Define payload shapes for type safety
type TaskPayload = { title: string; projectId: number; startDate: string; endDate: string }
type MilestonePayload = { name: string; projectId: number; date: string }
type DocumentPayload = { title: string; projectId: number; content: string }

type Payload = TaskPayload | MilestonePayload | DocumentPayload

export default function AddModal({
  projectId,
  onClose,
  onCreated,
  editItem = null,
}: AddModalProps) {
  const isEdit = Boolean(editItem)
  const [type, setType] = useState<AddType>(editItem?.type ?? 'task')

  // Form state
  const [title, setTitle] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [milestoneName, setMilestoneName] = useState('')
  const [milestoneDate, setMilestoneDate] = useState('')
  const [docTitle, setDocTitle] = useState('')

  // Prefill when editing
  useEffect(() => {
    if (isEdit && editItem) {
      if (editItem.type === 'task') {
        const t = editItem.data
        setType('task')
        setTitle(t.title)
        setStartDate(t.startDate.slice(0, 10))
        setEndDate(t.endDate.slice(0, 10))
      } else {
        const m = editItem.data
        setType('milestone')
        setMilestoneName(m.name)
        setMilestoneDate(m.date.slice(0, 10))
      }
    }
  }, [editItem, isEdit])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    let url: string
    let method: 'POST' | 'PATCH' = 'POST'
    let payload: Payload

    if (type === 'task') {
      const taskPayload: TaskPayload = {
        title,
        projectId,
        startDate,
        endDate,
      }
      if (isEdit && editItem?.type === 'task') {
        url = `/api/tasks/${editItem.data.id}`
        method = 'PATCH'
      } else {
        url = '/api/tasks'
      }
      payload = taskPayload

    } else if (type === 'milestone') {
      const milePayload: MilestonePayload = {
        name: milestoneName,
        projectId,
        date: milestoneDate,
      }
      if (isEdit && editItem?.type === 'milestone') {
        url = `/api/milestones/${editItem.data.id}`
        method = 'PATCH'
      } else {
        url = '/api/milestones'
      }
      payload = milePayload

    } else {
      const docPayload: DocumentPayload = {
        title: docTitle,
        projectId,
        content: '',
      }
      url = '/api/documents'
      payload = docPayload
      // NOTE: editing documents not supported here
    }

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      console.error('Error:', await res.text())
      return
    }

    onCreated()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-6 rounded shadow w-80 space-y-4"
      >
        <h2 className="text-xl font-semibold">
          {isEdit
            ? `Edit ${type === 'task' ? 'Task' : 'Milestone'}`
            : 'Add New'}
        </h2>

        {!isEdit && (
          <select
            value={type}
            onChange={e => setType(e.target.value as AddType)}
            className="w-full p-2 border rounded"
          >
            <option value="task">Task</option>
            <option value="milestone">Milestone</option>
            <option value="document">Document</option>
          </select>
        )}

        {type === 'task' && (
          <>
            <input
              required
              placeholder="Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <div className="flex gap-2">
              <input
                required
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="flex-1 p-2 border rounded"
              />
              <input
                required
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="flex-1 p-2 border rounded"
              />
            </div>
          </>
        )}

        {type === 'milestone' && (
          <>
            <input
              required
              placeholder="Name"
              value={milestoneName}
              onChange={e => setMilestoneName(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              required
              type="date"
              value={milestoneDate}
              onChange={e => setMilestoneDate(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </>
        )}

        {type === 'document' && (
          <input
            required
            placeholder="Document Title"
            value={docTitle}
            onChange={e => setDocTitle(e.target.value)}
            className="w-full p-2 border rounded"
          />
        )}

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
            {isEdit ? 'Save' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  )
}
