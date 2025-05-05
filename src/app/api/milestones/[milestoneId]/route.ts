import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/** Update an existing milestone */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ milestoneId: string }> }
) {
  const { milestoneId } = await params
  const { name, date } = await request.json()

  if (!date) {
    return NextResponse.json({ error: 'Missing date' }, { status: 400 })
  }

  const updated = await prisma.milestone.update({
    where: { id: Number(milestoneId) },
    data: {
      name: name ?? undefined,
      date: new Date(date),
    },
  })
  return NextResponse.json(updated)
}

/** Delete a milestone */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ milestoneId: string }> }
) {
  const { milestoneId } = await params
  await prisma.milestone.delete({ where: { id: Number(milestoneId) } })

  // 204 No Content must not include a JSON body
  return new NextResponse(null, { status: 204 })
}
