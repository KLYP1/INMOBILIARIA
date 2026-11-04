import React from "react";
import {AbsoluteFill, Easing, interpolate} from "remotion";
import {RED, Window} from "../reel/brand";
import {COND, cond, NUM, thin, THIN} from "../reel5/Gala";
import {LogoImg} from "../reel/Reel";

const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
export const EOUT = Easing.out(Easing.cubic);
export const k01 = (t: number, a: number, d = 0.3) => interpolate(t, [a, a + d], [0, 1], {...clamp, easing: EOUT});
/** blur-out exit (no hard cuts) */
export const exitStyle = (t: number, to: number, d = 0.3): React.CSSProperties => {
	const k = interpolate(t, [to - d, to], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
	return k > 0 ? {opacity: 1 - k, filter: `blur(${k * 12}px)`, transform: `translateY(${-k * 10}px)`} : {};
};
/** fade + slight rise (phrases) */
const rise = (t: number, at: number, d = 0.35): React.CSSProperties => {
	const k = k01(t, at, d);
	return {opacity: k, transform: `translateY(${(1 - k) * 22}px)`, display: "inline-block"};
};

/** Short impact word typed letter by letter (each letter fades/focuses in). */
export const Letters: React.FC<{t: number; at: number; text: string; style: React.CSSProperties; step?: number}> = ({t, at, text, style, step = 0.035}) => (
	<span style={{...style, display: "inline-block", whiteSpace: "pre"}}>
		{[...text].map((ch, i) => {
			const k = k01(t, at + i * step, 0.18);
			return <span key={i} style={{display: "inline-block", opacity: k, transform: `translateY(${(1 - k) * 14}px) scale(${1.12 - 0.12 * k})`, filter: k < 1 ? `blur(${(1 - k) * 6}px)` : undefined}}>{ch}</span>;
		})}
	</span>
);

/** Three-level title: small sans support line, big condensed red key, optional italic accent. */
export const Head3: React.FC<{
	t: number; from: number; to: number; top?: number;
	sup?: string; supAt?: number; key_: string; keyAt?: number; keySize?: number; letters?: boolean; keyColor?: string;
	acc?: string; accAt?: number; dark?: boolean;
}> = ({t, from, to, top = 120, sup, supAt, key_, keyAt, keySize = 150, letters, keyColor = RED, acc, accAt, dark = true}) => {
	if (t < from || t > to) return null;
	const ink = dark ? "#151515" : "#fff";
	const ka = keyAt ?? from + 0.12;
	return (
		<div style={{position: "absolute", left: 60, right: 110, top, textAlign: "center", ...exitStyle(t, to)}}>
			{sup && (
				<div style={{...thin(50, ink, {fontWeight: 400}), display: "flex", justifyContent: "center", alignItems: "center", gap: 14}}>
					<span style={{opacity: k01(t, supAt ?? from, 0.3)}}><Window size={22} on={k01(t, supAt ?? from, 0.4)} /></span>
					<span style={rise(t, supAt ?? from)}>{sup}</span>
				</div>
			)}
			<div style={{marginTop: sup ? 6 : 0}}>
				{letters ? <Letters t={t} at={ka} text={key_.toUpperCase()} style={cond(keySize, keyColor)} /> : <span style={{...cond(keySize, keyColor), ...rise(t, ka, 0.3)}}>{key_}</span>}
			</div>
			{acc && <div style={{...thin(48, ink, {fontStyle: "italic"}), marginTop: 10}}><span style={rise(t, accAt ?? ka + 0.3)}>{acc}</span></div>}
		</div>
	);
};

/** Big figure that counts up and settles 95 % → 100 %. */
export const Figure: React.FC<{t: number; from: number; to: number; value: number; pre?: string; suf?: string; dur?: number; top?: number; size?: number; sub?: string; subAt?: number; color?: string}> = ({t, from, to, value, pre = "", suf = "", dur = 0.6, top = 1060, size = 300, sub, subAt, color = RED}) => {
	if (t < from || t > to) return null;
	const k = k01(t, from, dur);
	const n = Math.round(value * k);
	return (
		<div style={{position: "absolute", left: 60, right: 110, top, textAlign: "center", ...exitStyle(t, to)}}>
			<div style={{fontFamily: COND, fontSize: size, lineHeight: 0.85, color, opacity: Math.min(1, k * 2), transform: `scale(${0.95 + 0.05 * k})`, textShadow: "0 6px 30px rgba(0,0,0,0.25)"}}>{pre}{n}{suf}</div>
			{sub && <div style={{...thin(54, "#fff", {textShadow: "0 2px 14px rgba(0,0,0,0.5)"}), marginTop: 14}}><span style={rise(t, subAt ?? from + 0.3)}>{sub}</span></div>}
		</div>
	);
};

/* ───────── line icons (24 grid) ───────── */
const I: React.FC<{d: React.ReactNode; size?: number; color?: string}> = ({d, size = 54, color = "#fff"}) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">{d}</svg>
);
export const IcBolt = (p: {color?: string}) => <I {...p} d={<path d="M13 2.5L5 13.5h6l-1 8 8-11h-6z" />} />;
export const IcBed = (p: {color?: string}) => <I {...p} d={<><path d="M3 18.5v-11M3 14h18v4.5M21 14v-2.5a3 3 0 0 0-3-3h-7v5.5" /><circle cx="7" cy="11" r="1.8" /></>} />;
export const IcWallet = (p: {color?: string}) => <I {...p} d={<><rect x="3" y="6" width="18" height="13" rx="2.5" /><path d="M3 9.5h13M16.5 13.5h1" /></>} />;
export const IcCal = (p: {color?: string}) => <I {...p} d={<><rect x="3.5" y="5" width="17" height="15.5" rx="2.5" /><path d="M8 3v4M16 3v4M3.5 10h17M9 15l2 2 4-4" /></>} />;
export const IcMoon = (p: {color?: string}) => <I {...p} d={<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />} />;

