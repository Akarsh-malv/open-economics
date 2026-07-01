import type { Chapter, Course, Lesson, Poster } from "@/types/payload-types";

const now = "2026-06-01T12:00:00.000Z";

const apMicroPoster: Poster = {
  id: "poster-ap-micro",
  alt: "Supply and demand curves on a classroom board",
  palette: {
    dominant: "#0b1f3a",
    vibrant: "#0b1f3a",
    darkVibrant: "#071a33",
    lightVibrant: "#eef2f6",
    muted: "#5d6978",
  },
  blurhash: null,
  updatedAt: now,
  createdAt: now,
  url: "/screenshots/thumbnail-template.png",
  thumbnailURL: "/screenshots/thumbnail-template.png",
  filename: "ap-microeconomics.png",
  mimeType: "image/png",
  filesize: 0,
  width: 1200,
  height: 630,
  focalX: 50,
  focalY: 50,
};

const previewPoster = (id: string, alt: string, filename: string): Poster => ({
  ...apMicroPoster,
  id,
  alt,
  filename,
});

export const mockCourses: Course[] = [
  {
    id: "course-ap-microeconomics",
    title: "AP Microeconomics",
    slug: "ap-microeconomics",
    price: 0,
    description:
      "Learn scarcity, supply and demand, markets, firm behavior, and market failure with Open Economics lessons.",
    poster: apMicroPoster,
    lessonCount: 34,
    totalQuizQuestions: 5,
    totalReadingTimeSeconds: 13620,
    totalVideoSeconds: 0,
    firstLessonSlug: "scarcity-and-economic-thinking",
    firstFreeLessonSlug: "scarcity-and-economic-thinking",
    updatedAt: now,
    createdAt: now,
    _status: "published",
  },
  {
    id: "course-ap-macroeconomics",
    title: "AP Macroeconomics",
    slug: "ap-macroeconomics",
    price: 0,
    description:
      "Study GDP, inflation, unemployment, fiscal policy, monetary policy, and international trade.",
    poster: previewPoster(
      "poster-ap-macro",
      "Macroeconomic indicators and policy tools",
      "ap-macroeconomics.png",
    ),
    lessonCount: 4,
    totalQuizQuestions: 0,
    totalReadingTimeSeconds: 1200,
    totalVideoSeconds: 0,
    firstLessonSlug: "measuring-economic-performance",
    firstFreeLessonSlug: "measuring-economic-performance",
    updatedAt: now,
    createdAt: now,
    _status: "published",
  },
  {
    id: "course-hl-economics",
    title: "HL Economics",
    slug: "hl-economics",
    price: 0,
    description:
      "Advanced IB Economics lessons with diagrams, evaluation, and policy applications.",
    poster: previewPoster(
      "poster-hl-economics",
      "IB Economics analysis and policy evaluation",
      "hl-economics.png",
    ),
    lessonCount: 4,
    totalQuizQuestions: 0,
    totalReadingTimeSeconds: 1200,
    totalVideoSeconds: 0,
    firstLessonSlug: "hl-market-intervention",
    firstFreeLessonSlug: "hl-market-intervention",
    updatedAt: now,
    createdAt: now,
    _status: "published",
  },
  {
    id: "course-sl-economics",
    title: "SL Economics",
    slug: "sl-economics",
    price: 0,
    description:
      "Core IB Economics lessons focused on concepts, diagrams, examples, and exam-style practice.",
    poster: previewPoster(
      "poster-sl-economics",
      "Core IB Economics concepts and diagrams",
      "sl-economics.png",
    ),
    lessonCount: 4,
    totalQuizQuestions: 0,
    totalReadingTimeSeconds: 1200,
    totalVideoSeconds: 0,
    firstLessonSlug: "sl-scarcity-and-choice",
    firstFreeLessonSlug: "sl-scarcity-and-choice",
    updatedAt: now,
    createdAt: now,
    _status: "published",
  },
];

