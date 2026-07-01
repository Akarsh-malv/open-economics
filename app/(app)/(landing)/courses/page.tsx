import { buildPublicMetadata } from "@/lib/seo";

export const metadata = buildPublicMetadata({
  title: "Courses",
  description: "Open Economics course pathways.",
  path: "/courses",
});

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-[#071a33]">
      <main className="mx-auto w-full max-w-7xl px-5 pb-24 pt-16 sm:px-6 lg:px-8">
        <h1 className="text-6xl font-extrabold tracking-tight sm:text-7xl">
          Courses
        </h1>
      </main>
    </div>
  );
}
