// src/app/api/documents/[documentId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/documents/:documentId
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ documentId: string }> }
) {
  const { documentId } = await params
  const doc = await prisma.document.findUnique({
    where: { id: Number(documentId) },
  })
  if (!doc) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json(doc)
}

// PUT /api/documents/:documentId
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ documentId: string }> }
) {
  const { documentId } = await params
  const { title, content } = await request.json()
  if (!title || content === undefined) {
    return NextResponse.json(
      { error: 'Missing title or content' },
      { status: 400 }
    )
  }
  const updated = await prisma.document.update({
    where: { id: Number(documentId) },
    data: { title, content },
  })
  return NextResponse.json(updated)
}

// DELETE /api/documents/:documentId
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ documentId: string }> }
) {
  const { documentId } = await params
  await prisma.document.delete({
    where: { id: Number(documentId) },
  })
  // No body allowed for 204
  return new NextResponse(null, { status: 204 })
}
