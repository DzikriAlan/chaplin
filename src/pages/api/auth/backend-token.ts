import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/shared/lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end()

  try {
    const session = await getServerSession(req, res, authOptions)
    if (!session?.user?.email) return res.status(401).json({ message: 'Unauthorized' })

    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL
    if (!backendUrl) return res.status(500).json({ message: 'Server misconfiguration: NEXT_PUBLIC_API_BASE_URL not set' })

    const loginRes = await fetch(`${backendUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: session.user.email,
        name: session.user.name ?? session.user.email.split('@')[0],
      }),
    })

    if (!loginRes.ok) {
      console.error('[backend-token] Backend login failed:', loginRes.status)
      return res.status(502).json({ message: 'Failed to authenticate with backend' })
    }

    const data = await loginRes.json() as { data?: { token?: string } }
    const token = data?.data?.token
    if (!token) return res.status(502).json({ message: 'Invalid backend response' })

    return res.status(200).json({ token })
  } catch (error) {
    console.error('[backend-token]', error)
    return res.status(500).json({ message: 'Failed to generate token' })
  }
}
