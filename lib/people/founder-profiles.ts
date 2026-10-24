import founders from "./founders.json";

type WorkItem = { heading: string; description: string; href?: string; linkLabel?: string };
type FounderProfileData = {
  name: string;
  role: string;
  region?: string;
  introduction: string;
  portrait?: string;
  biography: string[];
  motivation?: string;
  work: WorkItem[];
  professionalLinks?: { label: string; href: string }[];
};

export const founderProfiles: Record<"arnav-maheshwari" | "akarsh-malavalli", FounderProfileData> = {
  "arnav-maheshwari": {
    ...founders.arnav,
    role: "Co-Founder · Institutional Partnerships & Global Operations",
    introduction: "Connecting open economics resources with schools, local organizations, and regional partners.",
    portrait: "/people/arnav-maheshwari.png",
    biography: [
      "As Co-Founder of The Open Economics Project, Arnav oversees institutional partnerships, international chapter expansion, and organizational governance.",
      "He works closely with regional ambassadors, schools, and community organizations to turn open digital content into local educational impact.",
    ],
    work: [
      { heading: "Institutional partnerships", description: "Works with schools and community organizations to connect open economics resources with local learning spaces.", href: "/work/partnerships", linkLabel: "Explore partnerships" },
      { heading: "International chapters", description: "Oversees international chapter expansion and works closely with regional ambassadors." },
      { heading: "Organizational governance", description: "Helps guide the project's operations and long-term direction." },
    ],
  },
  "akarsh-malavalli": {
    ...founders.akarsh,
    role: "Co-Founder · Academic Curriculum & Digital Learning",
    introduction: "Making rigorous economics education more intuitive and accessible through open curricula and learning tools.",
    portrait: "/people/akarsh-malavalli.png",
    biography: [
      "As Co-Founder of The Open Economics Project, Akarsh leads curriculum architecture across AP, IB, and A-Level pathways, alongside the design of interactive learning tools such as Graph Lab and Olympiad Studio.",
      "His work focuses on combining academic precision with intuitive visual pedagogy.",
    ],
    work: [
      { heading: "Curriculum architecture", description: "Leads the structure of OEP's AP, IB, and A-Level economics pathways.", href: "/learn", linkLabel: "Explore OEP Learn" },
      { heading: "Interactive learning", description: "Helps design digital tools that let students explore economic ideas visually.", href: "/graphs", linkLabel: "Explore Graph Lab" },
      { heading: "Academic quality", description: "Brings academic precision and clear visual explanations together in OEP learning materials." },
    ],
  },
};

export type FounderSlug = keyof typeof founderProfiles;
