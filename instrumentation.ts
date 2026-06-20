export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { runCronTick } = await import('./src/shared/lib/driveProcessor')
    setInterval(() => { runCronTick().catch(console.error) }, 15000)
  }
}
