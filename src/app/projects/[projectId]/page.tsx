// src/app/projects/[projectId]/page.tsx (ProjectDetailPage)
'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import useSWR from 'swr'
import ProjectGantt, { TaskData, MsData } from '@/components/ProjectGantt'
import AddModal, { EditItem } from '@/components/AddModal'
import MarkdownEditor from '@/components/MarkdownEditor'
import Image from 'next/image'

const fetcher = (url: string) => fetch(url).then(r => r.json())

type Project = { id: number; name: string; description?: string; imageData?: string }
type DocumentItem = { id: number; title: string; content: string }

export default function ProjectDetailPage() {
  const { projectId } = useParams() || {}
  const id = Number(projectId)

  const { data: project } = useSWR<Project>(
    () => (id ? `/api/projects/${id}` : null),
    fetcher
  )
  const { data: tasks, mutate: reloadTasks } = useSWR<TaskData[]>(
    () => (id ? `/api/tasks?projectId=${id}` : null),
    fetcher
  )
  const { data: milestones, mutate: reloadMilestones } = useSWR<MsData[]>(
    () => (id ? `/api/milestones?projectId=${id}` : null),
    fetcher
  )
  const { data: documents, mutate: reloadDocuments } = useSWR<DocumentItem[]>(
    () => (id ? `/api/documents?projectId=${id}` : null),
    fetcher
  )

  const [tab, setTab] = useState<'timeline' | 'items' | 'docs'>('timeline')
  const [showAdd, setShowAdd] = useState(false)
  const [editItem, setEditItem] = useState<EditItem | null>(null)

  if (!project) return <p>Loading project…</p>

  async function handleDelete(type: 'task' | 'milestone', itemId: number) {
    await fetch(`/api/${type}s/${itemId}`, { method: 'DELETE' })
    if (type === 'task') reloadTasks()
    else reloadMilestones()
  }

  function openModal(type: 'task' | 'milestone', data?: TaskData | MsData) {
    if (data) {
      setEditItem({ type, data } as EditItem)
    } else {
      setEditItem(null)
    }
    setShowAdd(true)
  }

  return (
    <div className="space-y-6 p-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-6">
        {project.imageData && (
          <Image
            src={project.imageData}
            alt=""
            className="w-32 h-32 object-cover rounded-lg border"
          />
        )}
        <div>
          <h1 className="text-3xl font-bold">{project.name}</h1>
          {project.description && (
            <p className="text-gray-600 dark:text-gray-400">
              {project.description}
            </p>
          )}
        </div>
      </div>

      {/* Tabs & Add button */}
      <div className="flex items-center justify-between border-b pb-2">
        <div className="space-x-4">
          <button
            onClick={() => setTab('timeline')}
            className={`pb-1 ${tab === 'timeline' ? 'border-b-2' : 'opacity-60'}`}
          >
            Timeline
          </button>
          <button
            onClick={() => setTab('items')}
            className={`pb-1 ${tab === 'items' ? 'border-b-2' : 'opacity-60'}`}
          >
            Items
          </button>
          <button
            onClick={() => setTab('docs')}
            className={`pb-1 ${tab === 'docs' ? 'border-b-2' : 'opacity-60'}`}
          >
            Documents
          </button>
        </div>
        <button
          onClick={() => openModal('task')}
          className="px-3 py-1 border rounded text-sm"
        >
          + Add
        </button>
      </div>

      {tab === 'timeline' && (
        <div className="overflow-hidden">
          <ProjectGantt tasks={tasks || []} milestones={milestones || []} />
        </div>
      )}

      {tab === 'items' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Tasks & Milestones</h2>
          <ul className="space-y-2">
            {(tasks || []).map((t: TaskData) => (
              <li
                key={t.id}
                className="flex justify-between px-3 py-2 border rounded"
              >
                <span>{t.title}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => openModal('task', t)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete('task', t.id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
            {(milestones || []).map((m: MsData) => (
              <li
                key={m.id}
                className="flex justify-between px-3 py-2 border rounded"
              >
                <span>♦ {m.name}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => openModal('milestone', m)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete('milestone', m.id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === 'docs' && (
        <div className="space-y-4">
          {(documents || []).map((doc: DocumentItem) => (
            <div key={doc.id} className="border rounded p-4">
              <h3 className="font-semibold flex justify-between">
                <span>{doc.title}</span>
                <button
                  onClick={async () => {
                    await fetch(`/api/documents/${doc.id}`, { method: 'DELETE' })
                    reloadDocuments()
                  }}
                  className="text-red-600 hover:underline text-sm"
                >
                  Delete
                </button>
              </h3>
              <MarkdownEditor
                initialContent={doc.content}
                onSave={async content => {
                  await fetch(`/api/documents/${doc.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title: doc.title, content }),
                  })
                  reloadDocuments()
                }}
              />
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <AddModal
          projectId={id}
          editItem={editItem}
          onClose={() => setShowAdd(false)}
          onCreated={() => {
            reloadTasks()
            reloadMilestones()
            reloadDocuments()
          }}
        />
      )}
    </div>
  )
}
