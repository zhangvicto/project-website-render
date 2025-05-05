import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/documents?projectId=…
export async function GET(req: NextRequest) {
  const pid = req.nextUrl.searchParams.get('projectId')
  const docs = await prisma.document.findMany({
    where: { projectId: Number(pid) },
    orderBy: { createdAt: 'asc' },
  })
  return NextResponse.json(docs)
}

// POST /api/documents
export async function POST(req: NextRequest) {
  const { title, content, projectId } = await req.json()
  if (!title || projectId == null) {
    return NextResponse.json({ error: 'Missing title or projectId' }, { status: 400 })
  }
  const doc = await prisma.document.create({
    data: { title, content: content || "", projectId: Number(projectId) },
  })
  return NextResponse.json(doc, { status: 201 })
}
