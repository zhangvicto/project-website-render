'use client'
import { useState } from 'react'
import useSWR from 'swr'
import Link from 'next/link'
import NewProjectModal from '@/components/NewProjectModal'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function ProjectsPage() {
  const { data: projects, mutate } = useSWR<Project[]>('/api/projects', fetcher)
  const [show, setShow] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Projects</h1>
        <button
          onClick={() => setShow(true)}
          className="px-3 py-1 border rounded"
        >
          + New
        </button>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {projects?.map(p => (
          <li key={p.id} className="border rounded p-4 space-y-2">
            {p.imageData && (
              <img
                src={p.imageData}
                alt=""
                className="h-32 w-full object-cover rounded"
              />
            )}
            <Link href={`/projects/${p.id}`}>
              <h2 className="text-lg font-semibold hover:underline">{p.name}</h2>
            </Link>
          </li>
        ))}
      </ul>

      {show && <NewProjectModal onClose={() => setShow(false)} />}
    </div>
  )
}

type Project = { id: number; name: string; imageData?: string }
