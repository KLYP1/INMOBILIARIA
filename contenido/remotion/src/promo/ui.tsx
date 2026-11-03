import React from "react";
import {Easing, interpolate, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {loadFont} from "@remotion/fonts";

// Tokens copied from the live demo (modo noche) — demo-klyp.vercel.app
export const K = {
	noche: "#0e0f11",
	grafito: "#17191c",
	elevado: "#202226",
	acero: "#2a2d31",
	cristal: "rgba(23,25,28,0.80)",
	borde: "rgba(255,255,255,0.08)",
	texto: "#f2f0ec",
	suave: "#c4c4c4",
	tenue: "#a3a6ac",
	rojo: "#f23a3f",
	rojoBoton: "#c91514",
	exito: "#3fb68b",
	celeste: "#98d3f3",
	pendiente: "#e8a33d",
	violeta: "#8b6fe0",
	info: "#7fa6f2",
};
export const SANS = "InterTightUI", MONO = "JetBrainsUI";
loadFont({family: SANS, url: staticFile("fonts/inter-tight-latin-400-normal.woff2"), weight: "400"});
loadFont({family: SANS, url: staticFile("fonts/inter-tight-latin-500-normal.woff2"), weight: "500"});
loadFont({family: SANS, url: staticFile("fonts/inter-tight-latin-600-normal.woff2"), weight: "600"});
loadFont({family: MONO, url: staticFile("fonts/jetbrains-mono-latin-400-normal.woff2"), weight: "400"});

export const EASE = Easing.bezier(0.22, 1, 0.36, 1); // --klyp-ease
// Voice-over sync: the scenes were designed on a 27.6 s timeline ("design time"); her recording drives the real clock.
// Anchors [design, real] — real times come from the word timestamps of promo_voz.wav.
const WARP: [number, number][] = [
	[0, 0], [0.55, 0.5], [2.65, 3.2], [2.75, 3.35], [3.05, 3.75], [4.1, 4.45], [5.0, 4.9], [5.85, 5.35], [7.25, 5.95], [8.0, 6.3],
	[8.75, 6.6], [9.0, 8.2], [9.25, 9.45], [9.6, 9.9], [10.45, 10.2], [10.6, 10.35], [11.0, 10.75], [11.35, 11.5], [11.65, 12.2],
	[13.6, 13.6], [13.9, 13.9], [14.4, 14.7], [14.45, 14.75], [15.1, 15.0], [15.6, 15.3], [16.05, 15.55], [16.6, 15.9], [17.3, 16.35],
	[18.0, 16.8], [18.55, 17.2], [19.85, 18.1], [20.05, 18.3], [20.1, 18.35], [20.45, 19.35], [20.8, 20.35], [24.3, 21.7], [24.4, 21.75],
	[24.6, 21.85], [25.0, 22.05], [25.25, 22.25], [25.9, 22.5], [26.2, 23.45], [27.6, 25.6],
];
const lerpMap = (x: number, from: 0 | 1) => {
	const to = 1 - from;
	if (x <= WARP[0][from]) return x;
	for (let i = 1; i < WARP.length; i++) {
		const a = WARP[i - 1], b = WARP[i];
		if (x <= b[from]) return a[to] + ((x - a[from]) / (b[from] - a[from])) * (b[to] - a[to]);
	}
	const l = WARP[WARP.length - 1];
	return l[to] + (x - l[from]);
};
/** design time → real time (for sound cues) */
export const toReal = (d: number) => lerpMap(d, 0);
/** current design time */
export const useT = () => lerpMap(useCurrentFrame() / useVideoConfig().fps, 1);
/** 0→1 over `d` seconds from `at`, demo easing. */
export const k01 = (t: number, at: number, d = 0.42) => interpolate(t, [at, at + d], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE});
export const kOut = (t: number, at: number, d = 0.3) => interpolate(t, [at, at + d], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic)});

export const glass = (r = 48): React.CSSProperties => ({
	background: K.cristal,
	border: `2px solid ${K.borde}`,
	borderRadius: r,
	backdropFilter: "blur(32px)",
	boxShadow: "0 60px 140px -56px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.04)",
});

export const Mono: React.FC<{children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties}> = ({children, size = 22, color = K.tenue, style}) => (
	<div style={{fontFamily: MONO, fontSize: size, letterSpacing: size * 0.18, textTransform: "uppercase", color, ...style}}>{children}</div>
);

export const Pill: React.FC<{children: React.ReactNode; color: string; size?: number; style?: React.CSSProperties}> = ({children, color, size = 24, style}) => (
	<span style={{display: "inline-flex", alignItems: "center", gap: 8, fontFamily: SANS, fontWeight: 500, fontSize: size, color, background: `${color}24`, border: `1.5px solid ${color}55`, borderRadius: 999, padding: `${size * 0.28}px ${size * 0.7}px`, whiteSpace: "nowrap", ...style}}>{children}</span>
);

export const Avatar: React.FC<{ini: string; size?: number}> = ({ini, size = 72}) => (
	<div style={{width: size, height: size, borderRadius: 999, background: K.acero, border: `1.5px solid ${K.borde}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontSize: size * 0.3, color: K.suave, flexShrink: 0}}>{ini}</div>
);

type IconP = {size?: number; color?: string};
export const IgIcon: React.FC<IconP> = ({size = 40, color = K.texto}) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.3" cy="6.7" r="0.6" fill={color} /></svg>
);
export const MsgrIcon: React.FC<IconP> = ({size = 40, color = K.texto}) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinejoin="round"><path d="M12 3C7 3 3 6.7 3 11.4c0 2.6 1.2 4.9 3.2 6.4V21l3-1.6c.9.2 1.8.4 2.8.4 5 0 9-3.7 9-8.4S17 3 12 3z" /><path d="M7.5 13.5l3-3 2.4 2 3.6-3.5-3 3.2-2.4-2z" fill={color} /></svg>
);
export const WaIcon: React.FC<IconP> = ({size = 40, color = K.texto}) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinejoin="round"><path d="M3.5 20.5l1.3-4.2A8.6 8.6 0 1 1 8 19.4z" /><path d="M9 8.6c.2-.5.5-.5.8-.5h.5l.9 2-.6.8c.5 1 1.3 1.8 2.3 2.3l.8-.6 2 .9v.5c0 .4-.2.8-.6 1-.9.5-2.3.3-3.9-.9-1.6-1.2-2.6-2.7-2.6-3.8 0-.6.2-1.2.4-1.7z" fill={color} stroke="none" /></svg>
);
export const Check: React.FC<IconP> = ({size = 28, color = K.exito}) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.2 4.2L19 7" /></svg>
);
export const CalIcon: React.FC<IconP> = ({size = 32, color = K.texto}) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round"><rect x="3.5" y="5" width="17" height="15.5" rx="3" /><path d="M8 3v4M16 3v4M3.5 10h17" /></svg>
);

/** Three bouncing dots (typing). */
export const Typing: React.FC<{t: number; from: number}> = ({t, from}) => (
	<div style={{display: "flex", gap: 10, padding: "26px 30px"}}>
		{[0, 1, 2].map((i) => {
			const y = Math.sin((t - from) * 9 - i * 0.9);
			return <div key={i} style={{width: 14, height: 14, borderRadius: 99, background: K.suave, opacity: 0.45 + 0.4 * Math.max(0, y), transform: `translateY(${-Math.max(0, y) * 6}px)`}} />;
		})}
	</div>
);
