import React from "react";
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {fontFamily, INK, RED} from "../ui";

export {fontFamily, INK, RED};
export const INK_A = "rgba(14,15,17,0.80)";

/** A spoken word: [text, start, end] in SOURCE seconds. A trailing "|" in the text ends the caption page. */
export type W = [string, number, number];

type Page = {words: W[]; s: number; e: number};
const toPages = (words: W[]): Page[] => {
	const pages: Page[] = [];
	let cur: W[] = [];
	for (const w of words) {
		const brk = w[0].endsWith("|");
		cur.push(brk ? [w[0].slice(0, -1), w[1], w[2]] : w);
		if (brk) {
			pages.push({words: cur, s: cur[0][1], e: cur[cur.length - 1][2]});
			cur = [];
		}
	}
	if (cur.length) pages.push({words: cur, s: cur[0][1], e: cur[cur.length - 1][2]});
	// hold each page until the next one starts (max 0.6 s of hold) so the box does not flicker between phrases
	return pages.map((p, i) => ({...p, e: Math.min(pages[i + 1]?.s ?? p.e + 0.4, p.e + 0.6)}));
};

/** Word-by-word captions; the word being spoken is red. `srcAt0` = source second shown at this sequence's frame 0. */
export const WordCaptions: React.FC<{words: W[]; srcAt0: number; bottom?: number; hide?: [number, number][]}> = ({words, srcAt0, bottom = 62, hide = []}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = srcAt0 + frame / fps;
	if (hide.some(([a, b]) => t >= a && t < b)) return null;
	const page = toPages(words).find((p) => t >= p.s - 0.05 && t < p.e);
	if (!page) return null;
	const o = interpolate(t, [page.s - 0.05, page.s + 0.08], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
	return (
		<AbsoluteFill style={{justifyContent: "flex-end", alignItems: "center", paddingBottom: bottom, pointerEvents: "none"}}>
			<div
				style={{
					fontFamily,
					fontWeight: 600,
					fontSize: 44,
					lineHeight: 1.3,
					color: "#fff",
					background: INK_A,
					padding: "12px 26px 14px",
					borderRadius: 14,
					maxWidth: 1320,
					textAlign: "center",
					textWrap: "balance",
					opacity: o,
					transform: `translateY(${(1 - o) * 8}px)`,
					letterSpacing: -0.2,
				}}
			>
				{page.words.map(([w, s, e], i) => {
					const active = t >= s && t < Math.max(e, s + 0.12);
					const said = t >= e;
					return (
						<span key={i} style={{color: active ? RED : "#fff", opacity: active || said ? 1 : 0.92, transition: "none"}}>
							{w}
							{i < page.words.length - 1 ? " " : ""}
						</span>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};

/** Fade + slide helper for overlays, in sequence-local seconds. */
export const useInOut = (from: number, to: number, d = 0.3) => {
	const t = useCurrentFrame() / useVideoConfig().fps;
	return Math.min(
		interpolate(t, [from, from + d], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)}),
		interpolate(t, [to - d, to], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic)}),
	);
};

/** The client's question, big, centred low (replaces the running caption while it is on screen). */
export const BigQuote: React.FC<{from: number; to: number; text: string}> = ({from, to, text}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const o = useInOut(from, to, 0.22);
	if (o <= 0) return null;
	const pop = spring({frame: frame - from * fps, fps, config: {damping: 14, stiffness: 180}});
	return (
		<AbsoluteFill style={{justifyContent: "flex-end", alignItems: "center", paddingBottom: 70, pointerEvents: "none"}}>
			<div
				style={{
					fontFamily,
					fontWeight: 700,
					fontSize: 60,
					lineHeight: 1.14,
					color: "#fff",
					background: INK_A,
					padding: "22px 40px 26px",
					borderRadius: 18,
					borderLeft: `8px solid ${RED}`,
					maxWidth: 1180,
					textAlign: "center",
					textWrap: "balance",
					opacity: o,
					transform: `scale(${0.9 + 0.1 * pop})`,
					letterSpacing: -0.8,
				}}
			>
				{text}
			</div>
		</AbsoluteFill>
	);
};

/** "11:40 p. m. → 9:40 a. m." with the right-hand clock ticking forward hour by hour. */
export const ClockJump: React.FC<{from: number; to: number}> = ({from, to}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;
	const o = useInOut(from, to, 0.3);
	if (o <= 0) return null;
	// 11 p.m. -> 9 a.m. is 10 hour steps, played over 1.1 s after the card lands
	const k = interpolate(t, [from + 0.35, from + 1.45], [0, 10], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad)});
	const step = Math.floor(k);
	const hour24 = (23 + step) % 24;
	const h12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
	const mer = hour24 >= 12 ? "p. m." : "a. m.";
	const frac = k - step;
	const done = step >= 10;
	const slide = done ? 0 : Math.sin(frac * Math.PI) * 6;
	return (
		<AbsoluteFill style={{pointerEvents: "none"}}>
			<div
				style={{
					position: "absolute",
					left: 70,
					top: 300,
					display: "flex",
					alignItems: "center",
					gap: 16,
					fontFamily,
					fontWeight: 600,
					fontSize: 50,
					color: "#fff",
					background: INK_A,
					padding: "18px 30px 20px",
					borderRadius: 16,
					borderLeft: `6px solid ${RED}`,
					opacity: o,
					transform: `translateX(${(1 - o) * -30}px)`,
					letterSpacing: -0.6,
					fontVariantNumeric: "tabular-nums",
				}}
			>
				<span>11:40 p. m.</span>
				<span style={{color: RED}}>→</span>
				<span style={{display: "inline-block", minWidth: 220, transform: `translateY(${-slide}px)`, color: done ? "#fff" : "rgba(255,255,255,0.85)"}}>
					{h12}:40 {mer}
				</span>
			</div>
		</AbsoluteFill>
	);
};

/** Keyword tag that pops in beside the face (left side by default). */
export const KeyTag: React.FC<{from: number; to: number; text: string; side?: "left" | "right"; top?: number}> = ({from, to, text, side = "left", top = 330}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const o = useInOut(from, to, 0.28);
	if (o <= 0) return null;
	const pop = spring({frame: frame - from * fps, fps, config: {damping: 15, stiffness: 170}});
	return (
		<AbsoluteFill style={{pointerEvents: "none"}}>
			<div
				style={{
					position: "absolute",
					[side]: 96,
					top,
					fontFamily,
					fontWeight: 650,
					fontSize: 52,
					color: "#fff",
					background: INK_A,
					padding: "16px 28px 18px",
					borderRadius: 16,
					borderLeft: side === "left" ? `6px solid ${RED}` : undefined,
					borderRight: side === "right" ? `6px solid ${RED}` : undefined,
					opacity: o,
					transform: `translateX(${(1 - pop) * (side === "left" ? -36 : 36)}px) scale(${0.94 + 0.06 * pop})`,
					letterSpacing: -0.5,
					maxWidth: 640,
				}}
			>
				{text}
			</div>
		</AbsoluteFill>
	);
};

/** Punch-in zoom cuts: list of [startSec, scale] (sequence-local); scale holds until the next entry. Hard cuts, like a second camera. */
export const zoomAtCut = (t: number, cuts: [number, number][]) => {
	let s = 1;
	for (const [a, sc] of cuts) if (t >= a) s = sc;
	return s;
};
