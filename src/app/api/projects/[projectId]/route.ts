// before, you had:
// export async function GET(request: NextRequest, { params }: { params: { projectId: string } }) {
//   const id = Number(params.projectId)
//   …

// after:
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ projectId: string }> }
) {
  // await the params object
  const { projectId } = await context.params  
  const id = Number(projectId)

  const project = await prisma.project.findUnique({
    where: { id },
    include: { tasks: true },
  })
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(project)
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await context.params
  const id = Number(projectId)
  const { name, description } = await request.json()
  const project = await prisma.project.update({
    where: { id },
    data: { name, description },
  })
  return NextResponse.json(project)
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await context.params
  const id = Number(projectId)
  await prisma.project.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
