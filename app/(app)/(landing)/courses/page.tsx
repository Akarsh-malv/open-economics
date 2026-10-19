import { CourseCatalog } from "@/components/redesign/academy";
import { getCourses } from "@/lib/data/courses";
import { buildPublicMetadata } from "@/lib/seo";
export const metadata = buildPublicMetadata({ title: "Courses · OEP Learn", description: "Explore the complete OpenEconomics course catalog.", path: "/courses" });
export default async function Page() { const courses = await getCourses(); return <div className="academy-content"><div className="eyebrow">YOUR NEXT POSSIBILITY</div><h1>Make sense of the world.</h1><p>Choose a learning pathway. Lessons are coming soon. Explore the courses we are preparing.</p><section className="a-section"><CourseCatalog courses={courses.filter((c): c is typeof c & {
    slug: string;
} => Boolean(c.slug)).map(c => ({ slug: c.slug, title: c.title, description: c.description ?? '', lessonCount: c.lessonCount ?? 0 }))}/></section></div>; }
