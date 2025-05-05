// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

// Extend the globalThis type so TS knows about `prisma`
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

export const prisma =
  global.prisma ??
  new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}
