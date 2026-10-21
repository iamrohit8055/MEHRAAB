export default function App() {
  return (
    <main className="min-h-screen bg-obsidian text-ivory flex flex-col items-center justify-center p-8 selection:bg-gold selection:text-obsidian">
      <div className="w-full max-w-lg border border-gold/30 bg-espresso/40 backdrop-blur-sm p-8 rounded-sm text-center shadow-2xl">
        <span className="text-xs uppercase tracking-[0.3em] text-gold font-sans block mb-2">
          Setup Complete · Phase 1
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl tracking-widest text-ivory uppercase mb-4">
          Mehraab
        </h1>
        <p className="font-serif italic text-gold text-lg mb-6">
          Café · Cuisine · Culture
        </p>
        <p className="font-sans text-sm text-ivory/80 leading-relaxed mb-6 font-light">
          Vite, React 19, TypeScript, and Tailwind CSS v4 are configured and verified with the Mehraab luxury palette.
        </p>
        <div className="flex items-center justify-center gap-3 text-xs text-ivory/60 font-sans tracking-wider border-t border-gold/20 pt-4">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Environment & Design Tokens Ready
        </div>
      </div>
    </main>
  )
}
