// src/app/projects/page.tsx
'use client'

import { useState } from 'react'
import useSWR, { mutate } from 'swr'
import Link from 'next/link'
import NewProjectModal from '@/components/NewProjectModal'
import Image from 'next/image'

const fetcher = (url: string) => fetch(url).then(r => r.json())

type Project = { id: number; name: string; imageData?: string }

type Task = {
  id: number
  projectId: number
  completed: boolean
  startDate: string
  endDate: string
}

type Milestone = {
  id: number
  projectId: number
  date: string
}

export default function ProjectsPage() {
  const { data: projects }   = useSWR<Project[]>   ('/api/projects', fetcher)
  const { data: tasks }      = useSWR<Task[]>      ('/api/tasks', fetcher)
  const { data: milestones } = useSWR<Milestone[]> ('/api/milestones', fetcher)
  const [showNew, setShowNew] = useState(false)

  if (!projects || !tasks || !milestones) {
    return <div className="p-8 text-center">Loading projects…</div>
  }

  const now = Date.now()

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Projects</h1>
        <button
          onClick={() => setShowNew(true)}
          className="px-3 py-1 border rounded"
        >
          + New
        </button>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(proj => {
          const projTasks = tasks.filter(t => t.projectId === proj.id)
          const projMile = milestones
            .filter(m => m.projectId === proj.id)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

          const totalTasks = projTasks.length
          const doneTasks  = projTasks.filter(t => t.completed).length
          const pct        = totalTasks ? Math.round((doneTasks/totalTasks)*100) : 0

          const starts = projTasks.map(t=>new Date(t.startDate).getTime()).filter(x=>!isNaN(x))
          const startDate = starts.length
            ? new Date(Math.min(...starts))
            : projMile.length
            ? new Date(projMile[0].date)
            : null

          const endDate = projMile.length
            ? new Date(projMile[projMile.length-1].date)
            : projTasks.length
            ? new Date(Math.max(...projTasks.map(t=>new Date(t.endDate).getTime())))
            : null

          const duration = startDate && endDate
            ? Math.ceil((endDate.getTime()-startDate.getTime())/(1000*60*60*24))
            : null

          const remaining = endDate
            ? Math.max(0, Math.ceil((endDate.getTime()-now)/(1000*60*60*24)))
            : null

          return (
            <li key={proj.id}>
              <Link
                href={`/projects/${proj.id}`}
                className="group block h-full rounded-lg bg-white dark:bg-gray-800 p-4 shadow transition-transform transition-shadow duration-200 hover:shadow-lg hover:-translate-y-1"
              >
                {proj.imageData && (
                  <Image
                    src={proj.imageData}
                    alt=""
                    className="h-32 w-full object-cover rounded mb-3"
                  />
                )}
                <h2 className="text-lg font-semibold group-hover:text-indigo-600">
                  {proj.name}
                </h2>
                <ul className="mt-2 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>🗂 {doneTasks}/{totalTasks} ({pct}%)</li>
                  <li>🎯 {projMile.length} milestones</li>
                  {startDate && <li>📅 {startDate.toISOString().split('T')[0]} – {endDate?.toISOString().split('T')[0]}</li>}
                  {duration !== null && <li>⏳ {duration}d</li>}
                  {remaining !== null && <li>🚧 {remaining}d left</li>}
                </ul>
              </Link>
            </li>
          )
        })}
      </ul>

      {showNew && (
        <NewProjectModal
          onClose={() => setShowNew(false)}
          onCreated={() => {
            mutate('/api/projects')
          }}
        />
      )}
    </div>
  )
}
