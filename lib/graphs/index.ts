import { macroCategories, macroGraphDefinitions } from "./definitions/macro";
import { microCategories, microGraphDefinitions } from "./definitions/micro";
import type { GraphCourse, GraphDefinition } from "./engine";

export const allGraphDefinitions: GraphDefinition[] = [
  ...microGraphDefinitions,
  ...macroGraphDefinitions,
];

export type GraphCategoryGroup = {
  course: GraphCourse;
  courseLabel: string;
  categories: { name: string; graphs: GraphDefinition[] }[];
};

function groupCourse(
  course: GraphCourse,
  courseLabel: string,
  categories: string[],
): GraphCategoryGroup {
  return {
    course,
    courseLabel,
    categories: categories.map((name) => ({
      name,
      graphs: allGraphDefinitions.filter(
        (graph) => graph.course === course && graph.category === name,
      ),
    })),
  };
}

export const graphLibrary: GraphCategoryGroup[] = [
  groupCourse("ap-micro", "AP Microeconomics", microCategories),
  groupCourse("ap-macro", "AP Macroeconomics", macroCategories),
];

export function getGraphDefinition(id: string): GraphDefinition | null {
  return allGraphDefinitions.find((graph) => graph.id === id) ?? null;
}

export const defaultGraphId = allGraphDefinitions[0].id;
