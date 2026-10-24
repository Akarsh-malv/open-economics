export const activities = {
  "supply-and-demand": {
    title: "Supply and demand",
    eyebrow: "STARTER ACTIVITY 01",
    alignment: "AP Micro · IB SL/HL · Cambridge AS/A Level",
    introduction: "Use a familiar market to explain how a change in demand affects equilibrium.",
    scenario: "A city opens a new university campus. More students move nearby. Building new apartment blocks takes time, though some vacant apartments can still be offered for rent.",
    questions: [
      "Sketch a supply and demand diagram for rental apartments. Label the initial equilibrium P₁ and Q₁.",
      "Which curve shifts when the new students arrive? Show the shift and label the new equilibrium P₂ and Q₂.",
      "Predict the direction of the change in rent and the number of apartments rented. Explain why both change.",
      "Extension: What might happen to supply over a longer period if construction is possible?",
    ],
    answers: [
      "The initial equilibrium is where the original demand and supply curves intersect.",
      "Demand shifts right from D₁ to D₂ because more students want housing at each rent. Short-run supply stays in place.",
      "Equilibrium rent rises and the quantity of apartments rented increases along the existing supply curve.",
      "Over time, new construction may shift supply right, increasing quantity and easing some upward pressure on rent.",
    ],
    teacherNote: "Ask learners to distinguish a shift of the demand curve from movement along the supply curve. A second scenario with a supply shock can help test that distinction.",
  },
  "opportunity-cost-ppc": {
    title: "Opportunity cost & PPC",
    eyebrow: "STARTER ACTIVITY 02",
    alignment: "AP Micro · IB SL/HL · Cambridge AS/A Level",
    introduction: "Calculate trade-offs and use them to interpret a production possibilities curve.",
    scenario: "A workshop can use its resources to make study guides or practice packs. Its possible combinations are A: 0 guides and 40 packs; B: 10 guides and 36 packs; C: 20 guides and 28 packs; D: 30 guides and 16 packs; E: 40 guides and 0 packs.",
    questions: [
      "Plot the five combinations with study guides on the horizontal axis and practice packs on the vertical axis. Connect them to form a PPC.",
      "What is the opportunity cost of moving from B to C? State it in practice packs.",
      "Compare the opportunity cost of moving from B to C with the cost of moving from C to D. What pattern do you notice?",
      "Could the workshop make 30 guides and 28 packs with its current resources? Explain.",
    ],
    answers: [
      "The plotted combinations trace a downward-sloping, outward-bowed PPC.",
      "Moving from B to C gains 10 guides and gives up 8 practice packs (36 − 28).",
      "Moving from C to D gives up 12 packs (28 − 16). The opportunity cost rises as more guides are produced.",
      "No. At 30 guides, the stated maximum is 16 packs. A point at 30 guides and 28 packs lies outside the current PPC.",
    ],
    teacherNote: "Have students calculate every adjacent trade-off before drawing the curve. Discuss why resources may not be equally suited to producing both outputs.",
  },
  "macroeconomic-indicators": {
    title: "Macroeconomic indicators",
    eyebrow: "STARTER ACTIVITY 03",
    alignment: "AP Macro · IB SL/HL · Cambridge AS/A Level",
    introduction: "Calculate two common indicators and interpret what they can and cannot tell us.",
    scenario: "An economy's consumer price index rises from 100 last year to 108 this year. Its labor force contains 125 million people, of whom 118 million are employed.",
    questions: [
      "Calculate the inflation rate using the change in the consumer price index.",
      "How many people are unemployed? Calculate the unemployment rate as a percentage of the labor force.",
      "If nominal wages rise by 5% during the same period, what happens approximately to purchasing power?",
      "Name one important limit of using either of these two indicators alone to judge economic well-being.",
    ],
    answers: [
      "Inflation is ((108 − 100) ÷ 100) × 100 = 8%.",
      "7 million people are unemployed (125 − 118). The unemployment rate is (7 ÷ 125) × 100 = 5.6%.",
      "With prices rising 8% and nominal wages rising 5%, real wages fall by about 3%; purchasing power declines.",
      "Examples: CPI may not match every household's spending basket; unemployment excludes people outside the labor force; neither figure describes income distribution by itself.",
    ],
    teacherNote: "Ask learners to show the denominator in each calculation. Follow up by discussing why a national average can hide different experiences across households.",
  },
} as const;

export type ActivitySlug = keyof typeof activities;
