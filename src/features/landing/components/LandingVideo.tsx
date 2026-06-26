export default function LandingVideo() {
  return (
    <section id="demo" className="px-4 py-20 md:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            Lihat Chaplin Beraksi
          </h2>
          <p className="text-rem-100 text-muted-foreground max-w-xl mx-auto">
            Tonton demo singkat dan pelajari bagaimana Chaplin dapat mengotomasi alur kerja AI agent di perusahaan Anda.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute inset-0 h-full w-full"
              width="560"
              height="315"
              src="https://www.youtube.com/embed/alTYHqvnPHk?si=EvHTRtWOHNPyJEMg"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  )
}
