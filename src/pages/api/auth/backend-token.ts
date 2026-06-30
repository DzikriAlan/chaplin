import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/shared/lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end()

  try {
    const session = await getServerSession(req, res, authOptions)
    if (!session?.user?.id) return res.status(401).json({ message: 'Unauthorized' })

    const secret = process.env.NEXTAUTH_SECRET
    if (!secret) return res.status(500).json({ message: 'Server misconfiguration: NEXTAUTH_SECRET not set' })

    const { SignJWT } = await import('jose')
    const encodedSecret = new TextEncoder().encode(secret)

    const token = await new SignJWT({ sub: session.user.id, email: session.user.email ?? '' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(encodedSecret)

    return res.status(200).json({ token })
  } catch (error) {
    console.error('[backend-token]', error)
    return res.status(500).json({ message: 'Failed to generate token' })
  }
}
