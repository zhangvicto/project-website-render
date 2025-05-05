import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }    // <-- params is now a Promise
) {
  // await before destructuring
  const { taskId } = await params

  const { title, description, startDate, endDate, completed } = await request.json()

  if (!startDate || !endDate) {
    return NextResponse.json(
      { error: 'Missing startDate or endDate' },
      { status: 400 }
    )
  }

  const data: {
    title?: string
    description?: string | null
    startDate: Date
    endDate: Date
    completed?: boolean
  } = {
    startDate: new Date(startDate),
    endDate: new Date(endDate),
  }
  if (title !== undefined) data.title = title
  if (description !== undefined) data.description = description
  if (completed !== undefined) data.completed = completed

  try {
    const updated = await prisma.task.update({
      where: { id: Number(taskId) },
      data,
    })
    return NextResponse.json(updated)
  } catch (e: unknown) {
    // Narrow to Error before using .message
    const message = e instanceof Error ? e.message : String(e)
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}

// add at bottom of file, alongside your PATCH export
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await params
  try {
    await prisma.task.delete({ where: { id: Number(taskId) } })
    return NextResponse.json({}, { status: 204 })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e)
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
