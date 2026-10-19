# Open Economics color inventory

Extracted from local website source. Includes light/dark theme tokens, CSS and SVG literals, and referenced Tailwind palette colors. Does not enumerate raster-image pixels or every color produced by gradients, blending, animation, and opacity. OKLCH values are converted to nearest clipped 8-bit sRGB hex. Eight-digit hex is #RRGGBBAA; the final two digits are opacity. Tailwind utility entries are palette references found in source, not proof each one renders on every page.

## Theme tokens in source order

The second set of repeated tokens is the dark theme.

| Token | Hex | globals.css line |
|---|---|---|
| `--background` | `#FFFFFF` | 77 |
| `--foreground` | `#0A0A0A` | 78 |
| `--success-background` | `#F2FBF8` | 80 |
| `--success-foreground` | `#007A55` | 81 |
| `--info-background` | `#F4F8FF` | 83 |
| `--info-foreground` | `#1447E6` | 84 |
| `--warning-background` | `#FFF7F2` | 86 |
| `--warning-foreground` | `#BB4D01` | 87 |
| `--error-background` | `#FFF4F5` | 89 |
| `--error-foreground` | `#C10006` | 90 |
| `--card` | `#F7F9FA` | 92 |
| `--card-foreground` | `#0A0A0A` | 93 |
| `--popover` | `#FFFFFF` | 94 |
| `--popover-foreground` | `#0A0A0A` | 95 |
| `--primary` | `#0B1F3A` | 97 |
| `--primary-foreground` | `#FFFFFF` | 98 |
| `--secondary` | `#F5F5F5` | 99 |
| `--secondary-foreground` | `#171717` | 100 |
| `--muted` | `#F5F5F5` | 101 |
| `--muted-foreground` | `#737373` | 102 |
| `--accent` | `#F5F5F5` | 103 |
| `--accent-foreground` | `#171717` | 104 |
| `--destructive` | `#E7000B` | 105 |
| `--border` | `#E4E4E4` | 106 |
| `--input` | `#E4E4E4` | 107 |
| `--ring` | `#A1A1A1` | 108 |
| `--scrollbar-thumb` | `#0000004C` | 109 |
| `--scrollbar-thumb-hover` | `#00000080` | 110 |
| `--oe-background` | `#F5F7FA` | 112 |
| `--oe-surface` | `#FFFFFF` | 113 |
| `--oe-surface-elevated` | `#EEF2F6` | 114 |
| `--oe-border` | `#0B1F3A24` | 115 |
| `--oe-text` | `#0B1F3A` | 116 |
| `--oe-text-muted` | `#5D6978` | 117 |
| `--oe-accent` | `#0B1F3A` | 118 |
| `--oe-accent-secondary` | `#12345C` | 119 |
| `--oe-success` | `#3F7D5A` | 120 |
| `--oe-warning` | `#64748B` | 121 |
| `--oe-error` | `#A34D45` | 122 |
| `--background` | `#0A0A0A` | 126 |
| `--foreground` | `#FAFAFA` | 127 |
| `--success-background` | `#09120F` | 129 |
| `--success-foreground` | `#00BC7D` | 130 |
| `--info-background` | `#0B0F16` | 132 |
| `--info-foreground` | `#2B7FFF` | 133 |
| `--warning-background` | `#160E09` | 135 |
| `--warning-foreground` | `#FE9A00` | 136 |
| `--error-background` | `#160B0C` | 138 |
| `--error-foreground` | `#FF6467` | 139 |
| `--card` | `#171717` | 141 |
| `--card-foreground` | `#FAFAFA` | 142 |
| `--popover` | `#171717` | 143 |
| `--popover-foreground` | `#FAFAFA` | 144 |
| `--secondary` | `#262626` | 145 |
| `--secondary-foreground` | `#FAFAFA` | 146 |
| `--muted` | `#262626` | 147 |
| `--muted-foreground` | `#A1A1A1` | 148 |
| `--accent` | `#262626` | 149 |
| `--accent-foreground` | `#FAFAFA` | 150 |
| `--destructive` | `#FF4144` | 151 |
| `--border` | `#FFFFFF1A` | 152 |
| `--input` | `#FFFFFF26` | 153 |
| `--ring` | `#737373` | 154 |
| `--scrollbar-thumb` | `#FFFFFF33` | 155 |
| `--scrollbar-thumb-hover` | `#FFFFFF66` | 156 |
| `--oe-background` | `#F5F7FA` | 158 |
| `--oe-surface` | `#FFFFFF` | 159 |
| `--oe-surface-elevated` | `#EEF2F6` | 160 |
| `--oe-border` | `#0B1F3A24` | 161 |
| `--oe-text` | `#0B1F3A` | 162 |
| `--oe-text-muted` | `#5D6978` | 163 |
| `--oe-accent` | `#0B1F3A` | 164 |
| `--oe-accent-secondary` | `#12345C` | 165 |
| `--oe-success` | `#7CB08D` | 166 |
| `--oe-warning` | `#94A3B8` | 167 |
| `--oe-error` | `#D07F73` | 168 |
| `--btn-highlight` | `#FFFFFF38` | 232 |

## Referenced Tailwind colors

| Palette name | Hex |
|---|---|
| black | `#000000` |
| blue-100 | `#DBEAFE` |
| blue-200 | `#BEDBFF` |
| blue-300 | `#8EC5FF` |
| blue-400 | `#51A2FF` |
| blue-50 | `#EFF6FF` |
| blue-500 | `#2B7FFF` |
| gray-200 | `#E5E7EB` |
| gray-50 | `#F9FAFB` |
| gray-500 | `#6A7282` |
| gray-600 | `#4A5565` |
| gray-900 | `#101828` |
| neutral-100 | `#F5F5F5` |
| neutral-200 | `#E5E5E5` |
| neutral-300 | `#D4D4D4` |
| neutral-400 | `#A1A1A1` |
| neutral-50 | `#FAFAFA` |
| neutral-500 | `#737373` |
| neutral-600 | `#525252` |
| neutral-800 | `#262626` |
| neutral-900 | `#171717` |
| neutral-950 | `#0A0A0A` |
| slate-100 | `#F1F5F9` |
| slate-200 | `#E2E8F0` |
| slate-300 | `#CAD5E2` |
| slate-400 | `#90A1B9` |
| slate-50 | `#F8FAFC` |
| slate-500 | `#62748E` |
| slate-600 | `#45556C` |
| slate-700 | `#314158` |
| slate-800 | `#1D293D` |
| slate-900 | `#0F172B` |
| slate-950 | `#020618` |
| white | `#FFFFFF` |

## All literal color occurrences

