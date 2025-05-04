// src/app/api/milestones/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/milestones?projectId=…
export async function GET(request: NextRequest) {
  const pid = request.nextUrl.searchParams.get('projectId')
  const where = pid ? { projectId: Number(pid) } : {}
  const list = await prisma.milestone.findMany({
    where,
    orderBy: { id: 'asc' },
  })
  return NextResponse.json(list)
}

// POST /api/milestones
export async function POST(request: NextRequest) {
  const { name, dueDate, projectId } = await request.json()

  if (!name || projectId === undefined) {
    return NextResponse.json(
      { error: 'Missing name or projectId' },
      { status: 400 }
    )
  }

  const m = await prisma.milestone.create({
    data: {
      name,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      projectId: Number(projectId),    // ← convert here
    },
  })

  return NextResponse.json(m, { status: 201 })
}
