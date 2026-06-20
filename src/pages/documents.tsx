import { useEffect } from 'react'
import { useRouter } from 'next/router'
import type { NextPage } from 'next'

const DocumentsRedirect: NextPage = () => {
  const router = useRouter()

  useEffect(() => {
    const query = router.query.connected ? `?connected=${router.query.connected}` : ''
    router.replace(`/knowledge-base${query}`)
  }, [router])

  return null
}

export default DocumentsRedirect