| Hex | Original CSS | Source | Line |
|---|---|---|---|
| `#0000000F` | `rgba(0,0,0,0.06)` | app/(app)/(landing)/_components/grid-background.tsx | 11 |
| `#0000000F` | `rgba(0,0,0,0.06)` | app/(app)/(landing)/_components/grid-background.tsx | 11 |
| `#FFFFFF08` | `rgba(255,255,255,0.03)` | app/(app)/(landing)/_components/grid-background.tsx | 13 |
| `#FFFFFF08` | `rgba(255,255,255,0.03)` | app/(app)/(landing)/_components/grid-background.tsx | 13 |
| `#0B1F3A` | `#0b1f3a` | app/(app)/(landing)/account/page.tsx | 78 |
| `#F4F6F8` | `#f4f6f8` | app/(app)/(landing)/courses/page.tsx | 65 |
| `#071A33` | `#071a33` | app/(app)/(landing)/courses/page.tsx | 65 |
| `#071A33` | `#071a33` | app/(app)/(landing)/courses/page.tsx | 68 |
| `#536987` | `#536987` | app/(app)/(landing)/courses/page.tsx | 71 |
| `#0F172A0E` | `rgba(15,23,42,0.055)` | app/(app)/(landing)/courses/page.tsx | 95 |
| `#0F172A1A` | `rgba(15,23,42,0.1)` | app/(app)/(landing)/courses/page.tsx | 95 |
| `#1D5CAB` | `#1d5cab` | app/(app)/(landing)/courses/page.tsx | 95 |
| `#EDF4FF` | `#edf4ff` | app/(app)/(landing)/courses/page.tsx | 101 |
| `#1D5CAB` | `#1d5cab` | app/(app)/(landing)/courses/page.tsx | 101 |
| `#071A33` | `#071a33` | app/(app)/(landing)/courses/page.tsx | 104 |
| `#536987` | `#536987` | app/(app)/(landing)/courses/page.tsx | 107 |
| `#0B1F3A` | `#0b1f3a` | app/(app)/(landing)/courses/page.tsx | 123 |
| `#0B1F3A33` | `rgba(11,31,58,0.2)` | app/(app)/(landing)/courses/page.tsx | 123 |
| `#12345C` | `#12345c` | app/(app)/(landing)/courses/page.tsx | 123 |
| `#0F172A09` | `rgba(15,23,42,0.035)` | app/(app)/(landing)/courses/page.tsx | 143 |
| `#EDF4FA` | `#edf4fa` | app/(app)/(landing)/courses/page.tsx | 144 |
| `#0B1F3A` | `#0b1f3a` | app/(app)/(landing)/courses/page.tsx | 144 |
| `#071A33` | `#071a33` | app/(app)/(landing)/courses/page.tsx | 148 |
| `#536987` | `#536987` | app/(app)/(landing)/courses/page.tsx | 151 |
| `#EEF2F6` | `#eef2f6` | app/(app)/(landing)/courses/page.tsx | 165 |
| `#EDF2F7` | `#edf2f7` | app/(app)/(landing)/courses/page.tsx | 172 |
| `#0B1F3A` | `#0b1f3a` | app/(app)/(landing)/courses/page.tsx | 185 |
| `#0B1F3A` | `#0b1f3a` | app/(app)/(landing)/courses/page.tsx | 186 |
| `#7F94B2` | `#7f94b2` | app/(app)/(landing)/courses/page.tsx | 187 |
| `#0B1F3A` | `#0b1f3a` | app/(app)/(landing)/courses/page.tsx | 188 |
| `#D6A23B` | `#d6a23b` | app/(app)/(landing)/courses/page.tsx | 189 |
| `#D6A23B` | `#d6a23b` | app/(app)/(landing)/courses/page.tsx | 190 |
| `#CFD9E7` | `#cfd9e7` | app/(app)/(landing)/courses/page.tsx | 198 |
| `#F8FAFC` | `#f8fafc` | app/(app)/(landing)/courses/page.tsx | 202 |
| `#94A3B8` | `#94a3b8` | app/(app)/(landing)/courses/page.tsx | 206 |
| `#64748B` | `#64748b` | app/(app)/(landing)/courses/page.tsx | 207 |
| `#475569` | `#475569` | app/(app)/(landing)/courses/page.tsx | 208 |
| `#CBD5E1` | `#cbd5e1` | app/(app)/(landing)/courses/page.tsx | 209 |
| `#FFFFFF` | `#ffffff` | app/(app)/(landing)/courses/page.tsx | 219 |
| `#0B1F3A` | `#0b1f3a` | app/(app)/(landing)/courses/page.tsx | 220 |
| `#FFFFFF` | `#ffffff` | app/(app)/(landing)/courses/page.tsx | 226 |
| `#0B1F3A` | `#0b1f3a` | app/(app)/(landing)/courses/page.tsx | 227 |
| `#94A3B8` | `#94a3b8` | app/(app)/(landing)/courses/page.tsx | 231 |
| `#D6A23B` | `#d6a23b` | app/(app)/(landing)/courses/page.tsx | 232 |
| `#64748B` | `#64748b` | app/(app)/(landing)/courses/page.tsx | 233 |
| `#0B1F3A` | `#0b1f3a` | app/(app)/(landing)/courses/page.tsx | 241 |
| `#94A3B8` | `#94a3b8` | app/(app)/(landing)/courses/page.tsx | 242 |
| `#64748B` | `#64748b` | app/(app)/(landing)/courses/page.tsx | 243 |
| `#475569` | `#475569` | app/(app)/(landing)/courses/page.tsx | 244 |
| `#0B1F3A` | `#0b1f3a` | app/(app)/(landing)/courses/page.tsx | 248 |
| `#0B1F3A` | `#0b1f3a` | app/(app)/(landing)/courses/page.tsx | 252 |
| `#071A33` | `#071a33` | app/(app)/(landing)/courses/page.tsx | 254 |
| `#64748B` | `#64748b` | app/(app)/(landing)/courses/page.tsx | 260 |
| `#64748B` | `#64748b` | app/(app)/(landing)/courses/page.tsx | 261 |
| `#64748B` | `#64748b` | app/(app)/(landing)/courses/page.tsx | 262 |
| `#64748B` | `#64748b` | app/(app)/(landing)/courses/page.tsx | 263 |
| `#FFFFFF` | `#ffffff` | app/(app)/(landing)/og-image/route.tsx | 27 |
| `#061225` | `#061225` | app/(app)/(landing)/page.tsx | 111 |
| `#06122538` | `rgba(6,18,37,0.22)` | app/(app)/(landing)/page.tsx | 111 |
| `#3B82F62E` | `rgba(59,130,246,0.18)` | app/(app)/(landing)/page.tsx | 112 |
| `#60A5FA1A` | `rgba(96,165,250,0.1)` | app/(app)/(landing)/page.tsx | 112 |
| `#FFFFFFB2` | `rgba(255,255,255,0.7)` | app/(app)/(landing)/page.tsx | 113 |
| `#061225` | `#061225` | app/(app)/(landing)/page.tsx | 114 |
| `#2563EB47` | `rgba(37,99,235,0.28)` | app/(app)/(landing)/page.tsx | 133 |
| `#60A5FA14` | `rgba(96,165,250,0.08)` | app/(app)/(landing)/page.tsx | 162 |
| `#2563EB2E` | `rgba(37,99,235,0.18)` | app/(app)/(landing)/page.tsx | 186 |
| `#1E3A5F` | `#1e3a5f` | app/(app)/(landing)/page.tsx | 190 |
| `#1E3A5F` | `#1e3a5f` | app/(app)/(landing)/page.tsx | 191 |
| `#1D3555` | `#1d3555` | app/(app)/(landing)/page.tsx | 193 |
| `#6F8AAA` | `#6f8aaa` | app/(app)/(landing)/page.tsx | 194 |
| `#47607F` | `#47607f` | app/(app)/(landing)/page.tsx | 195 |
| `#9EB0C6` | `#9eb0c6` | app/(app)/(landing)/page.tsx | 196 |
| `#64748B` | `#64748b` | app/(app)/(landing)/page.tsx | 198 |
| `#40546F` | `#40546f` | app/(app)/(landing)/page.tsx | 199 |
| `#93A8C2` | `#93a8c2` | app/(app)/(landing)/page.tsx | 200 |
| `#3B4E68` | `#3b4e68` | app/(app)/(landing)/page.tsx | 202 |
| `#263954` | `#263954` | app/(app)/(landing)/page.tsx | 203 |
| `#64748B` | `#64748b` | app/(app)/(landing)/page.tsx | 204 |
| `#1D5CAB` | `#1d5cab` | app/(app)/(landing)/page.tsx | 206 |
| `#0F3567` | `#0f3567` | app/(app)/(landing)/page.tsx | 207 |
| `#6F8AAA` | `#6f8aaa` | app/(app)/(landing)/page.tsx | 208 |
| `#93C5FD` | `#93c5fd` | app/(app)/(landing)/page.tsx | 213 |
| `#BFDBFE` | `#bfdbfe` | app/(app)/(landing)/page.tsx | 221 |
| `#BFDBFE` | `#bfdbfe` | app/(app)/(landing)/page.tsx | 225 |
| `#60A5FA` | `#60a5fa` | app/(app)/(landing)/page.tsx | 226 |
| `#1D4D86` | `#1d4d86` | app/(app)/(landing)/page.tsx | 228 |
| `#2F6EA9` | `#2f6ea9` | app/(app)/(landing)/page.tsx | 231 |
| `#7FB3DC` | `#7fb3dc` | app/(app)/(landing)/page.tsx | 235 |
| `#A7C7E6` | `#a7c7e6` | app/(app)/(landing)/page.tsx | 239 |
| `#9FB9D6` | `#9fb9d6` | app/(app)/(landing)/page.tsx | 243 |
| `#64748B` | `#64748b` | app/(app)/(landing)/page.tsx | 247 |
| `#8FB2D3` | `#8fb2d3` | app/(app)/(landing)/page.tsx | 251 |
| `#64748B` | `#64748b` | app/(app)/(landing)/page.tsx | 255 |
| `#DBEAFE` | `#dbeafe` | app/(app)/(landing)/page.tsx | 260 |
| `#DBEAFE` | `#dbeafe` | app/(app)/(landing)/page.tsx | 268 |
| `#93C5FD` | `#93c5fd` | app/(app)/(landing)/page.tsx | 273 |
| `#0F172A14` | `rgba(15,23,42,0.08)` | app/(app)/(landing)/page.tsx | 292 |
| `#0F172A14` | `rgba(15,23,42,0.08)` | app/(app)/(landing)/page.tsx | 310 |
| `#0B1F3A` | `#0b1f3a` | app/(app)/(landing)/page.tsx | 340 |
| `#0B1F3A` | `#0b1f3a` | app/(app)/(landing)/page.tsx | 347 |
| `#0B1F3A2E` | `rgba(11,31,58,0.18)` | app/(app)/(landing)/page.tsx | 347 |
| `#0F172A0A` | `rgba(15,23,42,0.04)` | app/(app)/(landing)/page.tsx | 348 |
| `#0F172A0A` | `rgba(15,23,42,0.04)` | app/(app)/(landing)/page.tsx | 391 |
| `#0B1F3A` | `#0b1f3a` | app/(app)/(landing)/page.tsx | 393 |
| `#0B1F3A` | `#0b1f3a` | app/(app)/(landing)/page.tsx | 409 |
| `#0B1F3A2E` | `rgba(11,31,58,0.18)` | app/(app)/(landing)/page.tsx | 409 |
| `#12345C` | `#12345c` | app/(app)/(landing)/page.tsx | 409 |
| `#0B1F3A` | `#0b1f3a` | app/(app)/(landing)/page.tsx | 427 |
| `#0F172A1F` | `rgba(15,23,42,0.12)` | app/(app)/(landing)/page.tsx | 427 |
| `#FFFFFF0A` | `rgba(255,255,255,0.04)` | app/(app)/(landing)/page.tsx | 429 |
| `#FFFFFF0A` | `rgba(255,255,255,0.04)` | app/(app)/(landing)/page.tsx | 429 |
| `#0B1F3A` | `#0b1f3a` | app/(app)/(landing)/page.tsx | 442 |
| `#0B1F3A` | `#0b1f3a` | app/(app)/(landing)/page.tsx | 471 |
| `#142B43` | `#142b43` | app/(app)/(landing)/practice/practice.css | 2 |
| `#607185` | `#607185` | app/(app)/(landing)/practice/practice.css | 3 |
| `#E0E6EB` | `#e0e6eb` | app/(app)/(landing)/practice/practice.css | 4 |
| `#2866A7` | `#2866a7` | app/(app)/(landing)/practice/practice.css | 5 |
| `#287669` | `#287669` | app/(app)/(landing)/practice/practice.css | 6 |
| `#F5F7F9` | `#f5f7f9` | app/(app)/(landing)/practice/practice.css | 8 |
| `#3883C7` | `#3883c7` | app/(app)/(landing)/practice/practice.css | 28 |
| `#607588` | `#607588` | app/(app)/(landing)/practice/practice.css | 43 |
| `#419889` | `#419889` | app/(app)/(landing)/practice/practice.css | 52 |
| `#64838B` | `#64838b` | app/(app)/(landing)/practice/practice.css | 70 |
| `#D6DEE5` | `#d6dee5` | app/(app)/(landing)/practice/practice.css | 83 |
| `#578077` | `#578077` | app/(app)/(landing)/practice/practice.css | 85 |
| `#FFFFFF` | `#fff` | app/(app)/(landing)/practice/practice.css | 126 |
| `#A7BCCD` | `#a7bccd` | app/(app)/(landing)/practice/practice.css | 140 |
| `#1634510A` | `#1634510a` | app/(app)/(landing)/practice/practice.css | 141 |
| `#396D9B` | `#396d9b` | app/(app)/(landing)/practice/practice.css | 144 |
| `#EDF3F8` | `#edf3f8` | app/(app)/(landing)/practice/practice.css | 145 |
| `#52867B` | `#52867b` | app/(app)/(landing)/practice/practice.css | 148 |
| `#EDF5F1` | `#edf5f1` | app/(app)/(landing)/practice/practice.css | 149 |
| `#9A7953` | `#9a7953` | app/(app)/(landing)/practice/practice.css | 152 |
| `#F8F3EB` | `#f8f3eb` | app/(app)/(landing)/practice/practice.css | 153 |
| `#89739F` | `#89739f` | app/(app)/(landing)/practice/practice.css | 156 |
| `#F4F0F8` | `#f4f0f8` | app/(app)/(landing)/practice/practice.css | 157 |
| `#D6E2E7` | `#d6e2e7` | app/(app)/(landing)/practice/practice.css | 214 |
| `#EDF3F5` | `#edf3f5` | app/(app)/(landing)/practice/practice.css | 216 |
| `#FFFFFF` | `#fff` | app/(app)/(landing)/practice/practice.css | 226 |
| `#DAE4E8` | `#dae4e8` | app/(app)/(landing)/practice/practice.css | 227 |
| `#3C6978` | `#3c6978` | app/(app)/(landing)/practice/practice.css | 228 |
| `#FFFFFF` | `#fff` | app/(app)/(landing)/practice/practice.css | 259 |
| `#183952` | `#183952` | app/(app)/(landing)/practice/practice.css | 260 |
| `#183952` | `#183952` | app/(app)/(landing)/practice/practice.css | 261 |
| `#285470` | `#285470` | app/(app)/(landing)/practice/practice.css | 264 |
| `#FFFFFF` | `#fff` | app/(app)/(landing)/practice/practice.css | 267 |
| `#F0F4F7` | `#f0f4f7` | app/(app)/(landing)/practice/practice.css | 272 |
| `#699489` | `#699489` | app/(app)/(landing)/practice/practice.css | 293 |
| `#6A7A8C` | `#6a7a8c` | app/(app)/(landing)/practice/practice.css | 299 |
| `#314960` | `#314960` | app/(app)/(landing)/practice/practice.css | 308 |
| `#205B81` | `#205b81` | app/(app)/(landing)/practice/practice.css | 343 |
| `#205B81` | `#205b81` | app/(app)/(landing)/practice/practice.css | 344 |
| `#688192` | `#688192` | app/(app)/(landing)/practice/practice.css | 348 |
| `#EAF0F4` | `#eaf0f4` | app/(app)/(landing)/practice/practice.css | 349 |
| `#98B4C8` | `#98b4c8` | app/(app)/(landing)/practice/practice.css | 365 |
| `#EDF3F8` | `#edf3f8` | app/(app)/(landing)/practice/practice.css | 372 |
| `#4A7191` | `#4a7191` | app/(app)/(landing)/practice/practice.css | 376 |
| `#EEF4EF` | `#eef4ef` | app/(app)/(landing)/practice/practice.css | 391 |
| `#568675` | `#568675` | app/(app)/(landing)/practice/practice.css | 392 |
| `#FFFFFF` | `#fff` | app/(app)/(landing)/practice/practice.css | 434 |
| `#CDDBE5` | `#cddbe5` | app/(app)/(landing)/practice/practice.css | 435 |
| `#64879C` | `#64879c` | app/(app)/(landing)/practice/practice.css | 442 |
| `#B2BFCA` | `#b2bfca` | app/(app)/(landing)/practice/practice.css | 474 |
| `#E7ECF1` | `#e7ecf1` | app/(app)/(landing)/practice/practice.css | 498 |
| `#64778A` | `#64778a` | app/(app)/(landing)/practice/practice.css | 499 |
| `#DCE4EB` | `#dce4eb` | app/(app)/(landing)/practice/practice.css | 500 |
| `#EAF2ED` | `#eaf2ed` | app/(app)/(landing)/practice/practice.css | 512 |
| `#D5E5DB` | `#d5e5db` | app/(app)/(landing)/practice/practice.css | 513 |
| `#457362` | `#457362` | app/(app)/(landing)/practice/practice.css | 514 |
| `#29475F` | `#29475f` | app/(app)/(landing)/practice/practice.css | 553 |
| `#DCE4EB` | `#dce4eb` | app/(app)/(landing)/practice/practice.css | 554 |
| `#142B4304` | `#142b4304` | app/(app)/(landing)/practice/practice.css | 555 |
| `#6C7D8C` | `#6c7d8c` | app/(app)/(landing)/practice/practice.css | 559 |
| `#E9EEF2` | `#e9eef2` | app/(app)/(landing)/practice/practice.css | 560 |
| `#6C7E8B` | `#6c7e8b` | app/(app)/(landing)/practice/practice.css | 568 |
| `#628477` | `#628477` | app/(app)/(landing)/practice/practice.css | 594 |
| `#DFE7E8` | `#dfe7e8` | app/(app)/(landing)/practice/practice.css | 598 |
| `#418A78` | `#418a78` | app/(app)/(landing)/practice/practice.css | 606 |
| `#6B9E85` | `#6b9e85` | app/(app)/(landing)/practice/practice.css | 643 |
| `#C89771` | `#c89771` | app/(app)/(landing)/practice/practice.css | 646 |
| `#6B7D8E` | `#6b7d8e` | app/(app)/(landing)/practice/practice.css | 654 |
| `#CBD6DD` | `#cbd6dd` | app/(app)/(landing)/practice/practice.css | 672 |
| `#DCE3E8` | `#dce3e8` | app/(app)/(landing)/practice/practice.css | 677 |
| `#FFFFFF` | `#fff` | app/(app)/(landing)/practice/practice.css | 678 |
| `#62748A` | `#62748a` | app/(app)/(landing)/practice/practice.css | 681 |
| `#7D9BB3` | `#7d9bb3` | app/(app)/(landing)/practice/practice.css | 686 |
| `#E9F3ED` | `#e9f3ed` | app/(app)/(landing)/practice/practice.css | 689 |
| `#37755A` | `#37755a` | app/(app)/(landing)/practice/practice.css | 690 |
| `#C5DFCF` | `#c5dfcf` | app/(app)/(landing)/practice/practice.css | 691 |
| `#FAF0E9` | `#faf0e9` | app/(app)/(landing)/practice/practice.css | 694 |
| `#9B6845` | `#9b6845` | app/(app)/(landing)/practice/practice.css | 695 |
| `#EDD6C5` | `#edd6c5` | app/(app)/(landing)/practice/practice.css | 696 |
| `#214964` | `#214964` | app/(app)/(landing)/practice/practice.css | 699 |
| `#214964` | `#214964` | app/(app)/(landing)/practice/practice.css | 701 |
| `#F5F7F9` | `#f5f7f9` | app/(app)/(landing)/practice/practice.css | 703 |
| `#9BB2C2` | `#9bb2c2` | app/(app)/(landing)/practice/practice.css | 704 |
| `#B9924E` | `#b9924e` | app/(app)/(landing)/practice/practice.css | 713 |
| `#6D7C8D` | `#6d7c8d` | app/(app)/(landing)/practice/practice.css | 719 |
| `#C1CDD7` | `#c1cdd7` | app/(app)/(landing)/practice/practice.css | 730 |
| `#FFFFFF` | `#fff` | app/(app)/(landing)/practice/practice.css | 732 |
| `#B9924E` | `#b9924e` | app/(app)/(landing)/practice/practice.css | 735 |
| `#B9924E` | `#b9924e` | app/(app)/(landing)/practice/practice.css | 736 |
| `#728290` | `#728290` | app/(app)/(landing)/practice/practice.css | 751 |
| `#FFFFFF` | `#fff` | app/(app)/(landing)/practice/practice.css | 764 |
| `#DFE6EC` | `#dfe6ec` | app/(app)/(landing)/practice/practice.css | 765 |
| `#152D4203` | `#152d4203` | app/(app)/(landing)/practice/practice.css | 768 |
| `#4C6479` | `#4c6479` | app/(app)/(landing)/practice/practice.css | 786 |
| `#91A0AD` | `#91a0ad` | app/(app)/(landing)/practice/practice.css | 790 |
| `#EEF5EF` | `#eef5ef` | app/(app)/(landing)/practice/practice.css | 801 |
| `#527B62` | `#527b62` | app/(app)/(landing)/practice/practice.css | 802 |
| `#F8F2E7` | `#f8f2e7` | app/(app)/(landing)/practice/practice.css | 811 |
| `#9B793E` | `#9b793e` | app/(app)/(landing)/practice/practice.css | 812 |
| `#F5ECF0` | `#f5ecf0` | app/(app)/(landing)/practice/practice.css | 815 |
| `#A05E7B` | `#a05e7b` | app/(app)/(landing)/practice/practice.css | 816 |
| `#768695` | `#768695` | app/(app)/(landing)/practice/practice.css | 822 |
| `#A07A35` | `#a07a35` | app/(app)/(landing)/practice/practice.css | 828 |
| `#F5F7F9` | `#f5f7f9` | app/(app)/(landing)/practice/practice.css | 831 |
| `#82909C` | `#82909c` | app/(app)/(landing)/practice/practice.css | 851 |
| `#E0E6EB` | `#e0e6eb` | app/(app)/(landing)/practice/practice.css | 863 |
| `#B4C6D4` | `#b4c6d4` | app/(app)/(landing)/practice/practice.css | 872 |
| `#FBFCFD` | `#fbfcfd` | app/(app)/(landing)/practice/practice.css | 873 |
| `#6D94B3` | `#6d94b3` | app/(app)/(landing)/practice/practice.css | 876 |
| `#F1F6FB` | `#f1f6fb` | app/(app)/(landing)/practice/practice.css | 877 |
| `#6D94B31A` | `#6d94b31a` | app/(app)/(landing)/practice/practice.css | 878 |
| `#3883C7` | `#3883c7` | app/(app)/(landing)/practice/practice.css | 889 |
| `#F7F9FA` | `#f7f9fa` | app/(app)/(landing)/practice/practice.css | 904 |
| `#E4E9ED` | `#e4e9ed` | app/(app)/(landing)/practice/practice.css | 905 |
| `#7B8A97` | `#7b8a97` | app/(app)/(landing)/practice/practice.css | 909 |
| `#214964` | `#214964` | app/(app)/(landing)/practice/practice.css | 913 |
| `#214964` | `#214964` | app/(app)/(landing)/practice/practice.css | 915 |
| `#40566B` | `#40566b` | app/(app)/(landing)/practice/practice.css | 921 |
| `#9EC8AD` | `#9ec8ad` | app/(app)/(landing)/practice/practice.css | 925 |
| `#F0F8F2` | `#f0f8f2` | app/(app)/(landing)/practice/practice.css | 926 |
| `#4E8D67` | `#4e8d67` | app/(app)/(landing)/practice/practice.css | 930 |
| `#4E8D67` | `#4e8d67` | app/(app)/(landing)/practice/practice.css | 931 |
| `#DBB798` | `#dbb798` | app/(app)/(landing)/practice/practice.css | 935 |
| `#FDF5EF` | `#fdf5ef` | app/(app)/(landing)/practice/practice.css | 936 |
| `#AE7752` | `#ae7752` | app/(app)/(landing)/practice/practice.css | 940 |
| `#AE7752` | `#ae7752` | app/(app)/(landing)/practice/practice.css | 941 |
| `#477559` | `#477559` | app/(app)/(landing)/practice/practice.css | 949 |
| `#A16E49` | `#a16e49` | app/(app)/(landing)/practice/practice.css | 952 |
| `#E9EDF0` | `#e9edf0` | app/(app)/(landing)/practice/practice.css | 961 |
| `#FCFDFD` | `#fcfdfd` | app/(app)/(landing)/practice/practice.css | 962 |
| `#7B8A97` | `#7b8a97` | app/(app)/(landing)/practice/practice.css | 967 |
| `#718394` | `#718394` | app/(app)/(landing)/practice/practice.css | 979 |
| `#557086` | `#557086` | app/(app)/(landing)/practice/practice.css | 989 |
| `#84929D` | `#84929d` | app/(app)/(landing)/practice/practice.css | 997 |
| `#F0F7F3` | `#f0f7f3` | app/(app)/(landing)/practice/practice.css | 1007 |
| `#D4E8DC` | `#d4e8dc` | app/(app)/(landing)/practice/practice.css | 1008 |
| `#FAF6EF` | `#faf6ef` | app/(app)/(landing)/practice/practice.css | 1014 |
| `#EADFCE` | `#eadfce` | app/(app)/(landing)/practice/practice.css | 1015 |
| `#477E5E` | `#477e5e` | app/(app)/(landing)/practice/practice.css | 1021 |
| `#9B7750` | `#9b7750` | app/(app)/(landing)/practice/practice.css | 1024 |
| `#4E665B` | `#4e665b` | app/(app)/(landing)/practice/practice.css | 1038 |
| `#72644F` | `#72644f` | app/(app)/(landing)/practice/practice.css | 1043 |
| `#7A8A81` | `#7a8a81` | app/(app)/(landing)/practice/practice.css | 1047 |
| `#DCE9E0` | `#dce9e0` | app/(app)/(landing)/practice/practice.css | 1048 |
| `#E9DFD1` | `#e9dfd1` | app/(app)/(landing)/practice/practice.css | 1052 |
| `#928271` | `#928271` | app/(app)/(landing)/practice/practice.css | 1053 |
| `#A55445` | `#a55445` | app/(app)/(landing)/practice/practice.css | 1057 |
| `#E2E9EE` | `#e2e9ee` | app/(app)/(landing)/practice/practice.css | 1061 |
| `#F8FAFC` | `#f8fafc` | app/(app)/(landing)/practice/practice.css | 1062 |
| `#6F859A` | `#6f859a` | app/(app)/(landing)/practice/practice.css | 1072 |
| `#8193A1` | `#8193a1` | app/(app)/(landing)/practice/practice.css | 1079 |
| `#748697` | `#748697` | app/(app)/(landing)/practice/practice.css | 1089 |
| `#E2E9EE` | `#e2e9ee` | app/(app)/(landing)/practice/practice.css | 1090 |
| `#647B8E` | `#647b8e` | app/(app)/(landing)/practice/practice.css | 1103 |
| `#6E8294` | `#6e8294` | app/(app)/(landing)/practice/practice.css | 1114 |
| `#718295` | `#718295` | app/(app)/(landing)/practice/practice.css | 1169 |
| `#64788C` | `#64788c` | app/(app)/(landing)/practice/practice.css | 1200 |
| `#A17852` | `#a17852` | app/(app)/(landing)/practice/practice.css | 1204 |
| `#EEF2F5` | `#eef2f5` | app/(app)/(landing)/practice/practice.css | 1384 |
| `#DCE4EA` | `#dce4ea` | app/(app)/(landing)/practice/practice.css | 1417 |
| `#668095` | `#668095` | app/(app)/(landing)/practice/practice.css | 1420 |
| `#E2E9EE` | `#e2e9ee` | app/(app)/(landing)/practice/practice.css | 1797 |
| `#50677B` | `#50677b` | app/(app)/(landing)/practice/practice.css | 1802 |
| `#526579` | `#526579` | app/(app)/(landing)/practice/practice.css | 1880 |
| `#293F54` | `#293f54` | app/(app)/(landing)/practice/practice.css | 1894 |
| `#526579` | `#526579` | app/(app)/(landing)/practice/practice.css | 1904 |
| `#293F54` | `#293f54` | app/(app)/(landing)/practice/practice.css | 1912 |
| `#526579` | `#526579` | app/(app)/(landing)/practice/practice.css | 1925 |
| `#FFFFFF` | `#fff` | app/(app)/(landing)/practice/practice.css | 1930 |
| `#EDF2F7` | `#edf2f7` | app/(app)/(landing)/practice/practice.css | 1981 |
| `#2554E8` | `#2554e8` | app/(app)/(landing)/practice/practice.css | 1996 |
| `#F4F7FC` | `#f4f7fc` | app/(app)/(landing)/practice/practice.css | 1997 |
| `#42566B` | `#42566b` | app/(app)/(landing)/practice/practice.css | 1998 |
| `#526579` | `#526579` | app/(app)/(landing)/practice/practice.css | 2004 |
| `#0B1F3A` | `#0b1f3a` | app/(app)/auth/_components/auth-card.tsx | 41 |
| `#EA4335` | `#EA4335` | app/(app)/auth/_components/google-auth-button.tsx | 58 |
| `#4285F4` | `#4285F4` | app/(app)/auth/_components/google-auth-button.tsx | 62 |
| `#FBBC05` | `#FBBC05` | app/(app)/auth/_components/google-auth-button.tsx | 66 |
| `#34A853` | `#34A853` | app/(app)/auth/_components/google-auth-button.tsx | 70 |
| `#0B1F3A` | `#0b1f3a` | app/(app)/course/[courseName]/[lessonName]/_components/feedback-widget.tsx | 283 |
| `#0A0A0AC7` | `rgba(10,10,10,0.78)` | app/(app)/course/[courseName]/[lessonName]/_components/lessons/guided-lesson-ui.tsx | 19 |
| `#0A0A0A7A` | `rgba(10,10,10,0.48)` | app/(app)/course/[courseName]/[lessonName]/_components/lessons/guided-lesson-ui.tsx | 19 |
| `#0A0A0A2E` | `rgba(10,10,10,0.18)` | app/(app)/course/[courseName]/[lessonName]/_components/lessons/guided-lesson-ui.tsx | 19 |
| `#0A0A0A00` | `rgba(10,10,10,0)` | app/(app)/course/[courseName]/[lessonName]/_components/lessons/guided-lesson-ui.tsx | 19 |
| `#0B1F3A` | `#0b1f3a` | app/(app)/course/[courseName]/[lessonName]/_components/lessons/guided-lesson-ui.tsx | 245 |
| `#DDB96D` | `#ddb96d` | app/(app)/course/[courseName]/[lessonName]/_components/lessons/guided-scarcity-lesson.tsx | 366 |
| `#4E65FF` | `#4E65FF` | app/(app)/course/[courseName]/[lessonName]/_components/lessons/video/video-player.tsx | 281 |
| `#00000047` | `rgba(0,0,0,0.28)` | app/(app)/course/[courseName]/[lessonName]/page.tsx | 86 |
| `#F4F6F8` | `#f4f6f8` | app/(app)/course/[courseName]/_components/course-pathway.tsx | 68 |
| `#071A33` | `#071a33` | app/(app)/course/[courseName]/_components/course-pathway.tsx | 68 |
| `#B68B2D` | `#b68b2d` | app/(app)/course/[courseName]/_components/course-pathway.tsx | 72 |
| `#071A33` | `#071a33` | app/(app)/course/[courseName]/_components/course-pathway.tsx | 75 |
| `#0F172A0F` | `rgba(15,23,42,0.06)` | app/(app)/course/[courseName]/_components/course-pathway.tsx | 98 |
| `#071A33` | `#071a33` | app/(app)/course/[courseName]/_components/course-pathway.tsx | 104 |
| `#0F172A0F` | `rgba(15,23,42,0.06)` | app/(app)/course/[courseName]/_components/course-pathway.tsx | 158 |
| `#2554E8` | `#2554e8` | app/(app)/course/[courseName]/_components/course-pathway.tsx | 159 |
| `#071A33` | `#071a33` | app/(app)/course/[courseName]/_components/course-pathway.tsx | 163 |
| `#0B1F3A` | `#0b1f3a` | app/(app)/course/[courseName]/_components/course-pathway.tsx | 229 |
| `#071A33` | `#071a33` | app/(app)/course/[courseName]/_components/course-pathway.tsx | 232 |
| `#0B1F3A` | `#0b1f3a` | app/(app)/course/[courseName]/_components/course-pathway.tsx | 280 |
| `#0B1F3A` | `#0b1f3a` | app/(app)/course/[courseName]/_components/course-pathway.tsx | 289 |
| `#0B1F3A` | `#0b1f3a` | app/(app)/course/[courseName]/_components/course-pathway.tsx | 289 |
| `#071A33` | `#071a33` | app/(app)/course/[courseName]/_components/course-pathway.tsx | 301 |
| `#0B1F3A` | `#0b1f3a` | app/(app)/course/[courseName]/_components/course-pathway.tsx | 312 |
| `#12345C` | `#12345c` | app/(app)/course/[courseName]/_components/course-pathway.tsx | 312 |
| `#0B1F3A` | `#0b1f3a` | app/(app)/course/[courseName]/_components/course-pathway.tsx | 338 |
| `#071A33` | `#071a33` | app/(app)/course/[courseName]/_components/course-pathway.tsx | 341 |
| `#0B1F3A` | `#0b1f3a` | app/(app)/course/[courseName]/_components/course-pathway.tsx | 369 |
| `#071A33` | `#071a33` | app/(app)/course/[courseName]/_components/course-pathway.tsx | 373 |
| `#0B1F3A` | `#0b1f3a` | app/(app)/course/[courseName]/_components/course-pathway.tsx | 380 |
| `#0F172A0F` | `rgba(15,23,42,0.06)` | app/(app)/course/[courseName]/_components/course-pathway.tsx | 396 |
| `#2554E8` | `#2554e8` | app/(app)/course/[courseName]/_components/course-pathway.tsx | 398 |
| `#071A33` | `#071a33` | app/(app)/course/[courseName]/_components/course-pathway.tsx | 401 |
| `#0B1F3A` | `#0b1f3a` | app/(app)/course/[courseName]/_components/course-pathway.tsx | 411 |
| `#12345C` | `#12345c` | app/(app)/course/[courseName]/_components/course-pathway.tsx | 411 |
| `#0B1F3A` | `#0b1f3a` | app/(app)/course/[courseName]/_components/course-pathway.tsx | 438 |
| `#0B1F3A` | `#0b1f3a` | app/(app)/course/[courseName]/_components/course-pathway.tsx | 439 |
| `#071A33` | `#071a33` | app/(app)/course/[courseName]/_components/course-pathway.tsx | 450 |
| `#0B1F3A` | `#0b1f3a` | app/(app)/course/[courseName]/_components/course-pathway.tsx | 471 |
| `#071A33` | `#071a33` | app/(app)/course/[courseName]/_components/course-pathway.tsx | 475 |
| `#E2E8F0` | `#e2e8f0` | app/(app)/course/[courseName]/_components/course-pathway.tsx | 493 |
| `#DBE4F0` | `#dbe4f0` | app/(app)/course/[courseName]/_components/course-pathway.tsx | 494 |
| `#C9D5E6` | `#c9d5e6` | app/(app)/course/[courseName]/_components/course-pathway.tsx | 497 |
| `#F8FAFC` | `#f8fafc` | app/(app)/course/[courseName]/_components/course-pathway.tsx | 501 |
| `#94A3B8` | `#94a3b8` | app/(app)/course/[courseName]/_components/course-pathway.tsx | 506 |
| `#64748B` | `#64748b` | app/(app)/course/[courseName]/_components/course-pathway.tsx | 507 |
| `#475569` | `#475569` | app/(app)/course/[courseName]/_components/course-pathway.tsx | 508 |
| `#CBD5E1` | `#cbd5e1` | app/(app)/course/[courseName]/_components/course-pathway.tsx | 511 |
| `#0B1F3A` | `#0b1f3a` | app/(app)/course/[courseName]/_components/course-pathway.tsx | 518 |
| `#FFFFFF` | `#ffffff` | app/(app)/course/[courseName]/og-image/route.tsx | 48 |
| `#4E65FF` | `#4e65ff` | app/(app)/layout.tsx | 50 |
| `#4E65FF` | `#4e65ff` | app/(app)/layout.tsx | 51 |
| `#4E65FF` | `#4e65ff` | app/(app)/layout.tsx | 51 |
| `#4E65FF` | `#4e65ff` | app/(app)/layout.tsx | 51 |
| `#0B1F3A` | `#0b1f3a` | components/footer.tsx | 41 |
| `#0B1F3A` | `#0b1f3a` | components/graphs/custom-diagrams.tsx | 127 |
| `#0B1F3A` | `#0b1f3a` | components/graphs/custom-diagrams.tsx | 127 |
| `#B45309` | `#b45309` | components/graphs/custom-diagrams.tsx | 131 |
| `#8A4207` | `#8a4207` | components/graphs/custom-diagrams.tsx | 141 |
| `#0B1F3A` | `#0b1f3a` | components/graphs/custom-diagrams.tsx | 216 |
| `#FFFFFF` | `#ffffff` | components/graphs/custom-diagrams.tsx | 216 |
| `#C3CCD9` | `#c3ccd9` | components/graphs/custom-diagrams.tsx | 217 |
| `#FFFFFF` | `#ffffff` | components/graphs/custom-diagrams.tsx | 226 |
| `#0B1F3A` | `#0b1f3a` | components/graphs/custom-diagrams.tsx | 226 |
| `#2554E8` | `#2554e8` | components/graphs/custom-diagrams.tsx | 247 |
| `#B45309` | `#b45309` | components/graphs/custom-diagrams.tsx | 247 |
| `#2554E8` | `#2554e8` | components/graphs/custom-diagrams.tsx | 298 |
| `#B45309` | `#b45309` | components/graphs/custom-diagrams.tsx | 309 |
| `#1D43AE` | `#1d43ae` | components/graphs/custom-diagrams.tsx | 500 |
| `#2554E8` | `#2554e8` | components/graphs/custom-diagrams.tsx | 501 |
| `#8A4207` | `#8a4207` | components/graphs/custom-diagrams.tsx | 505 |
| `#B45309` | `#b45309` | components/graphs/custom-diagrams.tsx | 506 |
| `#2554E8` | `#2554e8` | components/graphs/custom-diagrams.tsx | 540 |
| `#0B1F3A` | `#0b1f3a` | components/graphs/custom-diagrams.tsx | 644 |
| `#B45309` | `#b45309` | components/graphs/custom-diagrams.tsx | 696 |
| `#2554E8` | `#2554e8` | components/graphs/custom-diagrams.tsx | 696 |
| `#8A4207` | `#8a4207` | components/graphs/custom-diagrams.tsx | 704 |
| `#1D43AE` | `#1d43ae` | components/graphs/custom-diagrams.tsx | 704 |
| `#0B1F3A` | `#0b1f3a` | components/graphs/graph-canvas.tsx | 11 |
| `#2554E8` | `#2554e8` | components/graphs/graph-canvas.tsx | 12 |
| `#B45309` | `#b45309` | components/graphs/graph-canvas.tsx | 13 |
| `#5D6978` | `#5d6978` | components/graphs/graph-canvas.tsx | 14 |
| `#94A3B8` | `#94a3b8` | components/graphs/graph-canvas.tsx | 15 |
| `#2554E829` | `rgba(37, 84, 232, 0.16)` | components/graphs/graph-canvas.tsx | 19 |
| `#1D43AE` | `#1d43ae` | components/graphs/graph-canvas.tsx | 19 |
| `#0B1F3A26` | `rgba(11, 31, 58, 0.15)` | components/graphs/graph-canvas.tsx | 20 |
| `#0B1F3A` | `#0b1f3a` | components/graphs/graph-canvas.tsx | 20 |
| `#B453093D` | `rgba(180, 83, 9, 0.24)` | components/graphs/graph-canvas.tsx | 21 |
| `#8A4207` | `#8a4207` | components/graphs/graph-canvas.tsx | 21 |
| `#5D697838` | `rgba(93, 105, 120, 0.22)` | components/graphs/graph-canvas.tsx | 22 |
| `#42505F` | `#42505f` | components/graphs/graph-canvas.tsx | 22 |
| `#B3423E29` | `rgba(179, 66, 62, 0.16)` | components/graphs/graph-canvas.tsx | 23 |
| `#993733` | `#993733` | components/graphs/graph-canvas.tsx | 23 |
| `#0F766E29` | `rgba(15, 118, 110, 0.16)` | components/graphs/graph-canvas.tsx | 24 |
| `#0D5F59` | `#0d5f59` | components/graphs/graph-canvas.tsx | 24 |
| `#0B1F3A` | `#0b1f3a` | components/graphs/graph-canvas.tsx | 45 |
| `#2554E8` | `#2554e8` | components/graphs/graph-canvas.tsx | 45 |
| `#0B1F3A` | `#0b1f3a` | components/graphs/graph-canvas.tsx | 53 |
| `#2554E8` | `#2554e8` | components/graphs/graph-canvas.tsx | 53 |
| `#0B1F3A` | `#0b1f3a` | components/graphs/graph-canvas.tsx | 53 |
| `#EEF3F7` | `#eef3f7` | components/graphs/graph-canvas.tsx | 55 |
| `#0B1F3A` | `#0b1f3a` | components/graphs/graph-canvas.tsx | 55 |
| `#0B1F3A` | `#0b1f3a` | components/graphs/graph-canvas.tsx | 55 |
| `#0B1F3A` | `#0b1f3a` | components/graphs/graph-canvas.tsx | 56 |
| `#0B1F3A12` | `rgba(11,31,58,0.07)` | components/graphs/graph-canvas.tsx | 127 |
| `#5D6978` | `#5d6978` | components/graphs/graph-canvas.tsx | 194 |
| `#5D6978` | `#5d6978` | components/graphs/graph-canvas.tsx | 202 |
| `#0B1F3A` | `#0b1f3a` | components/graphs/graph-canvas.tsx | 203 |
| `#0B1F3A` | `#0b1f3a` | components/graphs/graph-canvas.tsx | 207 |
| `#94A3B8` | `#94a3b8` | components/graphs/graph-canvas.tsx | 257 |
| `#42505F` | `#42505f` | components/graphs/graph-canvas.tsx | 259 |
| `#94A3B8` | `#94a3b8` | components/graphs/graph-canvas.tsx | 292 |
| `#0B1F3A` | `#0b1f3a` | components/graphs/graph-canvas.tsx | 292 |
| `#F5F7FA` | `#f5f7fa` | components/graphs/graph-canvas.tsx | 293 |
| `#0B1F3A` | `#0b1f3a` | components/graphs/graph-canvas.tsx | 301 |
| `#5D6978` | `#5d6978` | components/graphs/graph-canvas.tsx | 320 |
| `#42505F` | `#42505f` | components/graphs/graph-canvas.tsx | 333 |
| `#42505F` | `#42505f` | components/graphs/graph-canvas.tsx | 343 |
| `#0B1F3A` | `#0b1f3a` | components/graphs/graph-canvas.tsx | 357 |
| `#2554E8` | `#2554e8` | components/graphs/graph-controls.tsx | 59 |
| `#1D43AE` | `#1d43ae` | components/graphs/graph-controls.tsx | 99 |
| `#0B1F3A` | `#0b1f3a` | components/graphs/graph-controls.tsx | 110 |
| `#0B1F3A` | `#0b1f3a` | components/graphs/graph-controls.tsx | 142 |
| `#0B1F3A` | `#0b1f3a` | components/graphs/graph-controls.tsx | 142 |
| `#0B1F3A` | `#0b1f3a` | components/graphs/graph-controls.tsx | 171 |
| `#2554E8` | `#2554e8` | components/graphs/graph-lab.tsx | 147 |
| `#1D43AE` | `#1d43ae` | components/graphs/graph-lab.tsx | 158 |
| `#0B1F3A` | `#0b1f3a` | components/graphs/graph-lab.tsx | 178 |
| `#1D43AE` | `#1d43ae` | components/graphs/graph-lab.tsx | 208 |
| `#0B1F3A` | `#0b1f3a` | components/graphs/graph-lab.tsx | 360 |
| `#0B1F3A` | `#0b1f3a` | components/graphs/graph-lab.tsx | 360 |
| `#0B1F3A` | `#0b1f3a` | components/graphs/graph-lab.tsx | 360 |
| `#B89366` | `#B89366` | components/hero-svg/elements/character-laptop/character.tsx | 61 |
| `#FFC7A4` | `#FFC7A4` | components/hero-svg/elements/character-laptop/character.tsx | 67 |
| `#FFAD8F` | `#FFAD8F` | components/hero-svg/elements/character-laptop/character.tsx | 72 |
| `#FFAD8F` | `#FFAD8F` | components/hero-svg/elements/character-laptop/character.tsx | 77 |
| `#87C4F4` | `#87C4F4` | components/hero-svg/elements/character-laptop/character.tsx | 82 |
| `#FFC7A4` | `#FFC7A4` | components/hero-svg/elements/character-laptop/character.tsx | 88 |
| `#B16668` | `#B16668` | components/hero-svg/elements/character-laptop/character.tsx | 118 |
| `#F28F8F` | `#F28F8F` | components/hero-svg/elements/character-laptop/character.tsx | 122 |
| `#CDAB62` | `#CDAB62` | components/hero-svg/elements/character-laptop/character.tsx | 138 |
| `#CDAB62` | `#CDAB62` | components/hero-svg/elements/character-laptop/character.tsx | 144 |
| `#719BEA` | `#719BEA` | components/hero-svg/elements/character-laptop/character.tsx | 152 |
| `#719BEA` | `#719BEA` | components/hero-svg/elements/character-laptop/character.tsx | 170 |
| `#FFAD8F` | `#FFAD8F` | components/hero-svg/elements/character-laptop/character.tsx | 177 |
| `#FFAD8F` | `#FFAD8F` | components/hero-svg/elements/character-laptop/character.tsx | 184 |
| `#FFC7A4` | `#FFC7A4` | components/hero-svg/elements/character-laptop/character.tsx | 189 |
| `#FFAD8F` | `#FFAD8F` | components/hero-svg/elements/character-laptop/character.tsx | 194 |
| `#FFAD8F` | `#FFAD8F` | components/hero-svg/elements/character-laptop/character.tsx | 199 |
| `#FFAD8F` | `#FFAD8F` | components/hero-svg/elements/character-laptop/character.tsx | 204 |
| `#FFAD8F` | `#FFAD8F` | components/hero-svg/elements/character-laptop/character.tsx | 209 |
| `#FFAD8F` | `#FFAD8F` | components/hero-svg/elements/character-laptop/character.tsx | 214 |
| `#FFE062` | `#FFE062` | components/hero-svg/elements/character-laptop/character.tsx | 231 |
| `#FFE062` | `#FFE062` | components/hero-svg/elements/character-laptop/character.tsx | 236 |
| `#FFAD8F` | `#FFAD8F` | components/hero-svg/elements/character-laptop/character.tsx | 243 |
| `#C8C8C8` | `#C8C8C8` | components/hero-svg/elements/character-laptop/index.tsx | 24 |
| `#37474F` | `#37474F` | components/hero-svg/elements/character-laptop/index.tsx | 24 |
| `#DCDCDE` | `#DCDCDE` | components/hero-svg/elements/character-laptop/index.tsx | 29 |
| `#455A64` | `#455A64` | components/hero-svg/elements/character-laptop/index.tsx | 29 |
| `#A0A0A2` | `#A0A0A2` | components/hero-svg/elements/character-laptop/index.tsx | 35 |
| `#263238` | `#263238` | components/hero-svg/elements/character-laptop/index.tsx | 35 |
| `#2B2B2B` | `#2B2B2B` | components/hero-svg/elements/character-laptop/index.tsx | 41 |
| `#37474F` | `#37474F` | components/hero-svg/elements/character-laptop/index.tsx | 41 |
| `#CFCFCF` | `#CFCFCF` | components/hero-svg/elements/character-laptop/index.tsx | 47 |
| `#455A64` | `#455A64` | components/hero-svg/elements/character-laptop/index.tsx | 47 |
| `#A0A0A2` | `#A0A0A2` | components/hero-svg/elements/character-laptop/index.tsx | 53 |
| `#263238` | `#263238` | components/hero-svg/elements/character-laptop/index.tsx | 53 |
| `#B1B1B1` | `#b1b1b1` | components/hero-svg/elements/character-laptop/index.tsx | 64 |
| `#181C3B` | `#181C3B` | components/hero-svg/elements/character-laptop/index.tsx | 64 |
| `#0A0A0A` | `#0A0A0A` | components/hero-svg/elements/character-laptop/index.tsx | 70 |
| `#A0A0A2` | `#A0A0A2` | components/hero-svg/elements/character-laptop/index.tsx | 76 |
| `#263238` | `#263238` | components/hero-svg/elements/character-laptop/index.tsx | 76 |
| `#A0A0A2` | `#A0A0A2` | components/hero-svg/elements/character-laptop/index.tsx | 82 |
| `#263238` | `#263238` | components/hero-svg/elements/character-laptop/index.tsx | 82 |
| `#26252A` | `#26252A` | components/hero-svg/elements/character-laptop/index.tsx | 88 |
| `#455A64` | `#455A64` | components/hero-svg/elements/character-laptop/index.tsx | 88 |
| `#A0A0A2` | `#A0A0A2` | components/hero-svg/elements/character-laptop/index.tsx | 94 |
| `#263238` | `#263238` | components/hero-svg/elements/character-laptop/index.tsx | 94 |
| `#B7B7B7` | `#B7B7B7` | components/hero-svg/elements/character-laptop/index.tsx | 100 |
| `#37474F` | `#37474F` | components/hero-svg/elements/character-laptop/index.tsx | 100 |
| `#8F8F8F` | `#8f8f8f` | components/hero-svg/elements/character-laptop/video-bar.tsx | 23 |
| `#263238` | `#263238` | components/hero-svg/elements/character-laptop/video-bar.tsx | 23 |
| `#FFFFFF` | `#FFFFFF` | components/hero-svg/elements/character-laptop/video-bar.tsx | 31 |
| `#455A64` | `#455A64` | components/hero-svg/elements/character-laptop/video-bar.tsx | 31 |
| `#4E65FF` | `#4E65FF` | components/hero-svg/elements/character-laptop/video-bar.tsx | 82 |
| `#4E65FF` | `#4E65FF` | components/hero-svg/elements/character-laptop/video-bar.tsx | 93 |
| `#4E65FF` | `#4E65FF` | components/hero-svg/elements/character-laptop/video-bar.tsx | 104 |
| `#000000` | `#000000` | components/hero-svg/elements/grad-cap-books.tsx | 22 |
| `#E0E0E0` | `#E0E0E0` | components/hero-svg/elements/grad-cap-books.tsx | 22 |
| `#4E65FF` | `#4E65FF` | components/hero-svg/elements/grad-cap-books.tsx | 30 |
| `#F5F5F5` | `#F5F5F5` | components/hero-svg/elements/grad-cap-books.tsx | 41 |
| `#4E65FF` | `#4E65FF` | components/hero-svg/elements/grad-cap-books.tsx | 46 |
| `#4E65FF` | `#4E65FF` | components/hero-svg/elements/grad-cap-books.tsx | 57 |
| `#4E65FF` | `#4E65FF` | components/hero-svg/elements/grad-cap-books.tsx | 68 |
| `#4E65FF` | `#4E65FF` | components/hero-svg/elements/grad-cap-books.tsx | 79 |
| `#4E65FF` | `#4E65FF` | components/hero-svg/elements/grad-cap-books.tsx | 84 |
| `#4E65FF` | `#4E65FF` | components/hero-svg/elements/grad-cap-books.tsx | 91 |
| `#F5F5F5` | `#F5F5F5` | components/hero-svg/elements/grad-cap-books.tsx | 102 |
| `#4E65FF` | `#4E65FF` | components/hero-svg/elements/grad-cap-books.tsx | 107 |
| `#4E65FF` | `#4E65FF` | components/hero-svg/elements/grad-cap-books.tsx | 118 |
| `#4E65FF` | `#4E65FF` | components/hero-svg/elements/grad-cap-books.tsx | 123 |
| `#4E65FF` | `#4E65FF` | components/hero-svg/elements/grad-cap-books.tsx | 134 |
| `#4E65FF` | `#4E65FF` | components/hero-svg/elements/grad-cap-books.tsx | 139 |
| `#37474F` | `#37474F` | components/hero-svg/elements/graduation-cap.tsx | 34 |
| `#263238` | `#263238` | components/hero-svg/elements/graduation-cap.tsx | 39 |
| `#4E65FF` | `#4E65FF` | components/hero-svg/elements/graduation-cap.tsx | 44 |
| `#37474F` | `#37474F` | components/hero-svg/elements/graduation-cap.tsx | 49 |
| `#4E65FF` | `#4E65FF` | components/hero-svg/elements/graduation-cap.tsx | 55 |
| `#4E65FF` | `#4E65FF` | components/hero-svg/elements/graduation-cap.tsx | 61 |
| `#455A64` | `#455A64` | components/hero-svg/elements/graduation-cap.tsx | 66 |
| `#4E65FF` | `#4E65FF` | components/hero-svg/elements/graduation-cap.tsx | 71 |
| `#4E65FF` | `#4E65FF` | components/hero-svg/elements/graduation-cap.tsx | 93 |
| `#4E65FF` | `#4E65FF` | components/hero-svg/elements/graduation-cap.tsx | 105 |
| `#4E65FF` | `#4E65FF` | components/hero-svg/elements/graduation-cap.tsx | 111 |
| `#4E65FF` | `#4E65FF` | components/hero-svg/elements/graduation-cap.tsx | 123 |
| `#263238` | `#263238` | components/hero-svg/elements/graduation-cap.tsx | 128 |
| `#37474F` | `#37474F` | components/hero-svg/elements/graduation-cap.tsx | 133 |
| `#000000` | `#000000` | components/hero-svg/elements/laptop-books.tsx | 22 |
| `#E0E0E0` | `#E0E0E0` | components/hero-svg/elements/laptop-books.tsx | 22 |
| `#4E65FF` | `#4E65FF` | components/hero-svg/elements/laptop-books.tsx | 30 |
| `#F5F5F5` | `#F5F5F5` | components/hero-svg/elements/laptop-books.tsx | 41 |
| `#4E65FF` | `#4E65FF` | components/hero-svg/elements/laptop-books.tsx | 46 |
| `#4E65FF` | `#4E65FF` | components/hero-svg/elements/laptop-books.tsx | 57 |
| `#4E65FF` | `#4E65FF` | components/hero-svg/elements/laptop-books.tsx | 68 |
| `#4E65FF` | `#4E65FF` | components/hero-svg/elements/laptop-books.tsx | 73 |
| `#4E65FF` | `#4E65FF` | components/hero-svg/elements/laptop-books.tsx | 78 |
| `#4E65FF` | `#4E65FF` | components/hero-svg/elements/laptop-books.tsx | 83 |
| `#4E65FF` | `#4E65FF` | components/hero-svg/elements/laptop-books.tsx | 102 |
| `#F5F5F5` | `#F5F5F5` | components/hero-svg/elements/laptop-books.tsx | 113 |
| `#4E65FF` | `#4E65FF` | components/hero-svg/elements/laptop-books.tsx | 118 |
| `#4E65FF` | `#4E65FF` | components/hero-svg/elements/laptop-books.tsx | 129 |
| `#4E65FF` | `#4E65FF` | components/hero-svg/elements/laptop-books.tsx | 140 |
| `#000000` | `#000000` | components/hero-svg/elements/pen.tsx | 22 |
| `#E0E0E0` | `#E0E0E0` | components/hero-svg/elements/pen.tsx | 22 |
| `#000000` | `#000000` | components/hero-svg/elements/pen.tsx | 28 |
| `#E0E0E0` | `#E0E0E0` | components/hero-svg/elements/pen.tsx | 28 |
| `#4E65FF` | `#4E65FF` | components/hero-svg/elements/pen.tsx | 34 |
| `#B1B1B1` | `#B1B1B1` | components/hero-svg/elements/pen.tsx | 39 |
| `#4E65FF` | `#4E65FF` | components/hero-svg/elements/pen.tsx | 45 |
| `#455A64` | `#455A64` | components/hero-svg/elements/pen.tsx | 50 |
| `#37474F` | `#37474F` | components/hero-svg/elements/pen.tsx | 55 |
| `#4E65FF` | `#4E65FF` | components/hero-svg/elements/pen.tsx | 60 |
| `#4E65FF` | `#4E65FF` | components/hero-svg/elements/pen.tsx | 71 |
| `#FAFAFA` | `#FAFAFA` | components/hero-svg/elements/pen.tsx | 82 |
| `#F5F5F5` | `#F5F5F5` | components/hero-svg/elements/pen.tsx | 87 |
| `#4E65FF` | `#4E65FF` | components/hero-svg/elements/pen.tsx | 92 |
| `#455A64` | `#455A64` | components/hero-svg/elements/pen.tsx | 109 |
| `#263238` | `#263238` | components/hero-svg/elements/pen.tsx | 114 |
| `#000000` | `#000000` | components/hero-svg/elements/pencil.tsx | 21 |
| `#E0E0E0` | `#E0E0E0` | components/hero-svg/elements/pencil.tsx | 21 |
| `#FFA8A7` | `#FFA8A7` | components/hero-svg/elements/pencil.tsx | 27 |
| `#263238` | `#263238` | components/hero-svg/elements/pencil.tsx | 32 |
| `#CFCFCF` | `#CFCFCF` | components/hero-svg/elements/pencil.tsx | 37 |
| `#455A64` | `#455A64` | components/hero-svg/elements/pencil.tsx | 37 |
| `#EBEBEB` | `#EBEBEB` | components/hero-svg/elements/pencil.tsx | 42 |
| `#4E65FF` | `#4E65FF` | components/hero-svg/elements/pencil.tsx | 47 |
| `#EBEBEB` | `#EBEBEB` | components/hero-svg/elements/pencil.tsx | 52 |
| `#F28F8F` | `#F28F8F` | components/hero-svg/elements/pencil.tsx | 63 |
| `#E7EAFF` | `#E7EAFF` | components/hero-svg/elements/speech-bubble.tsx | 25 |
| `#26283E` | `#26283E` | components/hero-svg/elements/speech-bubble.tsx | 25 |
| `#4E65FF` | `#4E65FF` | components/hero-svg/elements/speech-bubble.tsx | 30 |
| `#E8E8E8` | `#E8E8E8` | components/hero-svg/floor.tsx | 7 |
| `#242424` | `#242424` | components/hero-svg/floor.tsx | 7 |
| `#00000047` | `rgba(0,0,0,0.28)` | components/interactive-economics-graph.tsx | 187 |
| `#061225` | `#061225` | components/navbar.tsx | 98 |
| `#0000002E` | `rgba(0,0,0,0.18)` | components/navbar.tsx | 98 |
| `#2563EB42` | `rgba(37,99,235,0.26)` | components/navbar.tsx | 171 |
| `#061225` | `#061225` | components/navbar.tsx | 219 |
| `#0B1F3A` | `#0b1f3a` | components/ui/alert.tsx | 15 |
| `#0B1F3A` | `#0b1f3a` | components/ui/alert.tsx | 15 |
| `#0B1F3A` | `#0b1f3a` | components/ui/alert.tsx | 17 |
| `#0B1F3A` | `#0b1f3a` | components/ui/alert.tsx | 17 |
| `#0B1F3A` | `#0b1f3a` | components/ui/badge.tsx | 21 |
| `#FFFFFF38` | `rgba(255,255,255,0.22)` | components/ui/button.tsx | 19 |
| `#00A33D` | `oklch(62%_0.19_149)` | components/ui/button.tsx | 21 |
| `#00882F` | `oklch(54%_0.17_149)` | components/ui/button.tsx | 21 |
| `#00A33D` | `oklch(62%_0.19_149)` | components/ui/button.tsx | 21 |
| `#00882F` | `oklch(54%_0.17_149)` | components/ui/button.tsx | 21 |
| `#0B1F3A` | `#0b1f3a` | lib/data/mock-courses.ts | 9 |
| `#0B1F3A` | `#0b1f3a` | lib/data/mock-courses.ts | 10 |
| `#071A33` | `#071a33` | lib/data/mock-courses.ts | 11 |
| `#EEF2F6` | `#eef2f6` | lib/data/mock-courses.ts | 12 |
| `#5D6978` | `#5d6978` | lib/data/mock-courses.ts | 13 |
| `#116600` | `#160` | lib/markdown/strip-markdown.ts | 64 |
| `#4E65FF` | `#4e65ff` | lib/stripe/actions.ts | 79 |
| `#8C8C8C` | `#8C8C8C` | public/hero-illustration.svg | 4 |
| `#E0E0E0` | `#E0E0E0` | public/hero-illustration.svg | 7 |
| `#E0E0E0` | `#E0E0E0` | public/hero-illustration.svg | 8 |
| `#E0E0E0` | `#E0E0E0` | public/hero-illustration.svg | 9 |
| `#E0E0E0` | `#E0E0E0` | public/hero-illustration.svg | 10 |
| `#E0E0E0` | `#E0E0E0` | public/hero-illustration.svg | 11 |
| `#4E65FF` | `#4E65FF` | public/hero-illustration.svg | 16 |
| `#F5F5F5` | `#F5F5F5` | public/hero-illustration.svg | 18 |
| `#4E65FF` | `#4E65FF` | public/hero-illustration.svg | 19 |
| `#4E65FF` | `#4E65FF` | public/hero-illustration.svg | 21 |
| `#4E65FF` | `#4E65FF` | public/hero-illustration.svg | 23 |
| `#4E65FF` | `#4E65FF` | public/hero-illustration.svg | 25 |
| `#4E65FF` | `#4E65FF` | public/hero-illustration.svg | 26 |
| `#4E65FF` | `#4E65FF` | public/hero-illustration.svg | 29 |
| `#F5F5F5` | `#F5F5F5` | public/hero-illustration.svg | 31 |
| `#4E65FF` | `#4E65FF` | public/hero-illustration.svg | 32 |
| `#4E65FF` | `#4E65FF` | public/hero-illustration.svg | 34 |
| `#4E65FF` | `#4E65FF` | public/hero-illustration.svg | 35 |
| `#4E65FF` | `#4E65FF` | public/hero-illustration.svg | 37 |
| `#4E65FF` | `#4E65FF` | public/hero-illustration.svg | 38 |
| `#4E65FF` | `#4E65FF` | public/hero-illustration.svg | 47 |
| `#F5F5F5` | `#F5F5F5` | public/hero-illustration.svg | 49 |
| `#4E65FF` | `#4E65FF` | public/hero-illustration.svg | 50 |
| `#4E65FF` | `#4E65FF` | public/hero-illustration.svg | 52 |
| `#4E65FF` | `#4E65FF` | public/hero-illustration.svg | 54 |
| `#4E65FF` | `#4E65FF` | public/hero-illustration.svg | 55 |
| `#4E65FF` | `#4E65FF` | public/hero-illustration.svg | 56 |
| `#4E65FF` | `#4E65FF` | public/hero-illustration.svg | 57 |
| `#4E65FF` | `#4E65FF` | public/hero-illustration.svg | 64 |
| `#F5F5F5` | `#F5F5F5` | public/hero-illustration.svg | 66 |
| `#4E65FF` | `#4E65FF` | public/hero-illustration.svg | 67 |
| `#4E65FF` | `#4E65FF` | public/hero-illustration.svg | 69 |
| `#4E65FF` | `#4E65FF` | public/hero-illustration.svg | 71 |
| `#37474F` | `#37474F` | public/hero-illustration.svg | 80 |
| `#263238` | `#263238` | public/hero-illustration.svg | 81 |
| `#4E65FF` | `#4E65FF` | public/hero-illustration.svg | 82 |
| `#37474F` | `#37474F` | public/hero-illustration.svg | 83 |
| `#4E65FF` | `#4E65FF` | public/hero-illustration.svg | 84 |
| `#4E65FF` | `#4E65FF` | public/hero-illustration.svg | 85 |
| `#455A64` | `#455A64` | public/hero-illustration.svg | 86 |
| `#4E65FF` | `#4E65FF` | public/hero-illustration.svg | 87 |
| `#4E65FF` | `#4E65FF` | public/hero-illustration.svg | 89 |
| `#4E65FF` | `#4E65FF` | public/hero-illustration.svg | 91 |
| `#4E65FF` | `#4E65FF` | public/hero-illustration.svg | 92 |
| `#4E65FF` | `#4E65FF` | public/hero-illustration.svg | 94 |
| `#263238` | `#263238` | public/hero-illustration.svg | 95 |
| `#37474F` | `#37474F` | public/hero-illustration.svg | 96 |
| `#4E65FF` | `#4E65FF` | public/hero-illustration.svg | 102 |
| `#B1B1B1` | `#B1B1B1` | public/hero-illustration.svg | 103 |
| `#4E65FF` | `#4E65FF` | public/hero-illustration.svg | 104 |
| `#455A64` | `#455A64` | public/hero-illustration.svg | 105 |
| `#37474F` | `#37474F` | public/hero-illustration.svg | 106 |
| `#4E65FF` | `#4E65FF` | public/hero-illustration.svg | 107 |
| `#4E65FF` | `#4E65FF` | public/hero-illustration.svg | 109 |
| `#FAFAFA` | `#FAFAFA` | public/hero-illustration.svg | 111 |
| `#F5F5F5` | `#F5F5F5` | public/hero-illustration.svg | 112 |
| `#4E65FF` | `#4E65FF` | public/hero-illustration.svg | 113 |
| `#455A64` | `#455A64` | public/hero-illustration.svg | 116 |
| `#263238` | `#263238` | public/hero-illustration.svg | 117 |
| `#FFA8A7` | `#FFA8A7` | public/hero-illustration.svg | 123 |
| `#263238` | `#263238` | public/hero-illustration.svg | 124 |
| `#455A64` | `#455A64` | public/hero-illustration.svg | 125 |
| `#EBEBEB` | `#EBEBEB` | public/hero-illustration.svg | 126 |
| `#4E65FF` | `#4E65FF` | public/hero-illustration.svg | 127 |
| `#EBEBEB` | `#EBEBEB` | public/hero-illustration.svg | 128 |
| `#F28F8F` | `#F28F8F` | public/hero-illustration.svg | 130 |
| `#4E65FF` | `#4E65FF` | public/hero-illustration.svg | 137 |
| `#220066` | `#206` | public/hero-illustration.svg | 141 |
| `#116633` | `#163` | public/hero-illustration.svg | 141 |
| `#4E65FF` | `#4E65FF` | public/hero-illustration.svg | 141 |
| `#37474F` | `#37474F` | public/hero-illustration.svg | 145 |
| `#455A64` | `#455A64` | public/hero-illustration.svg | 146 |
| `#263238` | `#263238` | public/hero-illustration.svg | 147 |
| `#37474F` | `#37474F` | public/hero-illustration.svg | 148 |
| `#455A64` | `#455A64` | public/hero-illustration.svg | 149 |
| `#263238` | `#263238` | public/hero-illustration.svg | 150 |
| `#4E65FF` | `#4E65FF` | public/hero-illustration.svg | 152 |
| `#0A0A0A` | `#0A0A0A` | public/hero-illustration.svg | 153 |
| `#263238` | `#263238` | public/hero-illustration.svg | 154 |
| `#263238` | `#263238` | public/hero-illustration.svg | 155 |
| `#455A64` | `#455A64` | public/hero-illustration.svg | 156 |
| `#263238` | `#263238` | public/hero-illustration.svg | 157 |
| `#37474F` | `#37474F` | public/hero-illustration.svg | 158 |
| `#FFC7A4` | `#FFC7A4` | public/hero-illustration.svg | 162 |
| `#FFAD8F` | `#FFAD8F` | public/hero-illustration.svg | 163 |
| `#FFAD8F` | `#FFAD8F` | public/hero-illustration.svg | 164 |
| `#87C4F4` | `#87C4F4` | public/hero-illustration.svg | 165 |
| `#FFC7A4` | `#FFC7A4` | public/hero-illustration.svg | 167 |
| `#B16668` | `#B16668` | public/hero-illustration.svg | 168 |
| `#F28F8F` | `#F28F8F` | public/hero-illustration.svg | 169 |
| `#CDAB62` | `#CDAB62` | public/hero-illustration.svg | 170 |
| `#CDAB62` | `#CDAB62` | public/hero-illustration.svg | 171 |
| `#719BEA` | `#719BEA` | public/hero-illustration.svg | 172 |
| `#719BEA` | `#719BEA` | public/hero-illustration.svg | 173 |
| `#FFAD8F` | `#FFAD8F` | public/hero-illustration.svg | 174 |
| `#FFAD8F` | `#FFAD8F` | public/hero-illustration.svg | 177 |
| `#FFC7A4` | `#FFC7A4` | public/hero-illustration.svg | 178 |
| `#FFAD8F` | `#FFAD8F` | public/hero-illustration.svg | 179 |
| `#FFAD8F` | `#FFAD8F` | public/hero-illustration.svg | 180 |
| `#FFAD8F` | `#FFAD8F` | public/hero-illustration.svg | 181 |
| `#FFAD8F` | `#FFAD8F` | public/hero-illustration.svg | 182 |
| `#FFAD8F` | `#FFAD8F` | public/hero-illustration.svg | 183 |
| `#FFE062` | `#FFE062` | public/hero-illustration.svg | 185 |
| `#FFE062` | `#FFE062` | public/hero-illustration.svg | 186 |
| `#FFAD8F` | `#FFAD8F` | public/hero-illustration.svg | 187 |
| `#263238` | `#263238` | public/hero-illustration.svg | 191 |
| `#455A64` | `#455A64` | public/hero-illustration.svg | 192 |
| `#4E65FF` | `#4E65FF` | public/hero-illustration.svg | 203 |
| `#4E65FF` | `#4E65FF` | public/hero-illustration.svg | 205 |
| `#4E65FF` | `#4E65FF` | public/hero-illustration.svg | 207 |
| `#B89366` | `#B89366` | public/hero-illustration.svg | 213 |
| `#AB865A` | `#AB865A` | public/hero-illustration.svg | 214 |
| `#B89366` | `#B89366` | public/not-found.svg | 3 |
| `#FFC7A4` | `#FFC7A4` | public/not-found.svg | 4 |
| `#87C4F4` | `#87C4F4` | public/not-found.svg | 5 |
| `#FFC7A4` | `#FFC7A4` | public/not-found.svg | 6 |
| `#CDAB62` | `#CDAB62` | public/not-found.svg | 7 |
| `#CDAB62` | `#CDAB62` | public/not-found.svg | 8 |
| `#719BEA` | `#719BEA` | public/not-found.svg | 9 |
| `#719BEA` | `#719BEA` | public/not-found.svg | 10 |
| `#FFAD8F` | `#FFAD8F` | public/not-found.svg | 11 |
| `#FFC7A4` | `#FFC7A4` | public/not-found.svg | 12 |
| `#FFE062` | `#FFE062` | public/not-found.svg | 13 |
| `#FFE062` | `#FFE062` | public/not-found.svg | 14 |
| `#FFAD8F` | `#FFAD8F` | public/not-found.svg | 15 |
| `#B16668` | `#B16668` | public/not-found.svg | 16 |
| `#F28F8F` | `#F28F8F` | public/not-found.svg | 17 |
| `#FFFFFF` | `oklch(1 0 0)` | styles/globals.css | 77 |
| `#0A0A0A` | `oklch(0.145 0 0)` | styles/globals.css | 78 |
| `#F2FBF8` | `oklch(98.05% 0.01 174.28)` | styles/globals.css | 80 |
| `#007A55` | `oklch(51.28% 0.11 163.56)` | styles/globals.css | 81 |
| `#F4F8FF` | `oklch(97.81% 0.01 261.79)` | styles/globals.css | 83 |
| `#1447E6` | `oklch(48.78% 0.243 264.4)` | styles/globals.css | 84 |
| `#FFF7F2` | `oklch(98.1% 0.011 54.5)` | styles/globals.css | 86 |
| `#BB4D01` | `oklch(55.7% 0.158 45.36)` | styles/globals.css | 87 |
| `#FFF4F5` | `oklch(97.6% 0.012 10.99)` | styles/globals.css | 89 |
| `#C10006` | `oklch(50.95% 0.209 28.51)` | styles/globals.css | 90 |
| `#F7F9FA` | `oklch(0.98 0.0025 245)` | styles/globals.css | 92 |
| `#0A0A0A` | `oklch(0.145 0 0)` | styles/globals.css | 93 |
| `#FFFFFF` | `oklch(1 0 0)` | styles/globals.css | 94 |
| `#0A0A0A` | `oklch(0.145 0 0)` | styles/globals.css | 95 |
| `#0B1F3A` | `#0b1f3a` | styles/globals.css | 97 |
| `#FFFFFF` | `#ffffff` | styles/globals.css | 98 |
| `#F5F5F5` | `oklch(0.97 0 0)` | styles/globals.css | 99 |
| `#171717` | `oklch(0.205 0 0)` | styles/globals.css | 100 |
| `#F5F5F5` | `oklch(0.97 0 0)` | styles/globals.css | 101 |
| `#737373` | `oklch(0.556 0 0)` | styles/globals.css | 102 |
| `#F5F5F5` | `oklch(0.97 0 0)` | styles/globals.css | 103 |
| `#171717` | `oklch(0.205 0 0)` | styles/globals.css | 104 |
| `#E7000B` | `oklch(0.577 0.245 27.325)` | styles/globals.css | 105 |
| `#E4E4E4` | `oklch(0.92 0 0)` | styles/globals.css | 106 |
| `#E4E4E4` | `oklch(0.92 0 0)` | styles/globals.css | 107 |
| `#A1A1A1` | `oklch(0.708 0 0)` | styles/globals.css | 108 |
| `#0000004C` | `rgba(0, 0, 0, 0.3)` | styles/globals.css | 109 |
| `#00000080` | `rgba(0, 0, 0, 0.5)` | styles/globals.css | 110 |
| `#F5F7FA` | `#f5f7fa` | styles/globals.css | 112 |
| `#FFFFFF` | `#ffffff` | styles/globals.css | 113 |
| `#EEF2F6` | `#eef2f6` | styles/globals.css | 114 |
| `#0B1F3A24` | `rgb(11 31 58 / 14%)` | styles/globals.css | 115 |
| `#0B1F3A` | `#0b1f3a` | styles/globals.css | 116 |
| `#5D6978` | `#5d6978` | styles/globals.css | 117 |
| `#0B1F3A` | `#0b1f3a` | styles/globals.css | 118 |
| `#12345C` | `#12345c` | styles/globals.css | 119 |
| `#3F7D5A` | `#3f7d5a` | styles/globals.css | 120 |
| `#64748B` | `#64748b` | styles/globals.css | 121 |
| `#A34D45` | `#a34d45` | styles/globals.css | 122 |
| `#0A0A0A` | `oklch(0.145 0 0)` | styles/globals.css | 126 |
| `#FAFAFA` | `oklch(0.985 0 0)` | styles/globals.css | 127 |
| `#09120F` | `oklch(17.19% 0.015 171.77)` | styles/globals.css | 129 |
| `#00BC7D` | `oklch(70.19% 0.158 160.44)` | styles/globals.css | 130 |
| `#0B0F16` | `oklch(16.77% 0.016 261.49)` | styles/globals.css | 132 |
| `#2B7FFF` | `oklch(61.87% 0.207 259.23)` | styles/globals.css | 133 |
| `#160E09` | `oklch(17.27% 0.017 53.44)` | styles/globals.css | 135 |
| `#FE9A00` | `oklch(77.24% 0.173 65.37)` | styles/globals.css | 136 |
| `#160B0C` | `oklch(16.58% 0.019 13.41)` | styles/globals.css | 138 |
| `#FF6467` | `oklch(70.22% 0.189 22.23)` | styles/globals.css | 139 |
| `#171717` | `oklch(0.205 0 0)` | styles/globals.css | 141 |
| `#FAFAFA` | `oklch(0.985 0 0)` | styles/globals.css | 142 |
| `#171717` | `oklch(0.205 0 0)` | styles/globals.css | 143 |
| `#FAFAFA` | `oklch(0.985 0 0)` | styles/globals.css | 144 |
| `#262626` | `oklch(0.269 0 0)` | styles/globals.css | 145 |
| `#FAFAFA` | `oklch(0.985 0 0)` | styles/globals.css | 146 |
| `#262626` | `oklch(0.269 0 0)` | styles/globals.css | 147 |
| `#A1A1A1` | `oklch(0.708 0 0)` | styles/globals.css | 148 |
| `#262626` | `oklch(0.269 0 0)` | styles/globals.css | 149 |
| `#FAFAFA` | `oklch(0.985 0 0)` | styles/globals.css | 150 |
| `#FF4144` | `oklch(66.102% 0.22548 25.192)` | styles/globals.css | 151 |
| `#FFFFFF1A` | `oklch(1 0 0 / 10%)` | styles/globals.css | 152 |
| `#FFFFFF26` | `oklch(1 0 0 / 15%)` | styles/globals.css | 153 |
| `#737373` | `oklch(0.556 0 0)` | styles/globals.css | 154 |
| `#FFFFFF33` | `rgba(255, 255, 255, 0.2)` | styles/globals.css | 155 |
| `#FFFFFF66` | `rgba(255, 255, 255, 0.4)` | styles/globals.css | 156 |
| `#F5F7FA` | `#f5f7fa` | styles/globals.css | 158 |
| `#FFFFFF` | `#ffffff` | styles/globals.css | 159 |
| `#EEF2F6` | `#eef2f6` | styles/globals.css | 160 |
| `#0B1F3A24` | `rgb(11 31 58 / 14%)` | styles/globals.css | 161 |
| `#0B1F3A` | `#0b1f3a` | styles/globals.css | 162 |
| `#5D6978` | `#5d6978` | styles/globals.css | 163 |
| `#0B1F3A` | `#0b1f3a` | styles/globals.css | 164 |
| `#12345C` | `#12345c` | styles/globals.css | 165 |
| `#7CB08D` | `#7cb08d` | styles/globals.css | 166 |
| `#94A3B8` | `#94a3b8` | styles/globals.css | 167 |
| `#D07F73` | `#d07f73` | styles/globals.css | 168 |
| `#6372CF` | `#6372cf` | styles/globals.css | 196 |
| `#FFFFFF38` | `rgba(255, 255, 255, 0.22)` | styles/globals.css | 232 |
| `#00000040` | `rgb(0 0 0 / 0.25)` | styles/globals.css | 235 |
| `#FFFFFF38` | `rgb(255 255 255 / 0.22)` | styles/globals.css | 244 |
| `#0000002E` | `rgb(0 0 0 / 0.18)` | styles/globals.css | 245 |
| `#0000001F` | `rgb(0 0 0 / 0.12)` | styles/globals.css | 246 |
| `#FFFFFF05` | `rgba(255, 255, 255, 0.02)` | styles/globals.css | 259 |
| `#00000029` | `rgb(0 0 0 / 0.16)` | styles/globals.css | 260 |
| `#FFFFFF47` | `rgb(255 255 255 / 0.28)` | styles/globals.css | 261 |
| `#000000` | `#000` | styles/globals.css | 265 |
| `#000000` | `#000` | styles/globals.css | 266 |
| `#000000` | `#000` | styles/globals.css | 269 |
| `#000000` | `#000` | styles/globals.css | 270 |
| `#FFFFFF38` | `rgb(255 255 255 / 0.22)` | styles/globals.css | 283 |
| `#FFFFFF38` | `rgb(255 255 255 / 0.22)` | styles/globals.css | 288 |
| `#0000003D` | `rgb(0 0 0 / 0.24)` | styles/globals.css | 289 |
| `#0000002E` | `rgb(0 0 0 / 0.18)` | styles/globals.css | 290 |
| `#FFFFFF24` | `rgba(255, 255, 255, 0.14)` | styles/globals.css | 296 |
| `#0000003D` | `rgb(0 0 0 / 0.24)` | styles/globals.css | 297 |
| `#FFFFFF47` | `rgb(255 255 255 / 0.28)` | styles/globals.css | 298 |
| `#85A3DBFF` | `#85a3dbff` | styles/markdown.css | 3 |
| `#7147F0FF` | `#7147f0ff` | styles/markdown.css | 4 |
| `#3B99F6FF` | `#3b99f6ff` | styles/markdown.css | 5 |
| `#0B1F3AFF` | `#0b1f3aff` | styles/markdown.css | 6 |
| `#0284C7FF` | `#0284c7ff` | styles/markdown.css | 7 |
| `#1FB1FFFF` | `#1fb1ffff` | styles/markdown.css | 8 |
| `#000000FF` | `#000000ff` | styles/markdown.css | 9 |
| `#2974FFFF` | `#2974ffff` | styles/markdown.css | 13 |
| `#7147F0FF` | `#7147f0ff` | styles/markdown.css | 14 |
| `#3B99F6FF` | `#3b99f6ff` | styles/markdown.css | 15 |
| `#3B82F6FF` | `#3b82f6ff` | styles/markdown.css | 16 |
| `#0284C7FF` | `#0284c7ff` | styles/markdown.css | 17 |
| `#1FB1FFFF` | `#1fb1ffff` | styles/markdown.css | 18 |
| `#FFFFFFFF` | `#ffffffff` | styles/markdown.css | 19 |
