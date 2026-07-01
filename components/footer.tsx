import Link from "next/link";

const footerColumns = [
  {
    heading: "Company",
    links: [
      { label: "About Us", href: "/#about" },
      { label: "Resources", href: "/#resources" },
      { label: "Contact", href: "/#contact" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Guided Lessons", href: "/#resources" },
      { label: "Interactive Graphs", href: "/#resources" },
      { label: "Review Practice", href: "/#resources" },
    ],
  },
  {
    heading: "For Learners",
    links: [
      { label: "AP Microeconomics", href: "/course/ap-microeconomics" },
      { label: "AP Macroeconomics", href: "/course/ap-macroeconomics" },
      { label: "HL Economics", href: "/course/hl-economics" },
      { label: "SL Economics", href: "/course/sl-economics" },
    ],
  },
  {
    heading: "Connect",
    links: [
      { label: "Email", href: "mailto:contact@openeconomics.org" },
      { label: "Learning Support", href: "/#contact" },
    ],
  },
] as const;

export default async function Footer() {
  return (
    <footer className="w-full bg-[#0b1f3a] text-white">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 border-b border-white/10 pb-10 md:grid-cols-4">
          {footerColumns.map((column) => (
            <div key={column.heading}>
              <p className="text-sm font-semibold text-white/45">
                {column.heading}
              </p>
              <nav className="mt-4 flex flex-col gap-3">
                {column.links.map((link) => (
                  <Link
                    key={link.href + link.label}
                    href={link.href}
                    className="w-fit text-base font-semibold text-white/85 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </div>

        <div className="py-10 text-center">
          <Link
            href="/"
            className="text-5xl font-black tracking-tight text-white sm:text-7xl"
          >
            Open<span className="font-light">Economics</span>
          </Link>
        </div>

        <div className="border-t border-white/10 pt-6 text-center text-xs text-white/55">
          <p>&copy; {new Date().getFullYear()} Open Economics. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
