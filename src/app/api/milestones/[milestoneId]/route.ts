// src/app/api/milestones/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET  /api/milestones?projectId=1
export async function GET(request: NextRequest) {
  const projectId = request.nextUrl.searchParams.get('projectId')
  const where = projectId ? { projectId: Number(projectId) } : {}
  const milestones = await prisma.milestone.findMany({
    where,
    orderBy: { id: 'asc' },
  })
  return NextResponse.json(milestones)
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
      projectId: Number(projectId),       // ← convert to Int here
    },
  })
  return NextResponse.json(m, { status: 201 })
}
