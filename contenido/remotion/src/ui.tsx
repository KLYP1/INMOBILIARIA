import React from "react";
import {AbsoluteFill, Easing, interpolate, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {loadFont} from "@remotion/fonts";

// Inter (variable, latin) served locally: the render browser cannot reach Google Fonts through the proxy.
export const fontFamily = "Inter";
loadFont({family: fontFamily, url: staticFile("fonts/Inter-var.woff2"), weight: "300 700", format: "woff2"});

export const RED = "#E5322D";
export const INK = "#0E0F11";
export const INK_A = "rgba(14,15,17,0.78)";

export type Cue = [number, number, string]; // [start s, end s, text] relative to the clip

/** Burned-in subtitle: white sans-serif on a translucent dark box, max 2 lines, bottom centre. */
export const Captions: React.FC<{cues: Cue[]}> = ({cues}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;
	const cue = cues.find(([s, e]) => t >= s && t < e);
	if (!cue) return null;
	const [s, e, text] = cue;
	const o = Math.min(interpolate(t, [s, s + 0.12], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}),
		interpolate(t, [e - 0.1, e], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}));
	return (
		<AbsoluteFill style={{justifyContent: "flex-end", alignItems: "center", paddingBottom: 64, pointerEvents: "none"}}>
			<div
				style={{
					fontFamily,
					fontWeight: 600,
					fontSize: 42,
					lineHeight: 1.28,
					color: "#fff",
					background: INK_A,
					padding: "12px 26px 14px",
					borderRadius: 12,
					maxWidth: 1360,
					textAlign: "center",
					opacity: o,
					display: "-webkit-box",
					WebkitLineClamp: 2,
					WebkitBoxOrient: "vertical",
					overflow: "hidden",
					letterSpacing: -0.2,
					textWrap: "balance",
				}}
			>
				{text}
			</div>
		</AbsoluteFill>
	);
};

const fade = (t: number, a: number, b: number, d = 0.35) =>
	Math.min(
		interpolate(t, [a, a + d], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)}),
		interpolate(t, [b - d, b], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}),
	);

/** Text card used for "11:40 p. m. → 9:40 a. m." and "Piloto · 7 días" — left of the face. */
export const SideCard: React.FC<{from: number; to: number; children: React.ReactNode}> = ({from, to, children}) => {
	const t = useCurrentFrame() / useVideoConfig().fps;
	const o = fade(t, from, to);
	if (o <= 0) return null;
	return (
		<AbsoluteFill style={{pointerEvents: "none"}}>
			<div
				style={{
					position: "absolute",
					left: 110,
					top: 330,
					fontFamily,
					fontWeight: 600,
					fontSize: 54,
					color: "#fff",
					background: INK_A,
					padding: "18px 30px 20px",
					borderRadius: 14,
					borderLeft: `6px solid ${RED}`,
					opacity: o,
					transform: `translateY(${(1 - o) * 14}px)`,
					letterSpacing: -0.5,
				}}
			>
				{children}
			</div>
		</AbsoluteFill>
	);
};

/** The client's question, big, in the lower third (1A). */
export const BigQuestion: React.FC<{from: number; to: number; text: string}> = ({from, to, text}) => {
	const t = useCurrentFrame() / useVideoConfig().fps;
	const o = fade(t, from, to, 0.25);
	if (o <= 0) return null;
	return (
		<AbsoluteFill style={{justifyContent: "flex-end", alignItems: "center", paddingBottom: 70, pointerEvents: "none"}}>
			<div
				style={{
					fontFamily,
					fontWeight: 700,
					fontSize: 62,
					lineHeight: 1.15,
					color: "#fff",
					background: INK_A,
					padding: "20px 38px 24px",
					borderRadius: 16,
					borderLeft: `8px solid ${RED}`,
					maxWidth: 1240,
					textAlign: "center",
					textWrap: "balance",
					opacity: o,
					transform: `scale(${0.96 + 0.04 * o})`,
					letterSpacing: -0.8,
				}}
			>
				{text}
			</div>
		</AbsoluteFill>
	);
};

/** Lower third "Wida · Fundadora de KLYP". */
export const LowerThird: React.FC<{from: number; to: number}> = ({from, to}) => {
	const t = useCurrentFrame() / useVideoConfig().fps;
	const o = fade(t, from, to, 0.4);
	if (o <= 0) return null;
	return (
		<AbsoluteFill style={{pointerEvents: "none"}}>
			<div
				style={{
					position: "absolute",
					left: 110,
					bottom: 220,
					display: "flex",
					alignItems: "stretch",
					opacity: o,
					transform: `translateX(${(1 - o) * -24}px)`,
				}}
			>
				<div style={{width: 6, background: RED, borderRadius: 3}} />
				<div
					style={{
						fontFamily,
						background: INK_A,
						color: "#fff",
						padding: "14px 26px 16px 22px",
						borderRadius: "0 12px 12px 0",
						fontSize: 40,
						letterSpacing: -0.3,
					}}
				>
					<span style={{fontWeight: 700}}>Wida</span>
					<span style={{fontWeight: 400, opacity: 0.9}}> · Fundadora de KLYP</span>
				</div>
			</div>
		</AbsoluteFill>
	);
};

/** Small fixed corner label over the demo. */
export const CornerLabel: React.FC<{text: string}> = ({text}) => (
	<AbsoluteFill style={{pointerEvents: "none"}}>
		<div
			style={{
				position: "absolute",
				left: 34,
				top: 30,
				fontFamily,
				fontWeight: 500,
				fontSize: 22,
				color: "#fff",
				background: INK_A,
				padding: "8px 16px 9px",
				borderRadius: 999,
				display: "flex",
				alignItems: "center",
				gap: 10,
			}}
		>
			<span style={{width: 8, height: 8, borderRadius: 4, background: RED, display: "inline-block"}} />
			{text}
		</div>
	</AbsoluteFill>
);

/** Subtle animated arrow pointing down (towards the calendar under the video). */
export const DownArrow: React.FC<{from: number}> = ({from}) => {
	const t = useCurrentFrame() / useVideoConfig().fps;
	const o = interpolate(t, [from, from + 0.5], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
	if (o <= 0) return null;
	const bob = Math.sin((t - from) * Math.PI * 1.6) * 10;
	return (
		<AbsoluteFill style={{pointerEvents: "none"}}>
			<div style={{position: "absolute", right: 120, bottom: 230 - bob, opacity: o * 0.95}}>
				<svg width="84" height="110" viewBox="0 0 84 110">
					<circle cx="42" cy="42" r="40" fill={INK_A} />
					<path d="M42 20 L42 62 M26 48 L42 64 L58 48" stroke={RED} strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			</div>
		</AbsoluteFill>
	);
};