/** Vertical list; each item enters in turn and the earlier ones drop to 40 % opacity. */
export const IconList: React.FC<{t: number; from: number; to: number; top: number; items: [React.FC<{color?: string}>, string, number][]}> = ({t, from, to, top, items}) => {
	if (t < from || t > to) return null;
	const cur = items.reduce((c, it, i) => (t >= it[2] ? i : c), -1);
	return (
		<div style={{position: "absolute", left: 90, right: 130, top, display: "flex", flexDirection: "column", gap: 26, ...exitStyle(t, to)}}>
			{items.map(([Ic, label, at], i) => {
				const k = k01(t, at, 0.35);
				const dim = i < cur ? 0.4 : 1;
				return (
					<div key={i} style={{display: "flex", alignItems: "center", gap: 28, opacity: k * dim, transform: `translateX(${(1 - k) * 30}px)`, transition: "none"}}>
						<div style={{width: 96, height: 96, borderRadius: 26, border: "1.5px solid rgba(255,255,255,0.28)", display: "flex", alignItems: "center", justifyContent: "center", background: i === cur ? "rgba(225,6,0,0.18)" : "rgba(255,255,255,0.04)"}}>
							<Ic color={i === cur ? "#fff" : "rgba(255,255,255,0.9)"} />
						</div>
						<div style={thin(58, "#fff", {fontWeight: i === cur ? 400 : 300})}>{label}</div>
					</div>
				);
			})}
		</div>
	);
};

/** Brand veil that drops from the top (~0.8 s) leaving her at ~35 %, with a small KLYP pill. */
export const Veil: React.FC<{t: number; from: number; to: number; strong?: boolean; pillOn?: boolean; children?: React.ReactNode}> = ({t, from, to, strong, pillOn = true, children}) => {
	if (t < from || t > to + 0.01) return null;
	const k = k01(t, from, 0.8);
	const o = interpolate(t, [to - 0.35, to], [1, 0], {...clamp, easing: Easing.in(Easing.cubic)});
	const pill = pillOn ? k01(t, from + 0.5, 0.35) : 0;
	return (
		<AbsoluteFill style={{opacity: o}}>
			<AbsoluteFill style={{transform: `translateY(${(k - 1) * 100}%)`, background: strong ? "linear-gradient(180deg, rgba(14,15,17,0.93) 0%, rgba(36,4,4,0.95) 100%)" : "linear-gradient(180deg, rgba(14,15,17,0.66) 0%, rgba(43,6,6,0.70) 100%)"}} />
			<div style={{position: "absolute", left: 0, right: 0, top: 120, display: "flex", justifyContent: "center", opacity: pill, transform: `translateY(${(1 - pill) * -16}px)`}}>
				<div style={{display: "flex", alignItems: "center", gap: 16, padding: "14px 28px", borderRadius: 999, background: "rgba(255,255,255,0.08)", border: "1.5px solid rgba(255,255,255,0.18)", backdropFilter: "blur(16px)"}}>
					<LogoImg height={34} reveal={1} windowOn={1} />
					<span style={{fontFamily: THIN, fontWeight: 400, fontSize: 28, color: "rgba(255,255,255,0.85)"}}>asistente de ventas</span>
				</div>
			</div>
			{children}
		</AbsoluteFill>
	);
};

/** Chat bubble (the lead's message) used inside the veil. */
export const Msg: React.FC<{t: number; at: number; text: string; time: string; top: number; reply?: string; replyAt?: number}> = ({t, at, text, time, top, reply, replyAt}) => {
	const k = k01(t, at, 0.35);
	const r = reply ? k01(t, replyAt ?? at + 0.5, 0.35) : 0;
	return (
		<div style={{position: "absolute", left: 90, right: 130, top, opacity: k, transform: `translateY(${(1 - k) * 20}px)`}}>
			<div style={{display: "inline-block", maxWidth: 680, background: "rgba(14,15,17,0.84)", border: "1.5px solid rgba(255,255,255,0.14)", borderRadius: 30, borderBottomLeftRadius: 8, boxShadow: "0 18px 40px -18px rgba(0,0,0,0.6)", padding: "20px 26px", fontFamily: THIN, fontWeight: 400, fontSize: 36, color: "#fff"}}>
				{text}
				<div style={{fontSize: 22, opacity: 0.6, marginTop: 6, textAlign: "right"}}>{time}</div>
			</div>
			{reply && (
				<div style={{display: "flex", justifyContent: "flex-end", marginTop: 16, opacity: r, transform: `translateY(${(1 - r) * 16}px)`}}>
					<div style={{fontFamily: THIN, fontWeight: 400, fontSize: 26, color: "#fff", background: "rgba(225,6,0,0.85)", borderRadius: 999, padding: "10px 22px"}}>{reply}</div>
				</div>
			)}
		</div>
	);
};

export {NUM};
