'use client'
import { Chart } from 'react-google-charts'

type Row = (string | Date | number | null)[]
export default function GanttChart({
  tasks,
  milestones,
}: {
  tasks: { id: number; title: string; startDate: string; endDate: string; completed: boolean }[]
  milestones: { id: number; name: string; date: string }[]
}) {
  const header = [
    { type: 'string', label: 'Task ID' },
    { type: 'string', label: 'Task Name' },
    { type: 'string', label: 'Resource' },
    { type: 'date',   label: 'Start Date' },
    { type: 'date',   label: 'End Date' },
    { type: 'number', label: 'Duration' },
    { type: 'number', label: '% Complete' },
    { type: 'string', label: 'Dependencies' },
  ]
  const rows: Row[] = [
    ...tasks.map(t => [
      String(t.id),
      t.title,
      null,
      new Date(t.startDate),
      new Date(t.endDate),
      null,
      t.completed ? 100 : 0,
      null,
    ]),
    // milestones as zero‑length tasks
    ...milestones.map(m => [
      `m${m.id}`,
      m.name,
      null,
      new Date(m.date),
      new Date(m.date),
      null,
      100,
      null,
    ]),
  ]

  return (
    <Chart
      chartType="Gantt"
      width="100%"
      height="300px"
      data={[header, ...rows]}
      options={{ gantt: { criticalPathEnabled: false } }}
    />
  )
}
