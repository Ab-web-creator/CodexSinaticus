export default function Ornament({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 12" className={`block text-accent ${className}`} aria-hidden>
      <path d="M2 6 H62 M98 6 H158" stroke="currentColor" strokeWidth="0.75" opacity="0.6" />
      <path d="M80 1 L85 6 L80 11 L75 6 Z" fill="currentColor" />
      <circle cx="68" cy="6" r="1.6" fill="currentColor" />
      <circle cx="92" cy="6" r="1.6" fill="currentColor" />
    </svg>
  );
}
