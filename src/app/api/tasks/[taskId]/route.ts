import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/tasks/:taskId
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await context.params
  const id = Number(taskId)
  const task = await prisma.task.findUnique({ where: { id } })
  if (!task) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(task)
}

// PUT /api/tasks/:taskId
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await context.params
  const id = Number(taskId)
  const { title, description, dueDate, completed } = await request.json()
  const task = await prisma.task.update({
    where: { id },
    data: { title, description, dueDate: dueDate ? new Date(dueDate) : null, completed },
  })
  return NextResponse.json(task)
}

// DELETE /api/tasks/:taskId
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await context.params
  const id = Number(taskId)
  await prisma.task.delete({ where: { id }})
  return NextResponse.json({ success: true })
}
