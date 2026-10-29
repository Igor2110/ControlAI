export default function Logo({ size = 'md' }: { size?: 'md' | 'lg' }) {
  return (
    <span className={`inline-flex items-center gap-2.5 font-display font-bold ${size === 'lg' ? 'text-2xl' : 'text-lg'}`}>
      <span className={`grid place-items-center rounded-lg bg-brand ${size === 'lg' ? 'size-9' : 'size-8'}`}>
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 16l5-6 4 4 7-9" />
        </svg>
      </span>
      Controlai
    </span>
  )
}
