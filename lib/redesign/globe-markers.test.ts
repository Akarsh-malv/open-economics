import { expect, test } from "vitest";
import { globeCountries } from "./globe-countries";
import { createGlobeMarkers, GLOBE_MARKER_COUNT } from "./globe-markers";

test("places exactly 97 globe dots while retaining the named country markers", () => {
  const markers = createGlobeMarkers();
  expect(markers).toHaveLength(97);
  expect(GLOBE_MARKER_COUNT).toBe(97);
  expect(markers.slice(0, globeCountries.length).map(marker => marker.name))
    .toEqual(globeCountries.map(country => country.name));
  expect(new Set(markers.map(marker => `${marker.latitude},${marker.longitude}`)).size).toBe(97);
});

test("places illustrative dots on the supplied land mask", () => {
  const markers = createGlobeMarkers((_latitude, longitude) => longitude > 0);
  expect(markers).toHaveLength(97);
  expect(markers.slice(globeCountries.length).every(marker => marker.longitude > 0)).toBe(true);
});
