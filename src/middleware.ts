export { default } from 'next-auth/middleware'

export const config = {
  matcher: ['/home', '/agents', '/knowledge-base', '/usage'],
}
