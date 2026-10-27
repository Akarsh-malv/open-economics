import { globeCountries } from "./globe-countries";

export const GLOBE_MARKER_COUNT = 97;

export type GlobeMarker = {
  latitude: number;
  longitude: number;
  name: string | null;
};

function halton(index: number, base: number) {
  let value = 0;
  let fraction = 1 / base;
  while (index > 0) {
    value += fraction * (index % base);
    index = Math.floor(index / base);
    fraction /= base;
  }
  return value;
}

function separation(a: GlobeMarker, b: GlobeMarker) {
  const longitude = ((a.longitude - b.longitude + 540) % 360) - 180;
  return Math.hypot(
    a.latitude - b.latitude,
    longitude * Math.cos(((a.latitude + b.latitude) / 2) * Math.PI / 180),
  );
}

/** The extra dots are illustrative locations, not a claim about specific countries. */
export function createGlobeMarkers(isLand?: (latitude: number, longitude: number) => boolean): GlobeMarker[] {
  const markers: GlobeMarker[] = globeCountries.map(country => ({
    latitude: country.latitude,
    longitude: country.longitude,
    name: country.name,
  }));

  for (const minSeparation of [10, 6, 0]) {
    for (let index = 1; index <= 12000 && markers.length < GLOBE_MARKER_COUNT; index++) {
      const longitude = halton(index + 37, 2) * 360 - 180;
      const latitude = Math.asin(halton(index + 37, 3) * 2 - 1) * 180 / Math.PI;
      if (latitude < -60 || latitude > 75 || (isLand && !isLand(latitude, longitude))) continue;
      const marker = { latitude, longitude, name: null };
      if (minSeparation && markers.some(existing => separation(existing, marker) < minSeparation)) continue;
      markers.push(marker);
    }
  }

  // A missing or unreadable map must not change the requested dot count.
  for (let index = 12001; markers.length < GLOBE_MARKER_COUNT; index++) {
    markers.push({
      latitude: Math.asin(halton(index, 3) * 2 - 1) * 180 / Math.PI,
      longitude: halton(index, 2) * 360 - 180,
      name: null,
    });
  }
  return markers;
}
