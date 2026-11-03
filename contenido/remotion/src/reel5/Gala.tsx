import React from "react";
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {loadFont} from "@remotion/fonts";
import {RED} from "../reel/brand";
import {W} from "../reel/Subs";

// Editorial look (ref: @gala.emprendeia): ultra-condensed caps for key words, thin tight sans for the rest, giant thin numerals.
export const COND = "LeagueGothic", THIN = "InterTight", NUM = "OswaldThin";
loadFont({family: COND, url: staticFile("fonts/league-gothic-latin-400-normal.woff2"), weight: "400"});
loadFont({family: THIN, url: staticFile("fonts/inter-tight-latin-300-normal.woff2"), weight: "300"});
loadFont({family: THIN, url: staticFile("fonts/inter-tight-latin-400-normal.woff2"), weight: "400"});
loadFont({family: THIN, url: staticFile("fonts/inter-tight-latin-300-italic.woff2"), weight: "300", style: "italic"});
loadFont({family: NUM, url: staticFile("fonts/oswald-latin-200-normal.woff2"), weight: "200"});

export const MAROON = "#2B0202", CREAM = "#ECEAE0", INK = "#0A0A0A";

export const useT = () => useCurrentFrame() / useVideoConfig().fps;
export const on = (t: number, a: number, b: number) => t >= a && t < b;

/** Snappy appear: 0.14 s from blurred + slightly big to sharp. `blur` widens it for the slower "focus-in" titles. */
export const popStyle = (t: number, at: number, dur = 0.14, blur = 8): React.CSSProperties => {
	const k = interpolate(t, [at, at + dur], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});
	return {opacity: t < at ? 0 : Math.min(1, k * 1.6), transform: `scale(${1.08 - 0.08 * k})`, filter: k < 1 ? `blur(${(1 - k) * blur}px)` : undefined};
};

/** A word that pops in at `at` (inline). */
export const Pw: React.FC<{t: number; at: number; style?: React.CSSProperties; children: React.ReactNode; dur?: number; blur?: number}> = ({t, at, style, children, dur, blur}) => (
	<span style={{display: "inline-block", ...style, ...popStyle(t, at, dur, blur)}}>{children}</span>
);

export const cond = (size: number, color: string, extra: React.CSSProperties = {}): React.CSSProperties => ({
	fontFamily: COND, fontSize: size, lineHeight: 0.86, color, textTransform: "uppercase", letterSpacing: size * 0.005, ...extra,
});
export const thin = (size: number, color: string, extra: React.CSSProperties = {}): React.CSSProperties => ({
	fontFamily: THIN, fontWeight: 300, fontSize: size, lineHeight: 1.05, color, letterSpacing: -size * 0.035, ...extra,
});

/** Captions: the current 1–4 words in thin white, each word appearing as spoken; KEY words jump to big condensed caps. */
export const GalaSubs: React.FC<{lines: W[][]; keys: Record<string, string>; hide: [number, number][]; y: number}> = ({lines, keys, hide, y}) => {
	const t = useT();
	if (hide.some(([a, b]) => on(t, a, b))) return null;
	const idx = lines.findIndex((L, i) => t >= L[0][1] - 0.03 && t < (lines[i + 1]?.[0][1] ?? L[L.length - 1][2] + 0.5) - 0.03);
	if (idx < 0) return null;
	const L = lines[idx];
	return (
		<AbsoluteFill style={{pointerEvents: "none"}}>
			<div style={{position: "absolute", left: 50, right: 50, top: y, display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "baseline", columnGap: 18, rowGap: 0}}>
				{L.map(([w, a], i) => {
					const key = keys[w];
					const s = key
						? cond(190, key === "r" ? RED : "#fff", {textShadow: "0 4px 24px rgba(0,0,0,0.25)"})
						: thin(66, "#fff", {textShadow: "0 2px 14px rgba(0,0,0,0.45)"});
					return <Pw key={i} t={t} at={a - 0.03} style={s}>{key ? w.replace(/[.,]$/, "") : w}</Pw>;
				})}
			</div>
		</AbsoluteFill>
	);
};

