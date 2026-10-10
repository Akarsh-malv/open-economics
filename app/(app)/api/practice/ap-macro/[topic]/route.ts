import { gradeAnswer } from "@/lib/practice/bank";
import { getPracticeTopic } from "@/lib/practice/topics";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ topic: string }> },
) {
  const { topic: slug } = await params;
  if (!getPracticeTopic(slug))
    return Response.json({ error: "Topic not found." }, { status: 404 });
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Choose an answer before submitting." },
      { status: 400 },
    );
  }
  if (
    !body ||
    typeof body !== "object" ||
    !("id" in body) ||
    !("selected" in body) ||
    typeof body.id !== "number" ||
    !Number.isInteger(body.id) ||
    typeof body.selected !== "string" ||
    !/^[A-E]$/.test(body.selected)
  ) {
    return Response.json(
      { error: "Choose a valid question and answer." },
      { status: 400 },
    );
  }
  const result = await gradeAnswer(slug, body.id, body.selected);
  if (!result)
    return Response.json(
      { error: "Question or answer not found." },
      { status: 400 },
    );
  return Response.json(result, { headers: { "Cache-Control": "no-store" } });
}
