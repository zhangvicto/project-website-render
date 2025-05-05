// src/app/api/tasks/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/tasks?projectId=1
export async function GET(request: NextRequest) {
  const projectId = request.nextUrl.searchParams.get('projectId')
  const where = projectId ? { projectId: Number(projectId) } : {}
  const tasks = await prisma.task.findMany({
    where,
    orderBy: { id: 'asc' },
  })
  return NextResponse.json(tasks)
}

// POST /api/tasks
export async function POST(request: NextRequest) {
  // pull in endDate (not dueDate)
  const { title, projectId, description, startDate, endDate } = await request.json()

  // make sure required fields exist
  if (!title || !projectId || !startDate || !endDate) {
    return NextResponse.json(
      { error: 'Missing title, projectId, startDate or endDate' },
      { status: 400 }
    )
  }

  // build the data payload
  const data: {
    title: string
    projectId: number
    startDate: Date
    endDate: Date
    description?: string | null
  } = {
    title,
    projectId: Number(projectId),
    startDate: new Date(startDate),
    endDate:   new Date(endDate),
  }

  // only include description if provided
  if (description !== undefined) {
    data.description = description
  }

  const task = await prisma.task.create({ data })
  return NextResponse.json(task, { status: 201 })
}
