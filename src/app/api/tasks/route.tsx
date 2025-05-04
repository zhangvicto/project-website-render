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
  const { title, projectId, description, dueDate } = await request.json()
  if (!title || !projectId) {
    return NextResponse.json({ error: 'Missing title or projectId' }, { status: 400 })
  }
  const task = await prisma.task.create({
    data: {
      title,
      projectId: Number(projectId),
      description,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    },
  })
  return NextResponse.json(task, { status: 201 })
}
