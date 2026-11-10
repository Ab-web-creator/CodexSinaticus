import { notFound, redirect } from "next/navigation";
import { BOOKS, getBook } from "@/lib/books";

export const generateStaticParams = () => BOOKS.map((b) => ({ book: b.slug }));
export const dynamicParams = false;

/** /ar/john -> /ar/john/1 */
export default async function ArabicBookPage({ params }: { params: Promise<{ book: string }> }) {
  const { book } = await params;
  if (!getBook(book)) notFound();
  redirect(`/ar/${book}/1`);
}
