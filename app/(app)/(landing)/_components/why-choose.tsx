"use client";

import { Check } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

type Reason = {
  title: string;
  description: string;
};

const reasons: Reason[] = [
  {
    title: "Interactive Learning",
    description:
      "Move through guided lessons, quick checks, and economics diagrams designed for active review.",
  },
  {
    title: "Made for Economics",
    description:
      "Built around AP and IB Economics concepts, with readable explanations and graph-based reasoning.",
  },
  {
    title: "Built for Review",
    description:
      "Concise course paths help students practice terminology, diagrams, and exam-style decisions.",
  },
];

export function WhyChoose() {
  return (
    <section className="border-y bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-20 lg:py-24">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Why Choose Open Economics?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A focused lesson interface for economics review and exam prep.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason, idx) => (
            <WhyChooseCard key={reason.title} reason={reason} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyChooseCard({ reason, idx }: { reason: Reason; idx: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, filter: "blur(8px)", y: 30 }}
      animate={isInView ? { opacity: 1, filter: "blur(0px)", y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut", delay: idx * 0.15 }}
      className="space-y-3"
    >
      <div className="flex gap-3">
        <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
        <h3 className="font-semibold">{reason.title}</h3>
      </div>
      <p className="text-sm text-muted-foreground">{reason.description}</p>
    </motion.div>
  );
}
