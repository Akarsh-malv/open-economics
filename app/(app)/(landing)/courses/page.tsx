import { CourseCatalog } from "@/components/redesign/academy";
import { getCourses } from "@/lib/data/courses";
import { buildPublicMetadata } from "@/lib/seo";
export const metadata = buildPublicMetadata({ title: "Courses · OEP Learn", description: "Explore the complete OpenEconomics course catalog.", path: "/courses" });
export default async function Page() {
  const courses = await getCourses();
  const apCourses = courses
    .filter((c): c is typeof c & { slug: string } => c.slug === 'ap-microeconomics' || c.slug === 'ap-macroeconomics')
    .map(c => ({ slug: c.slug, title: c.title, description: c.description ?? '', lessonCount: c.lessonCount ?? 0 }));
  const catalog = [
    ...apCourses,
    { slug: 'ib-economics', title: 'IB Economics · SL & HL', description: 'One pathway for IB Standard Level and Higher Level economics, with level-specific lessons and practice.', lessonCount: 0 },
    { slug: 'a-level-economics', title: 'A-Level Economics', description: 'Develop economic analysis and evaluation for Cambridge AS and A Level study.', lessonCount: 0 },
  ];
  return <div className="academy-content"><div className="eyebrow">YOUR NEXT POSSIBILITY</div><h1>Make sense of the world.</h1><p>Choose a learning pathway. Lessons are coming soon. Explore the courses we are preparing.</p><section className="a-section"><CourseCatalog courses={catalog}/></section></div>;
}