export const mockChapters: Chapter[] = [
  {
    id: "chapter-basic-concepts",
    title: "Basic Economic Concepts",
    course: mockCourses[0],
    updatedAt: now,
    createdAt: now,
  },
  {
    id: "chapter-supply-demand",
    title: "Supply and Demand",
    course: mockCourses[0],
    updatedAt: now,
    createdAt: now,
  },
  {
    id: "chapter-production-costs",
    title: "Production, Cost, and Perfect Competition",
    course: mockCourses[0],
    updatedAt: now,
    createdAt: now,
  },
  {
    id: "chapter-imperfect-competition",
    title: "Imperfect Competition",
    course: mockCourses[0],
    updatedAt: now,
    createdAt: now,
  },
  {
    id: "chapter-factor-markets",
    title: "Factor Markets",
    course: mockCourses[0],
    updatedAt: now,
    createdAt: now,
  },
  {
    id: "chapter-market-failure",
    title: "Market Failure and Government",
    course: mockCourses[0],
    updatedAt: now,
    createdAt: now,
  },
  {
    id: "chapter-ap-macro-measurement",
    title: "Economic Performance",
    course: mockCourses[1],
    updatedAt: now,
    createdAt: now,
  },
  {
    id: "chapter-ap-macro-policy",
    title: "Stabilization Policy",
    course: mockCourses[1],
    updatedAt: now,
    createdAt: now,
  },
  {
    id: "chapter-hl-micro",
    title: "Microeconomic Analysis",
    course: mockCourses[2],
    updatedAt: now,
    createdAt: now,
  },
  {
    id: "chapter-hl-global",
    title: "Global Economics",
    course: mockCourses[2],
    updatedAt: now,
    createdAt: now,
  },
  {
    id: "chapter-sl-foundations",
    title: "Foundations",
    course: mockCourses[3],
    updatedAt: now,
    createdAt: now,
  },
  {
    id: "chapter-sl-markets",
    title: "Markets",
    course: mockCourses[3],
    updatedAt: now,
    createdAt: now,
  },
];

