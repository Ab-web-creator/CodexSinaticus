/** Hamburger icon (three lines) for the book-menu buttons. */
export default function MenuIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={`inline-block h-4 w-4 ${className}`} aria-hidden>
      <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
