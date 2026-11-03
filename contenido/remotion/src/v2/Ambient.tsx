import React from "react";
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {RED} from "./kit";

/** Floating white cards on the empty wall, each with a small animated icon and one soft accent colour. */
export type Icon = "chat" | "moon" | "clock" | "calendar" | "building" | "bolt" | "check" | "phone" | "user" | "excel" | "star" | "handshake";
export type Float = {from: number; to: number; icon: Icon; x: number; y: number; size?: number};

const INKC = "#23272d";
const GREEN = "#1fae5b";
const SOFTRED = RED;

const Glyph: React.FC<{icon: Icon; k: number; t: number}> = ({icon, k, t}) => {
	const draw = (len = 1) => ({pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - Math.min(1, k * len)});
	const stroke = {stroke: INKC, strokeWidth: 4.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const};
	switch (icon) {
		case "chat":
			return (
				<g>
					<path d="M18 22h64a8 8 0 0 1 8 8v34a8 8 0 0 1-8 8H46l-16 13V72H18a8 8 0 0 1-8-8V30a8 8 0 0 1 8-8z" fill="#eafaf0" {...stroke} {...draw()} />
					{[0, 1, 2].map((i) => {
						const b = Math.max(0, Math.sin(t * 7 - i * 0.9));
						return <circle key={i} cx={34 + i * 16} cy={47 - b * 5} r={5} fill={GREEN} opacity={k} />;
					})}
				</g>
			);
		case "moon":
			return (
				<g>
					<path d="M64 14a36 36 0 1 0 22 56A30 30 0 0 1 64 14z" fill="#eef1f8" {...stroke} {...draw()} />
					{[[78, 22, 0], [88, 40, 1.4], [70, 8, 2.6]].map(([x, y, ph], i) => (
						<path key={i} d={`M${x} ${y - 5}v10M${x - 5} ${y}h10`} stroke="#c9a227" strokeWidth={3} strokeLinecap="round" opacity={k * (0.35 + 0.65 * (Math.sin(t * 3 + ph) + 1) / 2)} />
					))}
				</g>
			);
		case "clock": {
			const rot = interpolate(t, [0, 3], [0, 300], {extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic)});
			return (
				<g>
					<circle cx={50} cy={50} r={38} fill="#fff4f3" {...stroke} {...draw()} />
					<line x1={50} y1={50} x2={50} y2={30} stroke={INKC} strokeWidth={5} strokeLinecap="round" transform={`rotate(${rot / 12} 50 50)`} />
					<line x1={50} y1={50} x2={50} y2={20} stroke={SOFTRED} strokeWidth={3.5} strokeLinecap="round" transform={`rotate(${rot} 50 50)`} />
					<circle cx={50} cy={50} r={4} fill={INKC} />
				</g>
			);
		}
		case "calendar":
			return (
				<g>
					<rect x={12} y={20} width={76} height={68} rx={10} fill="#fff" {...stroke} {...draw()} />
					<path d="M12 38h76" fill="none" {...stroke} {...draw()} />
					<rect x={12} y={20} width={76} height={18} rx={10} fill={SOFTRED} opacity={0.9 * k} />
					<path d="M32 12v16M68 12v16" fill="none" {...stroke} />
					<path d="M34 62l10 10 22-22" fill="none" stroke={GREEN} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1}
						strokeDashoffset={1 - interpolate(k, [0.55, 1], [0, 1], {extrapolateLeft: "clamp"})} />
				</g>
			);
		case "building":
			return (
				<g>
					<path d="M22 90V18h38v72M60 42h22v48M12 90h80" fill="#f6f7f9" {...stroke} {...draw()} />
					{[[30, 30], [44, 30], [30, 46], [44, 46], [30, 62], [44, 62], [68, 54], [68, 70]].map(([x, y], i) => {
						const on = (Math.sin(t * 2.2 + i * 1.7) + 1) / 2 > 0.45;
						return <rect key={i} x={x} y={y} width={8} height={9} rx={1.5} fill={on ? "#f4c64e" : "#dfe3e8"} opacity={k} />;
					})}
				</g>
			);
		case "bolt":
			return <path d="M56 8L24 56h24l-6 36 34-50H52z" fill="#fff4d6" {...stroke} {...draw()} />;
		case "check":
			return (
				<g>
					<circle cx={50} cy={50} r={38} fill="#eafaf0" {...stroke} {...draw()} />
					<path d="M32 52l12 12 24-26" fill="none" stroke={GREEN} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" {...draw(1)} />
				</g>
			);
		case "phone":
			return (
				<g>
					<rect x={28} y={8} width={44} height={84} rx={9} fill="#fff" {...stroke} {...draw()} />
					<rect x={34} y={24} width={32} height={14} rx={4} fill={GREEN} opacity={k * (0.6 + 0.4 * Math.sin(t * 4))} />
					<path d="M44 82h12" fill="none" {...stroke} />
				</g>
			);
		case "user":
			return (
				<g>
					<circle cx={50} cy={36} r={16} fill="#eef1f8" {...stroke} {...draw()} />
					<path d="M20 86c4-18 16-26 30-26s26 8 30 26" fill="none" {...stroke} {...draw()} />
				</g>
			);
		case "excel":
			return (
				<g>
					<rect x={14} y={14} width={72} height={72} rx={10} fill="#eafaf0" {...stroke} {...draw()} />
					{[0, 1, 2].map((r) => <path key={r} d={`M14 ${38 + r * 16}h72`} stroke={INKC} strokeWidth={2.5} opacity={0.5 * k} />)}
					<path d="M44 14v72" stroke={INKC} strokeWidth={2.5} opacity={0.5 * k} />
					<rect x={46} y={40} width={38} height={14} fill={GREEN} opacity={0.45 * k * (0.6 + 0.4 * Math.sin(t * 3))} />
				</g>
			);
		case "star":
			return <path d="M50 10l11 24 26 3-19 18 5 26-23-13-23 13 5-26-19-18 26-3z" fill="#fff4d6" {...stroke} {...draw()} />;
		case "handshake":
			return (
				<g>
					<path d="M10 46l18-16 16 6 12-6 16 4 18 14" fill="none" {...stroke} {...draw()} />
					<path d="M28 52l14 14c4 4 8 4 12 0l16-16" fill="none" stroke={SOFTRED} strokeWidth={4.5} strokeLinecap="round" {...draw()} />
				</g>
			);
	}
};

