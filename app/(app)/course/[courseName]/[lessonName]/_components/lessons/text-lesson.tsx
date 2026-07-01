import { MarkdownRenderer } from "@/components/markdown";
import { InteractiveEconomicsGraph } from "@/components/interactive-economics-graph";
import { supplyDemandGraphConfig } from "@/lib/data/economics-graphs";
import { extractHeadings } from "@/lib/markdown/extract-headings";
import type { Lesson, Media } from "@/types/payload-types";
import { LessonTOC } from "../lesson-toc";
import { GuidedPpcLesson } from "./guided-ppc-lesson";
import { GuidedScarcityLesson } from "./guided-scarcity-lesson";

interface TextLessonProps {
  lesson: Lesson;
}

export function TextLesson({ lesson }: TextLessonProps) {
  if (lesson.slug === "scarcity-and-economic-thinking") {
    return <GuidedScarcityLesson />;
  }

  if (lesson.slug === "production-possibilities-frontier") {
    return <GuidedPpcLesson />;
  }

  const headings = extractHeadings(lesson.content);

  return (
    <div className="lesson-reading-grid">
      <div className="min-w-0">
        <MarkdownRenderer
          content={lesson.content ?? "No Content"}
          media={lesson.uploadImage as Media[]}
          // don't optimize free lessons for better SEO
          // there are no performance issues since they are SSGed
          optimizeMath={!lesson.free || process.env.NODE_ENV === "development"}
          isFreeLesson={lesson.free ?? false}
          useSections
        />
        {lesson.slug === "demand-supply-and-equilibrium" && (
          <InteractiveEconomicsGraph
            config={supplyDemandGraphConfig}
            className="mt-6"
          />
        )}
      </div>
      {headings.length > 0 && <LessonTOC headings={headings} />}
    </div>
  );
}