const apMicroTopicLessons: Lesson[] = [
  makeApMicroTopicLesson({
    id: "lesson-resource-allocation",
    title: "Resource Allocation and Economic Systems",
    slug: "resource-allocation-and-economic-systems",
    chapter: mockChapters[0],
    content:
      "Economic systems answer what to produce, how to produce, and for whom to produce. Markets, commands, and mixed systems allocate scarce resources in different ways.",
  }),
  makeApMicroTopicLesson({
    id: "lesson-comparative-advantage",
    title: "Comparative Advantage and Gains from Trade",
    slug: "comparative-advantage-and-gains-from-trade",
    chapter: mockChapters[0],
    content:
      "Comparative advantage explains why people and countries gain from specialization and trade, even when one producer is absolutely better at everything.",
  }),
  makeApMicroTopicLesson({
    id: "lesson-cost-benefit-analysis",
    title: "Cost-Benefit Analysis",
    slug: "cost-benefit-analysis",
    chapter: mockChapters[0],
    content:
      "Cost-benefit analysis compares the expected marginal benefits of an action with its expected marginal costs before making a choice.",
  }),
  makeApMicroTopicLesson({
    id: "lesson-marginal-analysis-consumer-choice",
    title: "Marginal Analysis and Consumer Choice",
    slug: "marginal-analysis-and-consumer-choice",
    chapter: mockChapters[0],
    content:
      "Consumers make choices at the margin by comparing the extra benefit from one more unit with the extra cost of getting it.",
  }),
  makeApMicroTopicLesson({
    id: "lesson-demand",
    title: "Demand",
    slug: "demand",
    chapter: mockChapters[1],
    content:
      "Demand shows the quantities consumers are willing and able to buy at different prices, holding other determinants constant.",
  }),
  makeApMicroTopicLesson({
    id: "lesson-supply",
    title: "Supply",
    slug: "supply",
    chapter: mockChapters[1],
    content:
      "Supply shows the quantities producers are willing and able to sell at different prices, holding production conditions constant.",
  }),
  makeApMicroTopicLesson({
    id: "lesson-market-equilibrium-disequilibrium",
    title: "Market Equilibrium and Disequilibrium",
    slug: "market-equilibrium-and-disequilibrium",
    chapter: mockChapters[1],
    content:
      "Equilibrium occurs where quantity demanded equals quantity supplied. Shortages and surpluses create pressure for prices to adjust.",
  }),
  makeApMicroTopicLesson({
    id: "lesson-government-intervention-markets",
    title: "Government Intervention in Markets",
    slug: "government-intervention-in-markets",
    chapter: mockChapters[1],
    content:
      "Price controls, taxes, and subsidies change incentives and can move markets away from or toward efficient outcomes.",
  }),
  makeApMicroTopicLesson({
    id: "lesson-international-trade-public-policy",
    title: "International Trade and Public Policy",
    slug: "international-trade-and-public-policy",
    chapter: mockChapters[1],
    content:
      "Trade creates gains from specialization, while tariffs and quotas change domestic prices, quantities, and welfare.",
  }),
  makeApMicroTopicLesson({
    id: "lesson-production-function",
    title: "The Production Function",
    slug: "the-production-function",
    chapter: mockChapters[2],
    content:
      "A production function shows how inputs combine to produce output and why diminishing marginal returns matter in the short run.",
  }),
  makeApMicroTopicLesson({
    id: "lesson-short-long-run-costs",
    title: "Short-Run and Long-Run Production Costs",
    slug: "short-run-and-long-run-production-costs",
    chapter: mockChapters[2],
    content:
      "Short-run costs include fixed and variable costs. In the long run, firms can adjust all inputs and choose scale.",
  }),
  makeApMicroTopicLesson({
    id: "lesson-types-of-profit",
    title: "Types of Profit",
    slug: "types-of-profit",
    chapter: mockChapters[2],
    content:
      "Accounting profit subtracts explicit costs, while economic profit subtracts both explicit and implicit opportunity costs.",
  }),
  makeApMicroTopicLesson({
    id: "lesson-profit-maximization",
    title: "Profit Maximization",
    slug: "profit-maximization",
    chapter: mockChapters[2],
    content:
      "Firms maximize profit by producing where marginal revenue equals marginal cost when producing is better than shutting down.",
  }),
  makeApMicroTopicLesson({
    id: "lesson-price-discrimination",
    title: "Price Discrimination",
    slug: "price-discrimination",
    chapter: mockChapters[3],
    content:
      "Price discrimination occurs when a firm charges different prices to different buyers based on willingness to pay.",
  }),
  makeApMicroTopicLesson({
    id: "lesson-monopolistic-competition",
    title: "Monopolistic Competition",
    slug: "monopolistic-competition",
    chapter: mockChapters[3],
    content:
      "Monopolistic competition combines many firms with differentiated products, giving each firm limited market power.",
  }),
  makeApMicroTopicLesson({
    id: "lesson-introduction-factor-markets",
    title: "Introduction to Factor Markets",
    slug: "introduction-to-factor-markets",
    chapter: mockChapters[4],
    content:
      "Factor markets are markets for resources such as labor and capital. Firms demand factors because they help produce output.",
  }),
  makeApMicroTopicLesson({
    id: "lesson-factor-demand-supply-shifts",
    title: "Changes in Factor Demand and Supply",
    slug: "changes-in-factor-demand-and-supply",
    chapter: mockChapters[4],
    content:
      "Factor demand and supply shift when productivity, product demand, resource availability, or worker preferences change.",
  }),
  makeApMicroTopicLesson({
    id: "lesson-perfectly-competitive-factor-markets",
    title: "Perfectly Competitive Factor Markets",
    slug: "perfectly-competitive-factor-markets",
    chapter: mockChapters[4],
    content:
      "In a competitive factor market, firms hire resources up to the point where marginal revenue product equals marginal factor cost.",
  }),
  makeApMicroTopicLesson({
    id: "lesson-monopsonistic-markets",
    title: "Monopsonistic Markets",
    slug: "monopsonistic-markets",
    chapter: mockChapters[4],
    content:
      "A monopsony is a market with one dominant buyer of a resource, giving the firm wage-setting or input-price-setting power.",
  }),
  makeApMicroTopicLesson({
    id: "lesson-efficient-inefficient-market-outcomes",
    title: "Efficient and Inefficient Market Outcomes",
    slug: "efficient-and-inefficient-market-outcomes",
    chapter: mockChapters[5],
    content:
      "An efficient market outcome maximizes total surplus. Inefficiency occurs when quantity is above or below the socially optimal level.",
  }),
  makeApMicroTopicLesson({
    id: "lesson-externalities",
    title: "Externalities",
    slug: "externalities",
    chapter: mockChapters[5],
    content:
      "Externalities occur when a decision creates costs or benefits for third parties that are not reflected in the market price.",
  }),
  makeApMicroTopicLesson({
    id: "lesson-income-wealth-inequality",
    title: "Income and Wealth Inequality",
    slug: "income-and-wealth-inequality",
    chapter: mockChapters[5],
    content:
      "Income and wealth inequality describe how resources are distributed and how policy can affect equity and incentives.",
  }),
];

