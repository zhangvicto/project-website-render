// src/app/api/tables/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/tables?projectId=1
export async function GET(request: NextRequest) {
  const projectId = request.nextUrl.searchParams.get('projectId')
  const where = projectId ? { projectId: Number(projectId) } : {}
  const tables = await prisma.customTable.findMany({
    where,
    orderBy: { id: 'asc' },
  })
  return NextResponse.json(tables)
}

// POST /api/tables
export async function POST(request: NextRequest) {
  const { name, projectId } = await request.json()

  if (!name || projectId === undefined) {
    return NextResponse.json(
      { error: 'Missing name or projectId' },
      { status: 400 }
    )
  }

  const table = await prisma.customTable.create({
    data: {
      name,
      projectId: Number(projectId),    // ← convert here
    },
  })
  return NextResponse.json(table, { status: 201 })
}
