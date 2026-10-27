"use client";

import { useEffect, useRef } from "react";
import { globeCountries } from "@/lib/redesign/globe-countries";
import { createGlobeMarkers, GLOBE_MARKER_COUNT, type GlobeMarker } from "@/lib/redesign/globe-markers";
import styles from "./network-globe.module.css";

const SIZE = 500;
const CENTER = SIZE / 2;
const RADIUS = 212;
const TILT = 13 * Math.PI / 180;
const DEG = Math.PI / 180;
type Point = { name: string | null; x: number; y: number; depth: number };

function project(latitude: number, longitude: number, centerLongitude: number) {
  const lat = latitude * DEG, delta = (longitude - centerLongitude) * DEG;
  const cosLat = Math.cos(lat);
  const depth = Math.sin(TILT) * Math.sin(lat) + Math.cos(TILT) * cosLat * Math.cos(delta);
  return {
    x: CENTER + RADIUS * cosLat * Math.sin(delta),
    y: CENTER - RADIUS * (Math.cos(TILT) * Math.sin(lat) - Math.sin(TILT) * cosLat * Math.cos(delta)),
    depth,
  };
}

function drawGrid(ctx: CanvasRenderingContext2D, longitude: number) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(CENTER, CENTER, RADIUS, 0, Math.PI * 2);
  ctx.clip();
  ctx.strokeStyle = "rgba(191,226,239,.18)";
  ctx.lineWidth = .7;
  const trace = (coordinates: { latitude: number; longitude: number }[]) => {
    let drawing = false;
    ctx.beginPath();
    for (const coordinate of coordinates) {
      const point = project(coordinate.latitude, coordinate.longitude, longitude);
      if (point.depth <= 0) { drawing = false; continue; }
      if (drawing) ctx.lineTo(point.x, point.y);
      else ctx.moveTo(point.x, point.y);
      drawing = true;
    }
    ctx.stroke();
  };
  for (const latitude of [-60, -30, 0, 30, 60])
    trace(Array.from({ length: 181 }, (_, i) => ({ latitude, longitude: longitude - 90 + i })));
  for (let offset = -90; offset <= 90; offset += 30)
    trace(Array.from({ length: 171 }, (_, i) => ({ latitude: -85 + i, longitude: longitude + offset })));
  ctx.restore();
}

function drawCountries(ctx: CanvasRenderingContext2D, longitude: number, highlighted: string | null, markers: GlobeMarker[]) {
  const visible: Point[] = markers.flatMap(marker => {
    const point = project(marker.latitude, marker.longitude, longitude);
    return point.depth > .13 ? [{ name: marker.name, ...point }] : [];
  }).sort((a, b) => b.depth - a.depth);
  for (const point of visible) {
    ctx.beginPath();
    ctx.arc(point.x, point.y, point.name && point.name === highlighted ? 8 : point.name ? 5.2 : 3.6, 0, Math.PI * 2);
    ctx.fillStyle = point.name ? "rgba(153,245,236,.26)" : "rgba(153,245,236,.18)";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(point.x, point.y, point.name ? 2.3 : 1.7, 0, Math.PI * 2);
    ctx.fillStyle = point.name ? "#ddfbf6" : "#c7f2ec";
    ctx.fill();
  }
  ctx.font = "500 10px system-ui, sans-serif";
  ctx.textBaseline = "middle";
  for (const point of visible) {
    if (!point.name || point.name !== highlighted) continue;
    const width = ctx.measureText(point.name).width + 12;
    const candidates = [
      { left: point.x + 7, top: point.y - 7 },
      { left: point.x - width - 7, top: point.y - 7 },
      { left: point.x - width / 2, top: point.y - 23 },
      { left: point.x - width / 2, top: point.y + 8 },
    ];
    const box = candidates.find(candidate => {
      const right = candidate.left + width, bottom = candidate.top + 15;
      if (candidate.left < CENTER - RADIUS + 4 || right > CENTER + RADIUS - 4 ||
          candidate.top < CENTER - RADIUS + 4 || bottom > CENTER + RADIUS - 4) return false;
      return true;
    });
    if (!box) continue;
    ctx.fillStyle = "rgba(5,25,45,.94)";
    ctx.beginPath();
    ctx.roundRect(box.left, box.top, width, 15, 3);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.fillText(point.name, box.left + 6, box.top + 7.5);
  }
  return visible.filter(point => point.name !== null);
}

