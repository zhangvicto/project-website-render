// src/app/api/tables/[tableId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ tableId: string }> }
) {
  const { tableId } = await context.params
  const id = Number(tableId)
  const table = await prisma.customTable.findUnique({
    where: { id },
    include: { rows: true },
  })
  if (!table) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json(table)
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ tableId: string }> }
) {
  const { tableId } = await context.params
  const id = Number(tableId)
  const { name } = await request.json()
  const table = await prisma.customTable.update({
    where: { id },
    data: { name },
  })
  return NextResponse.json(table)
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ tableId: string }> }
) {
  const { tableId } = await context.params
  const id = Number(tableId)
  await prisma.customTable.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