const Card: React.FC<Float & {t: number; frame: number; fps: number}> = ({from, to, icon, x, y, size = 230, t, frame, fps}) => {
	if (t < from - 0.1 || t > to + 0.1) return null;
	const sp = spring({frame: frame - from * fps, fps, config: {damping: 11, stiffness: 140, mass: 0.8}});
	const out = interpolate(t, [to - 0.45, to], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic)});
	const k = interpolate(t, [from + 0.15, from + 1.0], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});
	const bob = Math.sin((t - from) * 1.6) * 7;
		const sc = (0.6 + 0.4 * sp) * (0.85 + 0.15 * out);
	return (
		<div
			style={{
				position: "absolute",
				left: x,
				top: y + bob,
				width: size,
				height: size,
				borderRadius: size * 0.24,
				background: "rgba(255,255,255,0.92)",
				boxShadow: "0 18px 40px rgba(20,25,35,0.14), 0 2px 6px rgba(20,25,35,0.06)",
				border: "1px solid rgba(20,25,35,0.06)",
				opacity: Math.min(1, sp * 1.3) * out,
				transform: `scale(${sc})`, // always upright
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<svg width={size * 0.62} height={size * 0.62} viewBox="0 0 100 100" style={{overflow: "visible"}}>
				<Glyph icon={icon} k={k} t={t - from} />
			</svg>
		</div>
	);
};

/** Soft drifting dots on the wall (very light), so the background never feels static. */
const Dust: React.FC<{t: number}> = ({t}) => (
	<>
		{Array.from({length: 14}).map((_, i) => {
			const left = i % 2 === 0;
			const bx = left ? 40 + ((i * 97) % 380) : 1500 + ((i * 83) % 380);
			const by = 60 + ((i * 131) % 640);
			const r = 4 + (i % 3) * 3;
			const yy = by + Math.sin(t * 0.5 + i) * 18 - ((t * (6 + (i % 4) * 3)) % 60);
			const col = i % 5 === 0 ? "rgba(229,50,45,0.28)" : "rgba(35,39,45,0.10)";
			return <div key={i} style={{position: "absolute", left: bx + Math.cos(t * 0.4 + i) * 10, top: yy, width: r * 2, height: r * 2, borderRadius: r, background: col}} />;
		})}
	</>
);

export const Ambient: React.FC<{items: Float[]; dust?: boolean}> = ({items, dust = true}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;
	return (
		<AbsoluteFill style={{pointerEvents: "none"}}>
			{dust && <Dust t={t} />}
			{items.map((it, i) => <Card key={i} {...it} t={t} frame={frame} fps={fps} />)}
		</AbsoluteFill>
	);
};
