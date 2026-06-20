import { google } from 'googleapis'
import { prisma } from './prisma'
import { getEmbedding, chunkText } from './ai'

const SUPPORTED_MIME_TYPES: Record<string, string> = {
  'application/vnd.google-apps.document': 'text/plain',
  'application/vnd.google-apps.presentation': 'text/plain',
  'application/vnd.google-apps.spreadsheet': 'text/csv',
  'application/pdf': 'text/plain',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'text/plain',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'text/plain',
  'text/plain': 'text/plain',
}

export function buildOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI,
  )
}

export async function processDocument(
  auth: ReturnType<typeof buildOAuth2Client>,
  doc: { id: string; driveId: string; mimeType: string; title: string },
) {
  await prisma.document.updateMany({ where: { id: doc.id }, data: { status: 'PROCESSING' } })
  try {
    const drive = google.drive({ version: 'v3', auth })
    const exportMime = SUPPORTED_MIME_TYPES[doc.mimeType] ?? 'text/plain'
    const isNativeDoc = doc.mimeType.startsWith('application/vnd.google-apps.')

    let text = ''
    if (isNativeDoc) {
      const exported = await drive.files.export(
        { fileId: doc.driveId, mimeType: exportMime },
        { responseType: 'text' },
      )
      text = typeof exported.data === 'string' ? exported.data : JSON.stringify(exported.data)
    } else {
      const downloaded = await drive.files.get(
        { fileId: doc.driveId, alt: 'media' },
        { responseType: 'text' },
      )
      text = typeof downloaded.data === 'string' ? downloaded.data : JSON.stringify(downloaded.data)
    }

    text = text.trim()
    if (!text) {
      await prisma.document.update({ where: { id: doc.id }, data: { status: 'ERROR' } })
      return
    }

    const chunks = chunkText(text)
    await prisma.documentChunk.deleteMany({ where: { documentId: doc.id } })

    for (let i = 0; i < chunks.length; i++) {
      const embedding = await getEmbedding(chunks[i])
const chunk = await prisma.documentChunk.create({
        data: { documentId: doc.id, content: chunks[i], chunkIndex: i, metadata: { title: doc.title } },
      })
      const vectorStr = `[${embedding.join(',')}]`
      await prisma.$executeRaw`UPDATE "document_chunks" SET embedding = ${vectorStr}::vector(1024) WHERE id = ${chunk.id}`
    }

    await prisma.document.updateMany({ where: { id: doc.id }, data: { status: 'READY' } })
  } catch {
    await prisma.document.updateMany({ where: { id: doc.id }, data: { status: 'ERROR' } })
  }
}

let cronRunning = false
let cronPaused = false

export function pauseCron() { cronPaused = true }
export function resumeCron() { cronPaused = false }
export function isCronPaused() { return cronPaused }

export async function runCronTick() {
  if (cronRunning || cronPaused) return
  cronRunning = true
  try {
    const config = await prisma.driveConfig.findFirst()
    if (!config?.refreshToken) return

    const pending = await prisma.document.findFirst({ where: { status: 'PENDING' } })
    if (!pending) return

    const auth = buildOAuth2Client()
    auth.setCredentials({ refresh_token: config.refreshToken })
    await processDocument(auth, pending)
  } finally {
    cronRunning = false
  }
}