export function NetworkGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const mapCanvas = document.createElement("canvas");
    mapCanvas.width = 800;
    mapCanvas.height = 330;
    const mapContext = mapCanvas.getContext("2d", { willReadFrequently: true });
    let mapPixels: Uint8ClampedArray | null = null;
    let markers = createGlobeMarkers();
    const map = new Image();
    map.onload = () => {
      if (!mapContext) return;
      mapContext.drawImage(map, 0, 0, 800, 330);
      mapPixels = mapContext.getImageData(0, 0, 800, 330).data;
      markers = createGlobeMarkers((latitude, longitude) => {
        const x = Math.min(799, Math.max(0, Math.floor((longitude + 180) * 800 / 360)));
        const y = Math.round(186.7 - latitude * 800 / 360);
        return y >= 0 && y < 330 && mapPixels![(y * 800 + x) * 4 + 3] > 30;
      });
    };
    map.src = "/design-assets/world-map-globe.svg";

    const globe = ctx.createImageData(SIZE, SIZE);
    const pixels = globe.data;
    const samples: { index: number; delta: number; mapY: number; light: number }[] = [];
    const sinTilt = Math.sin(TILT), cosTilt = Math.cos(TILT);
    for (let y = CENTER - RADIUS; y <= CENTER + RADIUS; y++) {
      const north = (CENTER - y) / RADIUS;
      for (let x = CENTER - RADIUS; x <= CENTER + RADIUS; x++) {
        const east = (x - CENTER) / RADIUS;
        if (east * east + north * north > 1) continue;
        const front = Math.sqrt(1 - east * east - north * north);
        const latitude = Math.asin(north * cosTilt + front * sinTilt) / DEG;
        const delta = Math.atan2(east, front * cosTilt - north * sinTilt) / DEG;
        samples.push({
          index: (y * SIZE + x) * 4, delta,
          mapY: Math.round(186.7 - latitude * 800 / 360),
          light: .48 + .42 * front + .1 * Math.max(0, north),
        });
      }
    }

    let longitude = -25, frame = 0, previous = 0;
    let dragging = false, paused = false, lastX = 0;
    let highlighted: string | null = null;
    let visible: Point[] = [];
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const render = (time: number) => {
      frame = requestAnimationFrame(render);
      if (time - previous < 40) return;
      const elapsed = previous ? Math.min(100, time - previous) : 0;
      previous = time;
      if (!paused && !reduceMotion.matches) longitude = (longitude + elapsed * 360 / 72000) % 360;
      pixels.fill(0);
      for (const sample of samples) {
        const mapX = Math.min(799, Math.floor(((longitude + sample.delta + 180 + 720) % 360) * 800 / 360));
        const source = (sample.mapY * 800 + mapX) * 4;
        const land = mapPixels && sample.mapY >= 0 && sample.mapY < 330 && mapPixels[source + 3] > 30;
        const i = sample.index, shade = sample.light;
        pixels[i] = Math.round((land ? 158 : 22) * shade);
        pixels[i + 1] = Math.round((land ? 182 : 58) * shade);
        pixels[i + 2] = Math.round((land ? 196 : 91) * shade);
        pixels[i + 3] = 255;
      }
      ctx.putImageData(globe, 0, 0);
      drawGrid(ctx, longitude);
      visible = drawCountries(ctx, longitude, highlighted, markers);
    };
    const locate = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      const x = (event.clientX - bounds.left) * SIZE / bounds.width;
      const y = (event.clientY - bounds.top) * SIZE / bounds.height;
      return { x, y, country: visible.find(point => Math.hypot(point.x - x, point.y - y) < 13) };
    };
    const down = (event: PointerEvent) => {
      const target = locate(event);
      if (target.country) { highlighted = target.country.name; paused = true; }
      else if (Math.hypot(target.x - CENTER, target.y - CENTER) < RADIUS) {
        dragging = true; paused = true; lastX = event.clientX;
        canvas.setPointerCapture(event.pointerId);
      }
    };
    const move = (event: PointerEvent) => {
      if (dragging) { longitude -= (event.clientX - lastX) * .3; lastX = event.clientX; }
      else {
        highlighted = locate(event).country?.name ?? null;
        paused = !!highlighted;
        canvas.style.cursor = highlighted ? "pointer" : "grab";
      }
    };
    const up = () => { dragging = false; paused = false; };
    const leave = () => { if (!dragging) { highlighted = null; paused = false; } };
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);
    canvas.addEventListener("pointerleave", leave);
    frame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frame);
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
      canvas.removeEventListener("pointerleave", leave);
      map.onload = null;
    };
  }, []);
  return <div className={`world-art ${styles.art}`} data-network-globe data-marker-count={GLOBE_MARKER_COUNT}>
    <svg className={styles.frame} viewBox="0 0 800 650" aria-hidden="true">
      <circle cx="415" cy="310" r="288" fill="none" stroke="#b7d8e51a" />
      <circle cx="415" cy="310" r="254" fill="none" stroke="#a9d8e8" strokeWidth="1" opacity=".5" />
    </svg>
    <canvas ref={canvasRef} className={styles.canvas} width={SIZE} height={SIZE} role="img"
      aria-label={`Rotating globe with ${GLOBE_MARKER_COUNT} illustrative dots, including named markers for ${globeCountries.map(country => country.name).join(", ")}. Drag to rotate.`} />
  </div>;
}