export const mockLessons: Lesson[] = [
  {
    id: "lesson-scarcity",
    title: "Scarcity and Economic Thinking",
    slug: "scarcity-and-economic-thinking",
    free: true,
    course: mockCourses[0],
    chapter: mockChapters[0],
    type: "text",
    content: `## What economists study

Economics starts with scarcity: people have unlimited wants, but time, money, labor, land, and capital are limited. Microeconomics studies how individuals, firms, and governments make choices under those limits.

## Opportunity cost

The opportunity cost of a choice is the value of the next-best alternative you give up. It is not every possible thing you give up, and it is not always measured in dollars.

Example: If a student spends one hour studying AP Micro instead of working a job that pays \\$16, the opportunity cost includes the \\$16 wage and any other value from the forgone work experience.

:::tip{title="Key idea"}
Opportunity cost is the value of the next-best alternative, not a list of every possible alternative. The best AP answers name the specific tradeoff and explain why that forgone option matters.
:::

## Marginal analysis

AP Micro often asks whether one more unit is worth it. A rational decision maker chooses an action when marginal benefit is at least marginal cost.

:::note{title="Exam signal"}
On the AP exam, look for phrases like "additional," "one more," or "next unit." Those usually signal marginal analysis.
:::

## Quick check

:::card{title="Quick check"}
**Question:** If the marginal benefit of producing one more unit is \\$9 and the marginal cost is \\$7, should the firm produce it?

**Answer:** Yes. The unit adds \\$2 of net benefit because marginal benefit exceeds marginal cost.
:::`,
    readingTimeSeconds: 360,
    updatedAt: now,
    createdAt: now,
    _status: "published",
  },
  {
    id: "lesson-ppf",
    title: "Production Possibilities Frontier",
    slug: "production-possibilities-frontier",
    free: true,
    course: mockCourses[0],
    chapter: mockChapters[0],
    type: "text",
    content: `## Reading the PPF

A production possibilities frontier shows the maximum combinations of two goods an economy can produce when resources and technology are fixed.

Points on the frontier are efficient. Points inside the frontier are inefficient. Points outside the frontier are currently unattainable.

## Shape and opportunity cost

A bowed-out PPF means opportunity cost increases as production shifts toward one good. This happens because resources are not equally suited to every task.

## Growth

Economic growth shifts the PPF outward. Growth can come from more resources, better technology, or improved human capital.

## AP Micro connection

The PPF is usually a foundation question. Use it to explain scarcity, tradeoffs, efficiency, opportunity cost, and growth before moving into market models.`,
    readingTimeSeconds: 420,
    updatedAt: now,
    createdAt: now,
    _status: "published",
  },
  {
    id: "lesson-supply-demand",
    title: "Demand, Supply, and Equilibrium",
    slug: "demand-supply-and-equilibrium",
    free: true,
    course: mockCourses[0],
    chapter: mockChapters[1],
    type: "text",
    content: `## Demand

Demand shows the quantities consumers are willing and able to buy at different prices. A change in price causes movement along the demand curve. A change in a non-price determinant shifts the curve.

Common demand shifters:

- Income
- Tastes and preferences
- Prices of substitutes and complements
- Expectations
- Number of buyers

## Supply

Supply shows the quantities producers are willing and able to sell at different prices. A change in input costs, technology, taxes, subsidies, expectations, or number of sellers shifts supply.

## Equilibrium

Equilibrium occurs where quantity demanded equals quantity supplied. If price is above equilibrium, surplus puts downward pressure on price. If price is below equilibrium, shortage puts upward pressure on price.

::callout{type="success"}
For AP graphs, label both axes, both curves, equilibrium price, and equilibrium quantity. Then show the direction of any shift with an arrow.
::`,
    readingTimeSeconds: 540,
    updatedAt: now,
    createdAt: now,
    _status: "published",
  },
  {
    id: "lesson-elasticity",
    title: "Elasticity Quiz",
    slug: "elasticity-quiz",
    free: true,
    course: mockCourses[0],
    chapter: mockChapters[1],
    type: "quiz",
    quiz: [
      {
        id: "q-elasticity-1",
        question:
          "A coffee shop raises price from $4 to $5, and quantity demanded falls from 100 cups to 80 cups. Using the midpoint method, what is the price elasticity of demand?",
        options: [
          { id: "a", text: "0.5", isCorrect: false },
          { id: "b", text: "1.0", isCorrect: true },
          { id: "c", text: "1.8", isCorrect: false },
          { id: "d", text: "5.0", isCorrect: false },
        ],
        hint: "Use percentage change in quantity divided by percentage change in price with midpoint averages.",
        solution:
          "Quantity changes by 20 over an average of 90, or 22.2%. Price changes by 1 over an average of 4.5, or 22.2%. Elasticity is 1.0, so demand is unit elastic.",
      },
      {
        id: "q-elasticity-2",
        question:
          "If demand is inelastic, what happens to total revenue when price increases?",
        options: [
          { id: "a", text: "Total revenue increases.", isCorrect: true },
          { id: "b", text: "Total revenue decreases.", isCorrect: false },
          { id: "c", text: "Total revenue is always zero.", isCorrect: false },
          { id: "d", text: "Total revenue cannot be predicted.", isCorrect: false },
        ],
        hint: "With inelastic demand, quantity demanded changes proportionally less than price.",
        solution:
          "When demand is inelastic, the price effect dominates the quantity effect, so total revenue rises when price rises.",
      },
    ],
    readingTimeSeconds: 300,
    updatedAt: now,
    createdAt: now,
    _status: "published",
  },
  {
    id: "lesson-production-costs",
    title: "Production and Cost Curves",
    slug: "production-and-cost-curves",
    free: true,
    course: mockCourses[0],
    chapter: mockChapters[2],
    type: "text",
    content: `## Production in the short run

Firms combine inputs to produce output. In the short run, at least one input is fixed, so firms often face diminishing marginal returns.

## Cost vocabulary

Fixed costs do not change with output. Variable costs change as output changes. Marginal cost is the extra cost of producing one more unit.

## AP Micro connection

Cost curves help explain why firms choose a specific output level and why marginal cost matters for supply decisions.`,
    readingTimeSeconds: 420,
    updatedAt: now,
    createdAt: now,
    _status: "published",
  },
  {
    id: "lesson-perfect-competition",
    title: "Perfect Competition",
    slug: "perfect-competition",
    free: true,
    course: mockCourses[0],
    chapter: mockChapters[2],
    type: "text",
    content: `## Price takers

A perfectly competitive firm takes the market price as given. It cannot raise price above the market price because buyers can purchase from many identical sellers.

## Profit-maximizing rule

The firm produces where marginal revenue equals marginal cost, as long as price covers the relevant cost for staying open.

## Long-run outcome

In long-run equilibrium, economic profit is driven to zero as firms enter or exit the market.`,
    readingTimeSeconds: 420,
    updatedAt: now,
    createdAt: now,
    _status: "published",
  },
  {
    id: "lesson-monopoly",
    title: "Monopoly",
    slug: "monopoly",
    free: true,
    course: mockCourses[0],
    chapter: mockChapters[3],
    type: "text",
    content: `## Market power

A monopoly is the only seller of a good with no close substitutes. Because the firm faces the market demand curve, it can influence price.

## Output and price

Monopolies choose output where marginal revenue equals marginal cost, then charge the highest price consumers will pay for that quantity.

## Welfare effect

Compared with perfect competition, monopoly usually produces less, charges more, and creates deadweight loss.`,
    readingTimeSeconds: 420,
    updatedAt: now,
    createdAt: now,
    _status: "published",
  },
  {
    id: "lesson-oligopoly-game-theory",
    title: "Oligopoly and Game Theory",
    slug: "oligopoly-and-game-theory",
    free: true,
    course: mockCourses[0],
    chapter: mockChapters[3],
    type: "text",
    content: `## Strategic behavior

In an oligopoly, a few firms dominate the market. Each firm must consider how rivals will respond to its decisions.

## Game theory

Game theory models strategic choices. AP Micro often uses payoff matrices to identify dominant strategies and Nash equilibria.

## Collusion tension

Firms may benefit from cooperation, but each firm often has an incentive to cheat if it can gain more profit.`,
    readingTimeSeconds: 420,
    updatedAt: now,
    createdAt: now,
    _status: "published",
  },
  {
    id: "lesson-derived-demand",
    title: "Derived Demand for Labor",
    slug: "derived-demand-for-labor",
    free: true,
    course: mockCourses[0],
    chapter: mockChapters[4],
    type: "text",
    content: `## Factor demand

Firms demand labor because labor helps produce goods and services. That demand is derived from demand for the final product.

## Marginal revenue product

Marginal revenue product is the extra revenue a firm earns from hiring one more worker. Firms hire as long as marginal revenue product is at least the wage.

## Shifters

Labor demand can shift when product demand, productivity, output price, or the price of other resources changes.`,
    readingTimeSeconds: 420,
    updatedAt: now,
    createdAt: now,
    _status: "published",
  },
  {
    id: "lesson-labor-market-equilibrium",
    title: "Labor Market Equilibrium",
    slug: "labor-market-equilibrium",
    free: true,
    course: mockCourses[0],
    chapter: mockChapters[4],
    type: "text",
    content: `## Wages and employment

In a competitive labor market, equilibrium occurs where labor demand equals labor supply.

## Minimum wages

A binding minimum wage is set above equilibrium. It can create a surplus of labor, which is unemployment in that market.

## Monopsony

A monopsony is a labor market with one dominant buyer of labor. The firm has wage-setting power.`,
    readingTimeSeconds: 420,
    updatedAt: now,
    createdAt: now,
    _status: "published",
  },
  {
    id: "lesson-market-failure",
    title: "Market Failure and Policy Tools",
    slug: "market-failure-and-policy-tools",
    free: true,
    course: mockCourses[0],
    chapter: mockChapters[5],
    type: "text",
    content: `## When markets miss the efficient outcome

Markets can fail when private decision makers do not account for all social costs or benefits. AP Micro commonly tests externalities, public goods, common resources, and market power.

## Negative externalities

When production or consumption creates external costs, the market quantity is too high. A per-unit tax can move the market toward the socially efficient quantity.

## Positive externalities

When production or consumption creates external benefits, the market quantity is too low. A subsidy can encourage more of the activity.

## Public goods

Public goods are nonexcludable and nonrival. Because people can benefit without paying, private markets tend to underprovide them.

## Exam move

Always compare the market outcome with the socially efficient outcome. Then identify whether the policy should increase or decrease quantity.`,
    readingTimeSeconds: 480,
    updatedAt: now,
    createdAt: now,
    _status: "published",
  },
  {
    id: "lesson-public-goods",
    title: "Public Goods and Common Resources",
    slug: "public-goods-and-common-resources",
    free: true,
    course: mockCourses[0],
    chapter: mockChapters[5],
    type: "text",
    content: `## Public goods

Public goods are nonexcludable and nonrival. Because people can benefit without paying, private markets tend to underprovide them.

## Common resources

Common resources are nonexcludable but rival. Overuse can happen when individuals ignore the costs they impose on others.

## Policy tools

Governments may use taxes, subsidies, regulation, or direct provision to move markets closer to the socially efficient outcome.`,
    readingTimeSeconds: 420,
    updatedAt: now,
    createdAt: now,
    _status: "published",
  },
  ...apMicroTopicLessons,
  {
    id: "lesson-ap-macro-performance",
    title: "Measuring Economic Performance",
    slug: "measuring-economic-performance",
    free: true,
    course: mockCourses[1],
    chapter: mockChapters[6],
    type: "text",
    content: `## The big indicators

Macroeconomics starts by measuring the whole economy. GDP tracks production, unemployment tracks labor market stress, and inflation tracks changes in the price level.

## Exam focus

Use each indicator for a specific job. GDP measures output, not well-being. The unemployment rate misses discouraged workers. Inflation changes purchasing power.`,
    readingTimeSeconds: 300,
    updatedAt: now,
    createdAt: now,
    _status: "published",
  },
  {
    id: "lesson-ap-macro-ad-as",
    title: "Aggregate Demand and Supply",
    slug: "aggregate-demand-and-supply",
    free: true,
    course: mockCourses[1],
    chapter: mockChapters[6],
    type: "text",
    content: `## The AD-AS model

Aggregate demand shows planned spending at each price level. Short-run aggregate supply shows how firms respond when prices and input costs change.

## Interpreting shifts

Demand shocks move output and the price level in the same direction. Supply shocks move them in opposite directions.`,
    readingTimeSeconds: 300,
    updatedAt: now,
    createdAt: now,
    _status: "published",
  },
  {
    id: "lesson-ap-macro-fiscal-policy",
    title: "Fiscal Policy",
    slug: "fiscal-policy",
    free: true,
    course: mockCourses[1],
    chapter: mockChapters[7],
    type: "text",
    content: `## Policy choices

Fiscal policy uses government spending and taxes to influence aggregate demand. Expansionary policy fights recessions. Contractionary policy fights inflation.

## Exam focus

Always identify the problem first, then choose the policy direction and explain the effect on output, employment, and prices.`,
    readingTimeSeconds: 300,
    updatedAt: now,
    createdAt: now,
    _status: "published",
  },
  {
    id: "lesson-ap-macro-monetary-policy",
    title: "Monetary Policy",
    slug: "monetary-policy",
    free: true,
    course: mockCourses[1],
    chapter: mockChapters[7],
    type: "text",
    content: `## Central bank tools

Monetary policy changes interest rates and the money supply. Lower rates encourage borrowing and spending. Higher rates slow demand.

## Exam focus

Connect the policy tool to interest rates, investment, aggregate demand, and the macroeconomic goal.`,
    readingTimeSeconds: 300,
    updatedAt: now,
    createdAt: now,
    _status: "published",
  },
  {
    id: "lesson-hl-market-intervention",
    title: "Market Intervention",
    slug: "hl-market-intervention",
    free: true,
    course: mockCourses[2],
    chapter: mockChapters[8],
    type: "text",
    content: `## Intervention and welfare

HL Economics asks students to analyze how taxes, subsidies, and price controls affect market outcomes and stakeholder welfare.

## Evaluation move

Strong answers explain both the diagram result and the policy tradeoff, including who gains, who loses, and why implementation matters.`,
    readingTimeSeconds: 300,
    updatedAt: now,
    createdAt: now,
    _status: "published",
  },
  {
    id: "lesson-hl-elasticity-evaluation",
    title: "Elasticity and Evaluation",
    slug: "elasticity-and-evaluation",
    free: true,
    course: mockCourses[2],
    chapter: mockChapters[8],
    type: "text",
    content: `## Elasticity in context

Elasticity measures responsiveness. HL questions often use elasticity to judge how strongly consumers, producers, or governments respond to a change.

## Evaluation move

Use elasticity to qualify the size of an effect instead of only naming the direction of the change.`,
    readingTimeSeconds: 300,
    updatedAt: now,
    createdAt: now,
    _status: "published",
  },
  {
    id: "lesson-hl-exchange-rates",
    title: "Exchange Rates",
    slug: "exchange-rates",
    free: true,
    course: mockCourses[2],
    chapter: mockChapters[9],
    type: "text",
    content: `## Currency markets

Exchange rates are determined by demand and supply for currencies. Changes in trade, investment, interest rates, and confidence can shift the market.

## Evaluation move

Explain how a currency change affects exporters, importers, consumers, and inflation pressure.`,
    readingTimeSeconds: 300,
    updatedAt: now,
    createdAt: now,
    _status: "published",
  },
  {
    id: "lesson-hl-development-strategies",
    title: "Development Strategies",
    slug: "development-strategies",
    free: true,
    course: mockCourses[2],
    chapter: mockChapters[9],
    type: "text",
    content: `## Development choices

Development policy can focus on education, infrastructure, trade, institutional reform, or targeted support for vulnerable groups.

## Evaluation move

Compare short-run constraints with long-run gains, and connect the policy to a clear development objective.`,
    readingTimeSeconds: 300,
    updatedAt: now,
    createdAt: now,
    _status: "published",
  },
  {
    id: "lesson-sl-scarcity",
    title: "Scarcity and Choice",
    slug: "sl-scarcity-and-choice",
    free: true,
    course: mockCourses[3],
    chapter: mockChapters[10],
    type: "text",
    content: `## Core idea

Scarcity means societies must choose how to allocate limited resources among competing wants.

## Exam focus

Explain the tradeoff clearly and identify the opportunity cost of the choice.`,
    readingTimeSeconds: 300,
    updatedAt: now,
    createdAt: now,
    _status: "published",
  },
  {
    id: "lesson-sl-economic-systems",
    title: "Economic Systems",
    slug: "economic-systems",
    free: true,
    course: mockCourses[3],
    chapter: mockChapters[10],
    type: "text",
    content: `## Allocation systems

Economic systems answer what to produce, how to produce, and for whom to produce. Markets, governments, and mixed systems answer these questions differently.

## Exam focus

Use examples to compare incentives, efficiency, equity, and government intervention.`,
    readingTimeSeconds: 300,
    updatedAt: now,
    createdAt: now,
    _status: "published",
  },
  {
    id: "lesson-sl-demand-supply",
    title: "Demand and Supply",
    slug: "sl-demand-and-supply",
    free: true,
    course: mockCourses[3],
    chapter: mockChapters[11],
    type: "text",
    content: `## Market basics

Demand shows how much consumers are willing and able to buy. Supply shows how much producers are willing and able to sell.

## Exam focus

Separate movement along a curve from a shift of the whole curve.`,
    readingTimeSeconds: 300,
    updatedAt: now,
    createdAt: now,
    _status: "published",
  },
  {
    id: "lesson-sl-market-equilibrium",
    title: "Market Equilibrium",
    slug: "market-equilibrium",
    free: true,
    course: mockCourses[3],
    chapter: mockChapters[11],
    type: "text",
    content: `## Equilibrium

Market equilibrium occurs where quantity demanded equals quantity supplied. Shortages push prices up, while surpluses push prices down.

## Exam focus

Show the shift, identify the new equilibrium, and explain the pressure on price and quantity.`,
    readingTimeSeconds: 300,
    updatedAt: now,
    createdAt: now,
    _status: "published",
  },
];

