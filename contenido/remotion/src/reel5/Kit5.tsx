import React from "react";
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {FONT, RED, Window} from "../reel/brand";
import {W} from "../reel/Subs";

const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
const useT = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	return {t: frame / fps, frame, fps};
};
const sp = (frame: number, fps: number, at: number, cfg: {damping: number; stiffness: number; mass?: number} = {damping: 11, stiffness: 200, mass: 0.7}) => spring({frame: frame - Math.round(at * fps), fps, config: cfg});

/** Kinetic captions: words pop in one by one as spoken (spring overshoot), active word red + slightly bigger. */
export const KineticSubs: React.FC<{lines: W[][]; y: number; hide?: [number, number][]}> = ({lines, y, hide = []}) => {
	const {t, frame, fps} = useT();
	if (hide.some(([a, b]) => t >= a && t < b)) return null;
	const idx = lines.findIndex((L, i) => t >= L[0][1] - 0.05 && t < (lines[i + 1]?.[0][1] ?? L[L.length - 1][2] + 0.6) - 0.05);
	if (idx < 0) return null;
	const L = lines[idx];
	return (
		<AbsoluteFill style={{pointerEvents: "none"}}>
			<div style={{position: "absolute", left: 50, right: 50, top: y, display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: 34, rowGap: 0, fontFamily: FONT, fontWeight: 800, fontSize: 80, lineHeight: 1.08, letterSpacing: -1.6, color: "#fff", textTransform: "none", textShadow: "0 4px 18px rgba(0,0,0,0.55), 0 1px 3px rgba(0,0,0,0.6)"}}>
				{L.map(([w, a, b], i) => {
					const s = sp(frame, fps, a - 0.06);
					const active = t >= a - 0.03 && t < Math.max(b, a + 0.18) + 0.04;
					return (
						<span key={i} style={{display: "inline-block", opacity: Math.min(1, s * 1.6), transform: `translateY(${(1 - s) * 26}px) scale(${(0.7 + 0.3 * s) * (active ? 1.04 : 1)})`, color: active ? RED : "#fff"}}>
							{w}
						</span>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};

/** Big slam title in the top band with a red highlighter sweeping behind the key words. */
export const Slam: React.FC<{from: number; to: number; pre?: string; key_: string; post?: string; top?: number; size?: number}> = ({from, to, pre, key_, post, top = 120, size = 96}) => {
	const {t, frame, fps} = useT();
	if (t < from - 0.05 || t > to + 0.05) return null;
	const s = sp(frame, fps, from, {damping: 9, stiffness: 260, mass: 0.6});
	const out = interpolate(t, [to - 0.18, to], [1, 0], clamp);
	const sweep = interpolate(t, [from + 0.12, from + 0.45], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	return (
		<div style={{position: "absolute", left: 40, right: 40, top, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: size, letterSpacing: -2.5, lineHeight: 1.02, color: "#0A0A0A", opacity: Math.min(1, s * 1.5) * out, transform: `scale(${(1.35 - 0.35 * s) * (0.92 + 0.08 * out)}) rotate(${(1 - s) * -3}deg)`}}>
			{pre && <div style={{fontSize: size * 0.5, fontWeight: 700, letterSpacing: -1, marginBottom: 6}}>{pre}</div>}
			<span style={{position: "relative", display: "inline-block", padding: "0 18px", color: "#fff"}}>
				<span style={{position: "absolute", left: 0, top: "8%", height: "88%", width: `${sweep * 100}%`, background: RED, borderRadius: 14, zIndex: 0}} />
				<span style={{position: "relative", zIndex: 1, color: sweep > 0.5 ? "#fff" : "#0A0A0A"}}>{key_}</span>
			</span>
			{post && <div style={{fontSize: size * 0.5, fontWeight: 700, letterSpacing: -1, marginTop: 22}}>{post}</div>}
		</div>
	);
};

/** Question card: huge outlined number slides in from the left, question pops on a dark pill. */
export const QCard: React.FC<{from: number; to: number; n: string; q: string; qAt: number}> = ({from, to, n, q, qAt}) => {
	const {t, frame, fps} = useT();
	if (t < from - 0.05 || t > to + 0.05) return null;
	const a = sp(frame, fps, from, {damping: 13, stiffness: 180});
	const b = sp(frame, fps, qAt, {damping: 12, stiffness: 220});
	const out = interpolate(t, [to - 0.22, to], [1, 0], clamp);
	return (
		<div style={{position: "absolute", left: 0, right: 0, top: 70, fontFamily: FONT, opacity: out}}>
			<div style={{position: "absolute", left: 40, top: 0, fontSize: 230, fontWeight: 800, lineHeight: 1, letterSpacing: -10, color: "transparent", WebkitTextStroke: `4px ${RED}`, transform: `translateX(${(1 - a) * -260}px)`, opacity: a}}>{n}</div>
			<div style={{position: "absolute", left: 300, right: 40, top: 38, display: "flex", flexDirection: "column", gap: 10}}>
				<div style={{display: "flex", alignItems: "center", gap: 10, fontSize: 26, fontWeight: 700, color: "#0A0A0A", opacity: a, letterSpacing: 1}}>
					<Window size={16} /> PREGUNTA {n}
				</div>
				<div style={{background: "#0A0A0A", color: "#fff", fontSize: 50, fontWeight: 800, letterSpacing: -1.2, lineHeight: 1.06, padding: "20px 26px 22px", borderRadius: 24, boxShadow: "0 16px 40px rgba(0,0,0,0.25)", opacity: Math.min(1, b * 1.5), transform: `translateY(${(1 - b) * 30}px) scale(${0.85 + 0.15 * b})`, transformOrigin: "left top"}}>
					{q}
				</div>
			</div>
		</div>
	);
};

/** Chips that stack up as she names them (light glass pills on the wall). */
export const Chips: React.FC<{from: number; to: number; items: [string, number, boolean?][]; top?: number}> = ({from, to, items, top = 330}) => {
	const {t, frame, fps} = useT();
	if (t < from - 0.05 || t > to + 0.05) return null;
	const out = interpolate(t, [to - 0.2, to], [1, 0], clamp);
	return (
		<div style={{position: "absolute", left: 300, right: 40, top, display: "flex", flexWrap: "wrap", gap: 12, fontFamily: FONT, opacity: out}}>
			{items.map(([label, at, hot], i) => {
				const s = sp(frame, fps, at, {damping: 10, stiffness: 240, mass: 0.6});
				return (
					<div key={i} style={{fontSize: 32, fontWeight: 700, padding: "10px 22px", borderRadius: 999, background: hot ? RED : "#fff", color: hot ? "#fff" : "#0A0A0A", boxShadow: "0 8px 22px rgba(0,0,0,0.18)", border: hot ? "none" : "1px solid rgba(10,10,10,0.08)", opacity: Math.min(1, s * 1.5), transform: `translateY(${(1 - s) * 24}px) scale(${0.6 + 0.4 * s})`}}>
						{label}
					</div>
				);
			})}
		</div>
	);
};

/** Two-way split: ready to buy vs. pre-qualify with a bank. */
export const Split: React.FC<{from: number; to: number; aAt: number; bAt: number}> = ({from, to, aAt, bAt}) => {
	const {t, frame, fps} = useT();
	if (t < from - 0.05 || t > to + 0.05) return null;
	const out = interpolate(t, [to - 0.2, to], [1, 0], clamp);
	const a = sp(frame, fps, aAt);
	const b = sp(frame, fps, bAt);
	const box = (k: number, title: string, sub: string, hot: boolean, dir: number) => (
		<div style={{flex: 1, background: hot ? RED : "#0A0A0A", color: "#fff", borderRadius: 26, padding: "22px 24px", boxShadow: "0 16px 40px rgba(0,0,0,0.22)", opacity: Math.min(1, k * 1.5), transform: `translateX(${(1 - k) * 120 * dir}px) rotate(${(1 - k) * 4 * dir}deg)`}}>
			<div style={{fontSize: 46, fontWeight: 800, letterSpacing: -1, lineHeight: 1.02}}>{title}</div>
			<div style={{fontSize: 24, fontWeight: 600, opacity: 0.8, marginTop: 8}}>{sub}</div>
		</div>
	);
	return (
		<div style={{position: "absolute", left: 50, right: 50, top: 110, display: "flex", gap: 18, alignItems: "stretch", fontFamily: FONT, opacity: out}}>
			{box(a, "Listo para comprar", "Agéndale la visita", true, -1)}
			<div style={{alignSelf: "center", fontSize: 34, fontWeight: 800, color: "#0A0A0A", opacity: Math.min(a, b)}}>o</div>
			{box(b, "Precalificar con un banco", "Antes de la visita", false, 1)}
		</div>
	);
};

/** 3/3 answered progress + payoff. */
export const Payoff: React.FC<{from: number; to: number; at: number[]; finalAt: number}> = ({from, to, at, finalAt}) => {
	const {t, frame, fps} = useT();
	if (t < from - 0.05 || t > to + 0.05) return null;
	const out = interpolate(t, [to - 0.2, to], [1, 0], clamp);
	const f = sp(frame, fps, finalAt, {damping: 9, stiffness: 240, mass: 0.6});
	const labels = ["Presupuesto", "Cuándo", "Financiamiento"];
	return (
		<div style={{position: "absolute", left: 50, right: 50, top: 100, fontFamily: FONT, opacity: out, display: "flex", flexDirection: "column", alignItems: "center", gap: 18}}>
			<div style={{display: "flex", gap: 12}}>
				{labels.map((l, i) => {
					const s = sp(frame, fps, at[i], {damping: 10, stiffness: 240, mass: 0.6});
					return (
						<div key={l} style={{display: "flex", alignItems: "center", gap: 10, background: "#0A0A0A", color: "#fff", borderRadius: 999, padding: "10px 18px 10px 10px", fontSize: 28, fontWeight: 700, opacity: Math.min(1, s * 1.5), transform: `scale(${0.6 + 0.4 * s})`}}>
							<div style={{width: 36, height: 36, borderRadius: 18, background: RED, display: "flex", alignItems: "center", justifyContent: "center"}}>
								<svg width={22} height={22} viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#fff" strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.min(1, s)} /></svg>
							</div>
							{l}
						</div>
					);
				})}
			</div>
			<div style={{fontSize: 76, fontWeight: 800, letterSpacing: -2, color: "#0A0A0A", lineHeight: 1.0, textAlign: "center", opacity: Math.min(1, f * 1.5), transform: `scale(${1.3 - 0.3 * f})`}}>
				Llega sabiendo <span style={{color: RED}}>qué ofrecer</span>
			</div>
		</div>
	);
};

/** Save + send CTA. */
export const SaveSend: React.FC<{from: number; to: number; sendAt: number}> = ({from, to, sendAt}) => {
	const {t, frame, fps} = useT();
	if (t < from - 0.05 || t > to + 0.05) return null;
	const a = sp(frame, fps, from, {damping: 10, stiffness: 240, mass: 0.6});
	const b = sp(frame, fps, sendAt, {damping: 10, stiffness: 240, mass: 0.6});
	const pill = (k: number, label: string, icon: React.ReactNode, hot: boolean) => (
		<div style={{display: "flex", alignItems: "center", gap: 14, background: hot ? RED : "#0A0A0A", color: "#fff", borderRadius: 999, padding: "16px 30px 16px 22px", fontSize: 44, fontWeight: 800, letterSpacing: -0.8, opacity: Math.min(1, k * 1.5), transform: `scale(${0.6 + 0.4 * k})`, boxShadow: "0 14px 34px rgba(0,0,0,0.22)"}}>
			<svg width={46} height={46} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
			{label}
		</div>
	);
	return (
		<div style={{position: "absolute", left: 40, right: 40, top: 150, display: "flex", gap: 16, justifyContent: "center", fontFamily: FONT}}>
			{pill(a, "Guárdalo", <path d="M6 3h12v18l-6-4-6 4z" />, false)}
			{pill(b, "Envíaselo", <><path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4z" /></>, true)}
		</div>
	);
};

/** Soft floating red squares (the K window motif) drifting on the wall – keeps the frame alive. */
export const Motif: React.FC = () => {
	const {t} = useT();
	return (
		<AbsoluteFill style={{pointerEvents: "none"}}>
			{[[70, 520, 18, 0], [960, 460, 14, 1.3], [1000, 700, 10, 2.4], [60, 760, 12, 3.1]].map(([x, y, s, ph], i) => (
				<div key={i} style={{position: "absolute", left: x, top: y + Math.sin(t * 0.9 + ph) * 14, opacity: 0.55, transform: `rotate(${Math.sin(t * 0.5 + ph) * 8}deg)`}}>
					<Window size={s} />
				</div>
			))}
		</AbsoluteFill>
	);
};
