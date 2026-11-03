import React from "react";
import {Easing, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {loadFont} from "@remotion/fonts";

export const FONT = "Inter";
loadFont({family: FONT, url: staticFile("fonts/Inter-var.woff2"), weight: "300 700", format: "woff2"});

export const BG = "#0A0A0A";
export const RED = "#E10600";
export const CARD = "rgba(10,10,10,0.92)";

/** sequence-local time helper with an ease-out in and quick ease-in out (200–400 ms). */
export const useAppear = (from: number, to: number, dIn = 0.32, dOut = 0.22) => {
	const t = useCurrentFrame() / useVideoConfig().fps;
	const inK = interpolate(t, [from, from + dIn], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});
	const outK = interpolate(t, [to - dOut, to], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic)});
	return {t, k: Math.min(inK, outK), inK, outK};
};

export const useSpring = (at: number, cfg = {damping: 16, stiffness: 190}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	return spring({frame: frame - Math.round(at * fps), fps, config: cfg});
};

/** The red 2x2 "window" from the K. `on` = 0..1 reveals the four panes one after another. */
export const Window: React.FC<{size: number; on?: number}> = ({size, on = 1}) => {
	const g = size * 0.12, c = (size - g) / 2;
	return (
		<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{display: "block"}}>
			{[[0, 0], [1, 0], [0, 1], [1, 1]].map(([x, y], i) => {
				const k = Math.max(0, Math.min(1, on * 4 - i));
				return <rect key={i} x={x * (c + g)} y={y * (c + g)} width={c} height={c} rx={size * 0.03} fill={RED} opacity={k} transform={`translate(${(c / 2) * (1 - k)} ${(c / 2) * (1 - k)}) scale(${k || 0.0001})`} style={{transformBox: "fill-box"}} />;
			})}
		</svg>
	);
};

/** KLYP wordmark (geometric strokes) with the red window at the foot of the K. `reveal` 0..1 wipes the letters in. */
export const Logo: React.FC<{height: number; color?: string; reveal?: number; windowOn?: number}> = ({height, color = "#fff", reveal = 1, windowOn = 1}) => {
	// drawn on a 100 x 24 grid; stroke 3.2
	const sw = 3.4;
	const w = (height / 24) * 83;
	const p = {fill: "none", stroke: color, strokeWidth: sw, strokeLinecap: "butt" as const, strokeLinejoin: "miter" as const};
	return (
		<svg width={w} height={height} viewBox="0 0 83 24" style={{display: "block", overflow: "visible"}}>
			<defs>
				<clipPath id="wipe">
					<rect x={0} y={-4} width={100 * reveal} height={32} />
				</clipPath>
			</defs>
			<g clipPath="url(#wipe)">
				{/* K */}
				<path d="M2.2 2 V22" {...p} />
				<path d="M3.6 15.2 L16 2" {...p} />
				<path d="M9.2 9.8 L17.8 22" {...p} />
				{/* L */}
				<path d="M24 2 V20.3 H38.5" {...p} />
				{/* Y */}
				<path d="M41.5 2 L49.6 11.4 L57.7 2" {...p} />
				<path d="M49.6 11.4 V22" {...p} />
				{/* P */}
				<path d="M64.5 22 V3.7 H76 Q80.6 3.7 80.6 8.6 V9.6 Q80.6 14.5 76 14.5 H66.2" {...p} />
			</g>
			{/* red 2x2 window at the foot of the K, between stem and leg */}
			{[[0, 0], [1, 0], [0, 1], [1, 1]].map(([x, y], i) => {
				const k = Math.max(0, Math.min(1, windowOn * 4 - i));
				const c = 2.5, g = 0.6, x0 = 5.0 + x * (c + g), y0 = 16.8 + y * (c + g);
				return <rect key={i} x={x0 + (c / 2) * (1 - k)} y={y0 + (c / 2) * (1 - k)} width={c * k} height={c * k} rx={0.25} fill={RED} />;
			})}
		</svg>
	);
};
