import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/milestones?projectId=…
export async function GET(request: NextRequest) {
  const projectId = request.nextUrl.searchParams.get('projectId')
  const where = projectId ? { projectId: Number(projectId) } : {}
  const list = await prisma.milestone.findMany({ where, orderBy: { id: 'asc' } })
  return NextResponse.json(list)
}

// POST /api/milestones
export async function POST(request: NextRequest) {
  const { name, date, projectId } = await request.json()

  if (!name || !date || !projectId) {
    return NextResponse.json(
      { error: 'Missing name, date, or projectId' },
      { status: 400 }
    )
  }

  const created = await prisma.milestone.create({
    data: {
      name,
      date: new Date(date),              // always passing a Date, never undefined
      projectId: Number(projectId),      // ensure correct type
    },
  })

  return NextResponse.json(created, { status: 201 })
}
