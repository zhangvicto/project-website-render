'use client'
import { useState } from 'react'
import useSWR from 'swr'
import { useParams } from 'next/navigation'
import GanttChart from '@/components/GanttChart'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function ProjectDetailPage() {
  const { projectId } = useParams()
  const { data: project, mutate: mProj } = useSWR<Project>(`/api/projects/${projectId}`, fetcher)
  const { data: tasks, mutate: mTasks } = useSWR<Task[]>(`/api/tasks?projectId=${projectId}`, fetcher)
  const { data: milestones, mutate: mMs } = useSWR<Ms[]>(`/api/milestones?projectId=${projectId}`, fetcher)

  // form state...
  const [title, setTitle] = useState(''); const [start, setStart] = useState(''); const [end, setEnd] = useState('')
  const [msName, setMsName] = useState(''); const [msDate, setMsDate] = useState('')

  async function addTask(e: React.FormEvent) {
    e.preventDefault()
    await fetch('/api/tasks', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ title, startDate: start, endDate: end, projectId }),
    })
    setTitle(''); setStart(''); setEnd('')
    mTasks()
  }

  async function delTask(id: number) {
    await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
    mTasks()
  }

  async function addMs(e: React.FormEvent) {
    e.preventDefault()
    await fetch('/api/milestones', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ name: msName, date: msDate, projectId }),
    })
    setMsName(''); setMsDate('')
    mMs()
  }

  async function delMs(id: number) {
    await fetch(`/api/milestones/${id}`, { method: 'DELETE' })
    mMs()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{project?.name}</h1>
        <button onClick={() => {
          /* open file picker and POST to uploadImage */
        }} className="px-2 py-1 border rounded text-sm">
          Upload Image
        </button>
      </div>
      {project?.imageData && <img src={project.imageData} className="w-full h-48 object-cover rounded" />}

      <GanttChart tasks={tasks || []} milestones={milestones || []} />

      {/* Tasks */}
      <section>
        <h2 className="font-semibold">Tasks</h2>
        <form onSubmit={addTask} className="flex gap-2 my-2">
          <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} className="border px-2" required/>
          <input type="date" value={start} onChange={e=>setStart(e.target.value)} className="border px-2" required/>
          <input type="date" value={end} onChange={e=>setEnd(e.target.value)} className="border px-2" required/>
          <button type="submit" className="px-2 border">Add</button>
        </form>
        <ul className="space-y-1">
          {tasks?.map(t=>(
            <li key={t.id} className="flex justify-between">
              <span>{t.title} ({t.startDate.split('T')[0]}→{t.endDate.split('T')[0]})</span>
              <button onClick={()=>delTask(t.id)} className="text-red-600">Delete</button>
            </li>
          ))}
        </ul>
      </section>

      {/* Milestones */}
      <section>
        <h2 className="font-semibold">Milestones</h2>
        <form onSubmit={addMs} className="flex gap-2 my-2">
          <input placeholder="Name" value={msName} onChange={e=>setMsName(e.target.value)} className="border px-2" required/>
          <input type="date" value={msDate} onChange={e=>setMsDate(e.target.value)} className="border px-2" required/>
          <button type="submit" className="px-2 border">Add</button>
        </form>
        <ul className="space-y-1">
          {milestones?.map(m=>(
            <li key={m.id} className="flex justify-between">
              <span>{m.name} ({m.date.split('T')[0]})</span>
              <button onClick={()=>delMs(m.id)} className="text-red-600">Delete</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

type Project   = { id:number; name:string; imageData?:string }
type Task      = { id:number; title:string; startDate:string; endDate:string }
type Ms        = { id:number; name:string; date:string }
