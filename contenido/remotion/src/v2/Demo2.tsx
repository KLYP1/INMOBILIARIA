import React from "react";
import {AbsoluteFill, Audio, Easing, interpolate, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {fontFamily, INK_A, RED, WordCaptions} from "./kit";
import {CornerLabel} from "../ui";
import {DEMO_WORDS} from "./words";
import {Ambient, Float} from "./Ambient";

export const DEMO_LEN = 53.2;

// Details named in the voice-over: [start, end, box x,y,w,h (page px), label, zoom, label side]
type Focus = {a: number; b: number; box: [number, number, number, number]; label: string; zoom: number; below?: boolean; boxAt: number};
const FOCUS: Focus[] = [
	{a: 8.55, b: 10.2, boxAt: 9.05, box: [745, 739, 529, 81], label: "Responde en segundos", zoom: 1.45},
	{a: 18.3, b: 20.2, boxAt: 18.9, box: [1337, 625, 238, 37], label: "Califica solo", zoom: 1.55},
	{a: 22.75, b: 24.4, boxAt: 23.2, box: [1206, 113, 233, 42], label: "Tu inventario", zoom: 1.5, below: true},
	{a: 32.5, b: 36.35, boxAt: 33.0, box: [524, 428, 107, 72], label: "Agenda sola", zoom: 1.5},
	{a: 39.85, b: 44.45, boxAt: 40.3, box: [1385, 773, 470, 91], label: "Aviso al asesor", zoom: 1.4},
];

const ease = Easing.inOut(Easing.cubic);
const view = (t: number) => {
	for (const f of FOCUS) {
		if (t < f.a || t > f.b) continue;
		const k = Math.min(
			interpolate(t, [f.a, f.a + 0.6], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease}),
			interpolate(t, [f.b - 0.35, f.b], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease}),
		);
		const sc = 1 + (f.zoom - 1) * k;
		const [x, y, w, h] = f.box;
		const hw = 960 / f.zoom, hh = 540 / f.zoom;
		const cx = Math.min(Math.max(x + w / 2, hw), 1920 - hw);
		const cy = Math.min(Math.max(y + h / 2 + (f.below ? 30 : -30), hh), 1080 - hh);
		return {sc, fx: 960 + (cx - 960) * k, fy: 540 + (cy - 540) * k, f, k};
	}
	return {sc: 1, fx: 960, fy: 540, f: null as Focus | null, k: 0};
};

const Highlight: React.FC<{f: Focus; t: number; frame: number; fps: number}> = ({f, t, frame, fps}) => {
	const out = interpolate(t, [f.b - 0.3, f.b - 0.05], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
	const draw = interpolate(t, [f.boxAt, f.boxAt + 0.45], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});
	if (draw <= 0 || out <= 0) return null;
	const pad = 10;
	const [x, y, w, h] = f.box;
	const W = w + pad * 2, H = h + pad * 2;
	const pop = spring({frame: frame - Math.round((f.boxAt + 0.25) * fps), fps, config: {damping: 13, stiffness: 190}});
	return (
		<>
			<svg style={{position: "absolute", left: x - pad, top: y - pad, overflow: "visible", opacity: out}} width={W} height={H}>
				<rect x={0} y={0} width={W} height={H} rx={12} fill="rgba(229,50,45,0.06)" stroke={RED} strokeWidth={3.5}
					pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} style={{filter: "drop-shadow(0 0 6px rgba(229,50,45,0.35))"}} />
			</svg>
			<div
				style={{
					position: "absolute",
					left: x - pad,
					top: f.below ? y + h + pad + 12 : undefined,
					bottom: f.below ? undefined : 1080 - (y - pad) + 12,
					fontFamily,
					fontWeight: 650,
					fontSize: 26,
					color: "#fff",
					background: RED,
					padding: "8px 16px 9px",
					borderRadius: 999,
					whiteSpace: "nowrap",
					boxShadow: "0 6px 18px rgba(229,50,45,0.35)",
					opacity: Math.min(1, pop * 1.4) * out,
					transform: `translateY(${(1 - pop) * (f.below ? -10 : 10)}px) scale(${0.85 + 0.15 * pop})`,
					transformOrigin: "left center",
				}}
			>
				{f.label}
			</div>
		</>
	);
};

// Voice-over pieces of the demo take (face_demo.mp4 = picture + cleaned voice): [demoStart, srcStart, frames]
const VO: [number, number, number][] = [
	[0, 0, 410],
	[410, 427, 197],
	[607, 637, 489],
	[1096, 1697, 500],
];

