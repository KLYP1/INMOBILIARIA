import React from "react";
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {RED, FONT} from "./brand";

export type W = [string, number, number];

/** One caption line at a time (2–4 words), current word in red, soft fade + rise; no box, soft shadow. */
export const Subs: React.FC<{lines: W[][]; hide: [number, number][]; redHold?: {words: string[]; from: number; to: number}; y: number}> = ({lines, hide, redHold, y}) => {
	const t = useCurrentFrame() / useVideoConfig().fps;
	if (hide.some(([a, b]) => t >= a && t < b)) return null;
	const idx = lines.findIndex((L, i) => t >= L[0][1] - 0.04 && t < (lines[i + 1]?.[0][1] ?? L[L.length - 1][2] + 0.6) - 0.04);
	if (idx < 0) return null;
	const L = lines[idx];
	const s = L[0][1] - 0.04;
	const k = interpolate(t, [s, s + 0.22], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});
	return (
		<AbsoluteFill style={{pointerEvents: "none"}}>
			<div
				style={{
					position: "absolute",
					left: 70,
					right: 70,
					top: y,
					textAlign: "center",
					fontFamily: FONT,
					fontWeight: 700,
					fontSize: 66,
					lineHeight: 1.1,
					letterSpacing: -1,
					color: "#fff",
					textShadow: "0 3px 16px rgba(0,0,0,0.6), 0 1px 3px rgba(0,0,0,0.6), 0 0 2px rgba(0,0,0,0.5)",
					opacity: k,
					transform: `translateY(${(1 - k) * 14}px) scale(${0.95 + 0.05 * k})`,
				}}
			>
				{L.map(([w, a, b], i) => {
					const active = t >= a - 0.02 && t < Math.max(b, a + 0.15) + 0.04;
					const held = redHold && t >= redHold.from && t < redHold.to && redHold.words.includes(w);
					return (
						<span key={i} style={{color: active || held ? RED : "#fff"}}>
							{w}
							{i < L.length - 1 ? " " : ""}
						</span>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};
