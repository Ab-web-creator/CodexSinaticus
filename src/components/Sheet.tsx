/** A printed-page style sheet used for each text. */
export default function Sheet({
  children,
  className = "",
  ...rest
}: React.HTMLAttributes<HTMLElement> & { children: React.ReactNode }) {
  return (
    <article
      {...rest}
      className={`bg-surface px-6 py-12 sm:rounded-sm sm:border sm:border-line sm:py-16 sm:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_40px_-12px_rgba(60,40,20,0.18)] ${className}`}
    >
      {children}
    </article>
  );
}