function makeApMicroTopicLesson({
  id,
  title,
  slug,
  chapter,
  content,
}: {
  id: string;
  title: string;
  slug: string;
  chapter: Chapter;
  content: string;
}): Lesson {
  return {
    id,
    title,
    slug,
    free: true,
    course: mockCourses[0],
    chapter,
    type: "text",
    content: `## ${title}

${content}

## AP Micro focus

Be ready to connect the concept to scarcity, incentives, efficiency, and clearly labeled economics diagrams when relevant.`,
    readingTimeSeconds: 360,
    updatedAt: now,
    createdAt: now,
    _status: "published",
  };
}

export function getMockCourse(courseSlug: string) {
  return mockCourses.find((course) => course.slug === courseSlug) ?? null;
}

export function getMockCourseLessons(courseSlug: string) {
  return mockLessons.filter(
    (lesson) =>
      typeof lesson.course !== "string" && lesson.course.slug === courseSlug,
  );
}

export function getMockCourseChapters(courseSlug: string) {
  return mockChapters.filter(
    (chapter) =>
      typeof chapter.course !== "string" && chapter.course.slug === courseSlug,
  );
}

export function getMockLesson(courseSlug: string, lessonSlug: string) {
  return (
    getMockCourseLessons(courseSlug).find(
      (lesson) => lesson.slug === lessonSlug,
    ) ?? null
  );
}
