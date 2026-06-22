import type { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: { destination: '/agents', permanent: false },
})

export default function Home() {
  return null
}
