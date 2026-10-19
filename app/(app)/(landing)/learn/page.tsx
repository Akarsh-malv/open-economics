import { Dashboard } from "@/components/redesign/academy";
import { getCourses } from "@/lib/data/courses";
import { buildPublicMetadata } from "@/lib/seo";
export const metadata = buildPublicMetadata({ title: "OEP Learn", description: "Economics lessons, original practice and interactive graphs in one learning space.", path: "/learn" });
export default async function Page() { const courses = await getCourses(); return <Dashboard courses={courses.filter((c): c is typeof c & {
    slug: string;
} => Boolean(c.slug)).map(c => ({ slug: c.slug, title: c.title, description: c.description ?? '', lessonCount: c.lessonCount ?? 0, firstLessonSlug: c.firstLessonSlug }))}/>; }
