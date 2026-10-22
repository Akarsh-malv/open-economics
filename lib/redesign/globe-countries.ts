/** Owner-selected countries. Coordinates are representative points, not program addresses. */
export const globeCountries = [
  { code: "BD", name: "Bangladesh", latitude: 23.81, longitude: 90.41 },
  { code: "BE", name: "Belgium", latitude: 50.85, longitude: 4.35 },
  { code: "CN", name: "China", latitude: 39.90, longitude: 116.40 },
  { code: "FI", name: "Finland", latitude: 60.17, longitude: 24.94 },
  { code: "DE", name: "Germany", latitude: 52.52, longitude: 13.40 },
  { code: "GH", name: "Ghana", latitude: 5.60, longitude: -0.19 },
  { code: "IN", name: "India", latitude: 28.61, longitude: 77.21 },
  { code: "ID", name: "Indonesia", latitude: -6.21, longitude: 106.85 },
  { code: "KZ", name: "Kazakhstan", latitude: 51.17, longitude: 71.43 },
  { code: "MY", name: "Malaysia", latitude: 3.14, longitude: 101.69 },
  { code: "MX", name: "Mexico", latitude: 19.43, longitude: -99.13 },
  { code: "NP", name: "Nepal", latitude: 27.72, longitude: 85.32 },
  { code: "RO", name: "Romania", latitude: 44.43, longitude: 26.10 },
  { code: "SA", name: "Saudi Arabia", latitude: 24.71, longitude: 46.68 },
  { code: "SG", name: "Singapore", latitude: 1.35, longitude: 103.82 },
  { code: "SK", name: "Slovakia", latitude: 48.15, longitude: 17.11 },
  { code: "KR", name: "South Korea", latitude: 37.57, longitude: 126.98 },
  { code: "CH", name: "Switzerland", latitude: 46.95, longitude: 7.45 },
  { code: "TW", name: "Taiwan", latitude: 25.03, longitude: 121.56 },
  { code: "TH", name: "Thailand", latitude: 13.76, longitude: 100.50 },
  { code: "UA", name: "Ukraine", latitude: 50.45, longitude: 30.52 },
  { code: "AE", name: "United Arab Emirates", latitude: 25.20, longitude: 55.27 },
  { code: "GB", name: "United Kingdom", latitude: 51.51, longitude: -0.13 },
  { code: "US", name: "United States", latitude: 39.83, longitude: -98.58 },
  { code: "VN", name: "Vietnam", latitude: 21.03, longitude: 105.83 },
] as const;
export type GlobeCountryCode = (typeof globeCountries)[number]["code"];

/** The existing SVG uses equirectangular coordinates, then a centered 620×400 image. */
export function projectGlobePoint(latitude: number, longitude: number) {
  const mapX = 400 + longitude * 800 / 360;
  const mapY = 186.7 - latitude * 800 / 360;
  return { x: 115 + mapX * 620 / 800, y: 110 + (400 - 330 * 620 / 800) / 2 + mapY * 620 / 800 };
}

/** Illustrative connections, deliberately sparser than a route for every country. */
export const globeConnections: readonly (readonly [GlobeCountryCode, GlobeCountryCode])[] = [
  ["US", "MX"], ["US", "GB"], ["GB", "DE"], ["GB", "FI"],
  ["DE", "RO"], ["GB", "GH"], ["RO", "KZ"], ["KZ", "CN"],
  ["GB", "IN"], ["IN", "SA"], ["SA", "AE"], ["IN", "SG"],
  ["SG", "ID"], ["SG", "VN"], ["CN", "KR"], ["CN", "TW"],
];
