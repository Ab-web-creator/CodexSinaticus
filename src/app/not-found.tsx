import Link from "next/link";
import Ornament from "@/components/Ornament";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <p className="greek text-5xl text-accent">ΟΥΧ ΕΥΡΕΘΗ</p>
      <Ornament className="mt-5 mb-6 w-40" />
      <h1 className="text-xl font-medium">This page doesn’t exist</h1>
      <p dir="rtl" lang="ar" className="arabic mt-2 text-xl text-muted">هذه الصفحة غير موجودة</p>
      <div className="mt-8 flex gap-6">
        <Link href="/" className="text-accent hover:underline">All books</Link>
        <Link href="/ar" dir="rtl" lang="ar" className="arabic text-lg text-accent hover:underline">
          الأناجيل
        </Link>
      </div>
    </main>
  );
}
