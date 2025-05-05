// src/components/ProjectGantt.tsx
'use client'

import React, { useState, useRef, useEffect, useMemo } from 'react'
import { Gantt, Task as GanttTask, ViewMode } from '@rsagiev/gantt-task-react-19'
import '@rsagiev/gantt-task-react-19/dist/index.css'

// Export types for external use
export type TaskData = { id: number; title: string; startDate: string; endDate: string; completed: boolean }
export type MsData   = { id: number; name: string; date: string }

type Task = GanttTask & { id: string; name: string }

// Props for custom header component
interface TaskListHeaderProps {
  rowWidth: string
  headerHeight: number
  fontFamily: string
  fontSize: string
}

// Props for custom table component
interface TaskListTableProps {
  tasks: Task[]
  rowHeight: number
  rowWidth: string
  fontFamily: string
  fontSize: string
  selectedTaskId?: string
  setSelectedTask: (id: string) => void
}

type SaveChangePayload = Array<{ id: string; start: Date; end: Date }>

interface ProjectGanttProps {
  tasks?: TaskData[]
  milestones?: MsData[]
  onSaveChanges?: (changes: SaveChangePayload) => Promise<void>
}

export default function ProjectGantt({
  tasks = [],
  milestones = [],
  onSaveChanges,
}: ProjectGanttProps) {
  // Build Task[] for Gantt
  const initialTasks = useMemo<Task[]>(() => {
    const taskItems: Task[] = tasks.map(t => ({
      id: `t${t.id}`,
      name: t.title,
      start: new Date(t.startDate),
      end: new Date(t.endDate),
      progress: t.completed ? 100 : 0,
      type: 'task',
    }))
    const milestoneItems: Task[] = milestones.map(m => ({
      id: `m${m.id}`,
      name: m.name,
      start: new Date(m.date),
      end: new Date(m.date),
      progress: 100,
      type: 'milestone',
    }))
    return [...taskItems, ...milestoneItems].filter(
      x => !isNaN(x.start.getTime()) && !isNaN(x.end.getTime())
    )
  }, [tasks, milestones])

  const [localTasks, setLocalTasks] = useState<Task[]>(initialTasks)
  const initialRef = useRef<Task[]>(initialTasks)
  const [isDirty, setDirty] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Week)

  useEffect(() => {
    setLocalTasks(initialTasks)
    initialRef.current = initialTasks
    setDirty(false)
  }, [initialTasks])

  const handleDateChange = (moved: Task) => {
    setLocalTasks(prev => prev.map(t => (t.id === moved.id ? moved : t)))
    setDirty(true)
  }

  const handleRevert = () => {
    setLocalTasks(initialRef.current)
    setDirty(false)
  }

  const handleSave = async () => {
    const changes = localTasks
      .filter(t => {
        const orig = initialRef.current.find(o => o.id === t.id)
        return (
          orig &&
          (orig.start.getTime() !== t.start.getTime() || orig.end.getTime() !== t.end.getTime())
        )
      })
      .map(t => ({ id: t.id, start: t.start, end: t.end }))

    if (!changes.length) {
      setDirty(false)
      return
    }
    if (onSaveChanges) {
      await onSaveChanges(changes)
    } else {
      await Promise.all(
        changes.map(c => {
          const isMs = c.id.startsWith('m')
          const raw  = isMs ? c.id.slice(1) : c.id.slice(1)
          const url  = isMs ? `/api/milestones/${raw}` : `/api/tasks/${raw}`
          const body = isMs
            ? { date: c.start.toISOString().split('T')[0] }
            : { startDate: c.start.toISOString(), endDate: c.end.toISOString() }
          return fetch(url, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          })
        })
      )
    }
    initialRef.current = localTasks
    setDirty(false)
  }

  if (localTasks.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        No tasks or milestones to display.
      </div>
    )
  }

  const TaskListHeader: React.FC<TaskListHeaderProps> = ({ rowWidth, headerHeight, fontFamily, fontSize }) => (
    <div
      style={{ display: 'flex', width: rowWidth, height: headerHeight, alignItems: 'center', paddingLeft: 12, fontFamily, fontSize, fontWeight: 600 }}
    >
      Task
    </div>
  )

  const TaskListTable: React.FC<TaskListTableProps> = ({ tasks, rowHeight, rowWidth, fontFamily, fontSize, selectedTaskId, setSelectedTask }) => (
    <div>
      {tasks.map((t: Task) => (
        <div
          key={t.id}
          onClick={() => setSelectedTask(t.id)}
          style={{
            display: 'flex',
            width: rowWidth,
            height: rowHeight,
            alignItems: 'center',
            paddingLeft: 12,
            cursor: 'pointer',
            background: t.id === selectedTaskId ? 'rgba(243, 244, 246, 0.5)' : 'transparent',
            fontFamily,
            fontSize,
          }}
        >
          {t.name}
        </div>
      ))}
    </div>
  )

  return (
    <div className="seamless-gantt bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
      <div className="flex justify-end mb-4">
        <select
          id="viewMode"
          value={viewMode}
          onChange={e => setViewMode(e.target.value as ViewMode)}
          className="px-3 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm"
        >
          <option value={ViewMode.Week}>Week</option>
          <option value={ViewMode.Month}>Month</option>
          <option value={ViewMode.Year}>Year</option>
        </select>
      </div>

      <Gantt
        tasks={localTasks}
        viewMode={viewMode}
        onDateChange={handleDateChange}
        TaskListHeader={TaskListHeader}
        TaskListTable={TaskListTable}
        headerHeight={60}
        columnWidth={50}
      />

      {isDirty && (
        <div className="flex justify-end mt-4 space-x-2">
          <button onClick={handleRevert} className="px-3 py-1 border rounded text-gray-700 hover:bg-gray-50">Revert</button>
          <button onClick={handleSave} className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
        </div>
      )}

      <style jsx global>{`
        .seamless-gantt .gantt, .seamless-gantt .gantt * { border: none !important; box-shadow: none !important; }
        .seamless-gantt .gantt__grid, .seamless-gantt svg line { display: none !important; }
        .seamless-gantt .gantt__header, .seamless-gantt .gantt__date { overflow: visible !important; white-space: nowrap; }
        .seamless-gantt .gantt__bar--task rect { fill: #3b82f6 !important; }
        .seamless-gantt .gantt__bar--milestone rect { fill: #f59e0b !important; }
        .seamless-gantt .gantt__date { color: #4b5563; font-size: 0.875rem; }
      `}</style>
    </div>
  )
}
