// src/app/api/projects/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(projects)
}

export async function POST(request: NextRequest) {
  let name: string | undefined
  let description: string | undefined
  let imageData: string | undefined

  const contentType = request.headers.get('content-type') || ''

  if (contentType.includes('multipart/form-data')) {
    // parse form data
    const form = await request.formData()
    name = form.get('name')?.toString() ?? undefined
    description = form.get('description')?.toString() ?? undefined

    const file = form.get('image') as Blob | null
    if (file && file.size > 0) {
      if (file.size > 500_000) {
        return NextResponse.json({ error: 'Image exceeds 500 KB' }, { status: 400 })
      }
      const buffer = await file.arrayBuffer()
      const b64 = Buffer.from(buffer).toString('base64')
      imageData = `data:${file.type};base64,${b64}`
    }
  } else {
    // parse JSON
    const body = await request.json().catch(() => ({}))
    name = body.name
    description = body.description
  }

  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 })
  }

  const project = await prisma.project.create({
    data: {
      name,
      description,
      imageData,
    },
  })

  return NextResponse.json(project, { status: 201 })
}
