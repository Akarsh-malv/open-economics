export function CourseArt({ type }: { type: string }) {
  return (
    <svg
      viewBox="0 0 240 130"
      fill="none"
      aria-hidden="true"
      className="practice-course-art"
    >
      <path d="M25 108H215M45 20V108" stroke="currentColor" opacity=".14" />
      {[55, 80].map((y) => (
        <path key={y} d={`M45 ${y}H215`} stroke="currentColor" opacity=".07" />
      ))}
      {type === "macro" && (
        <>
          <path
            d="M65 103V79H89V103M106 103V59H130V103M147 103V36H171V103"
            fill="currentColor"
            opacity=".12"
          />
          <path
            d="M59 73L106 52L142 59L191 22M171 23L192 21L190 42"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="106" cy="52" r="4" fill="currentColor" />
        </>
      )}
      {type === "micro" && (
        <>
          <path
            d="M62 27C110 35 149 61 197 101M62 101C100 65 151 40 197 27"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            d="M128 63V108M45 63H128"
            stroke="currentColor"
            strokeDasharray="4 5"
            opacity=".35"
          />
          <circle cx="128" cy="63" r="6" fill="currentColor" />
        </>
      )}
      {type === "alevel" && (
        <>
          <path
            d="M68 35Q92 26 120 39Q148 26 174 35V97Q148 88 120 102Q92 88 68 97Z"
            fill="currentColor"
            opacity=".1"
          />
          <path
            d="M68 35Q92 26 120 39Q148 26 174 35V97Q148 88 120 102Q92 88 68 97ZM120 39V102M79 50L106 53M79 63L106 66M135 53L160 49M135 66L160 62"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        </>
      )}
      {type === "ib" && (
        <>
          <circle
            cx="122"
            cy="64"
            r="43"
            stroke="currentColor"
            strokeWidth="2.5"
          />
          <ellipse
            cx="122"
            cy="64"
            rx="20"
            ry="43"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M80 64H165M87 42H157M87 86H157"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle cx="159" cy="40" r="7" fill="currentColor" />
        </>
      )}
    </svg>
  );
}