const BUB = {size: 220, right: 44, bottom: 40};

// Small animated chips above the bubble (empty right margin of the panel), following what she says.
const CX = 1920 - BUB.right - BUB.size / 2 - 50, CY = 1080 - BUB.bottom - BUB.size - 125;
const chip = (from: number, to: number, icon: Float["icon"]): Float => ({from, to, icon, x: CX, y: CY, size: 100});
const CHIPS: Float[] = [
	chip(2.8, 7.1, "chat"),
	chip(7.25, 10.2, "bolt"),
	chip(10.4, 14.6, "user"),
	chip(14.8, 20.2, "check"),
	chip(20.5, 24.4, "excel"),
	chip(24.6, 29.4, "star"),
	chip(29.7, 36.4, "calendar"),
	chip(36.75, 39.0, "phone"),
	chip(44.7, 48.9, "check"),
	chip(49.1, 52.2, "chat"),
];

/** Her face: full frame at the start, shrinks to a circular bubble, grows back at the end. */
const Bubble: React.FC<{t: number}> = ({t}) => {
	const k = Math.min(
		interpolate(t, [0.15, 1.05], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease}),
		interpolate(t, [DEMO_LEN - 0.95, DEMO_LEN - 0.05], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease}),
	);
	const lerp = (a: number, b: number) => a + (b - a) * k;
	const bx = 1920 - BUB.right - BUB.size, by = 1080 - BUB.bottom - BUB.size;
	const left = lerp(0, bx), top = lerp(0, by), w = lerp(1920, BUB.size), h = lerp(1080, BUB.size);
	// her face sits at ~(1025, 450) in this take (measured with a face detector); centre a head-and-shoulders crop on it
	const SMALL = 0.42, FX = 1025, FY = 470;
	const s = lerp(1, SMALL);
	const vx = lerp(0, BUB.size / 2 - FX * SMALL), vy = lerp(0, BUB.size / 2 - FY * SMALL);
	return (
		<div
			style={{
				position: "absolute",
				left,
				top,
				width: w,
				height: h,
				borderRadius: lerp(0, BUB.size / 2),
				overflow: "hidden",
				border: `${lerp(0, 4)}px solid #fff`,
				boxShadow: `0 ${lerp(0, 14)}px ${lerp(0, 34)}px rgba(10,12,16,${lerp(0, 0.28)})`,
				background: "#ddd",
			}}
		>
			<div style={{position: "absolute", left: vx, top: vy, width: 1920 * s, height: 1080 * s}}>
				{VO.map(([d, src, n], i) => (
					<Sequence key={i} from={d} durationInFrames={n} layout="none">
						<OffthreadVideo src={staticFile("v2_face_demo.mp4")} trimBefore={src} style={{width: "100%", height: "100%"}} />
					</Sequence>
				))}
			</div>
		</div>
	);
};

export const Demo2: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;
	const {sc, fx, fy, f} = view(t);
	return (
		<AbsoluteFill style={{backgroundColor: "#fff", overflow: "hidden"}}>
			<AbsoluteFill style={{transformOrigin: "0 0", transform: `translate(${960 - fx * sc}px, ${540 - fy * sc}px) scale(${sc})`}}>
				<OffthreadVideo src={staticFile("v2_demo.mp4")} muted />
				{f && <Highlight f={f} t={t} frame={frame} fps={fps} />}
			</AbsoluteFill>
			<CornerLabel text="Proyecto de ejemplo" />
			{FOCUS.map((g, i) => (
				<Sequence key={i} from={Math.round((g.boxAt + 0.25) * fps)}><Audio src={staticFile("sfx_pop.wav")} volume={0.13} /></Sequence>
			))}
			<Sequence from={Math.round(35.78 * fps)}><Audio src={staticFile("sfx_click.wav")} volume={0.35} /></Sequence>
			<Sequence from={0}><Audio src={staticFile("sfx_whoosh.wav")} volume={0.13} /></Sequence>
			<Sequence from={Math.round((DEMO_LEN - 0.95) * fps)}><Audio src={staticFile("sfx_whoosh.wav")} volume={0.13} /></Sequence>
			<Ambient items={CHIPS} dust={false} />
			<Bubble t={t} />
			<WordCaptions words={DEMO_WORDS} srcAt0={0} bottom={150} />
		</AbsoluteFill>
	);
};
