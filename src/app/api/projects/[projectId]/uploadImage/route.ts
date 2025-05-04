import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await context.params
  const id = Number(projectId)
  const form = await req.formData()
  const file = form.get('image') as Blob | null

  if (!file || file.size > 500_000) {
    return NextResponse.json({ error: 'No file or exceeds 500KB' }, { status: 400 })
  }

  const buffer = await file.arrayBuffer()
  const base64 = Buffer.from(buffer).toString('base64')
  const mime = file.type
  const dataUrl = `data:${mime};base64,${base64}`

  const project = await prisma.project.update({
    where: { id },
    data: { imageData: dataUrl },
  })
  return NextResponse.json(project)
}