/** Giant thin red numeral with the question building underneath in thin italics (quoted). */
export const BigNum: React.FC<{from: number; to: number; n: string; words: [string, number][]}> = ({from, to, n, words}) => {
	const t = useT();
	if (!on(t, from, to)) return null;
	return (
		<AbsoluteFill style={{pointerEvents: "none"}}>
			<div style={{position: "absolute", left: 0, right: 0, top: 1030, textAlign: "center", fontFamily: NUM, fontWeight: 200, fontSize: 470, lineHeight: 1, color: RED, ...popStyle(t, from, 0.16, 14)}}>{n}</div>
			<div style={{position: "absolute", left: 60, right: 60, top: 1380, display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: 14}}>
				{words.map(([w, a], i) => (
					<Pw key={i} t={t} at={a - 0.03} style={thin(72, "#fff", {fontStyle: "italic", textShadow: "0 2px 16px rgba(0,0,0,0.5)"})}>
						{i === 0 ? "“" + w : i === words.length - 1 ? w + "”" : w}
					</Pw>
				))}
			</div>
		</AbsoluteFill>
	);
};

/** Full-bleed b-roll still, black & white, slow push-in. */
export const Broll: React.FC<{from: number; to: number; src: string; children?: React.ReactNode}> = ({from, to, src, children}) => {
	const t = useT();
	if (!on(t, from, to)) return null;
	const z = interpolate(t, [from, to], [1.02, 1.1]);
	return (
		<AbsoluteFill style={{backgroundColor: INK, overflow: "hidden"}}>
			<Img src={staticFile(src)} style={{width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z})`, filter: "grayscale(1) contrast(1.18) brightness(0.78)"}} />
			<AbsoluteFill style={{background: "linear-gradient(180deg, rgba(0,0,0,0.0) 30%, rgba(0,0,0,0.35) 100%)"}} />
			{children}
		</AbsoluteFill>
	);
};

/** Solid colour card (maroon or cream) with stacked condensed words that focus in as she says them. */
export const ColorCard: React.FC<{from: number; to: number; bg: string; children: React.ReactNode}> = ({from, to, bg, children}) => {
	const t = useT();
	if (!on(t, from, to)) return null;
	return <AbsoluteFill style={{backgroundColor: bg, justifyContent: "center", alignItems: "center", textAlign: "center"}}>{children}</AbsoluteFill>;
};

/** Three thin red circles (Venn) that draw in one by one with a label each. */
export const Venn: React.FC<{from: number; to: number; items: [string, number][]; cy?: number}> = ({from, to, items, cy = 250}) => {
	const t = useT();
	if (!on(t, from, to)) return null;
	const out = interpolate(t, [to - 0.2, to], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
	const r = 150, xs = [272, 540, 808];
	return (
		<AbsoluteFill style={{pointerEvents: "none", opacity: out}}>
			<svg width={1080} height={1920} style={{position: "absolute", left: 0, top: 0}}>
				{items.map(([, at], i) => {
					const d = interpolate(t, [at, at + 0.45], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});
					return <circle key={i} cx={xs[i]} cy={cy} r={r} fill={`rgba(225,6,0,${0.07 * d})`} stroke={RED} strokeWidth={3.5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - d} transform={`rotate(-90 ${xs[i]} ${cy})`} />;
				})}
			</svg>
			{items.map(([label, at], i) => (
				<div key={i} style={{position: "absolute", left: xs[i] - 110, width: 220, top: cy - 24, textAlign: "center", ...thin(38, INK, {fontWeight: 400}), ...popStyle(t, at + 0.15)}}>{label}</div>
			))}
		</AbsoluteFill>
	);
};
