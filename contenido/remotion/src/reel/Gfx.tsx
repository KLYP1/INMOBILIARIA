import React from "react";
import {AbsoluteFill, Easing, interpolate} from "remotion";
import {CARD, FONT, RED, useAppear, useSpring, Window} from "./brand";

const TOP = 72; // top band (wall above her head) — keeps every card off her face

/** Brand card: near-black, hairline border, tiny red window in the corner (recurring motif). */
export const Card: React.FC<{from: number; to: number; y?: number; width?: number; children: React.ReactNode; motif?: boolean}> = ({from, to, y = TOP, width = 860, children, motif = true}) => {
	const {k, inK} = useAppear(from, to);
	if (k <= 0) return null;
	return (
		<div
			style={{
				position: "absolute",
				left: (1080 - width) / 2,
				top: y,
				width,
				background: CARD,
				borderRadius: 30,
				border: "1px solid rgba(255,255,255,0.08)",
				boxShadow: "0 18px 50px rgba(0,0,0,0.28)",
				padding: "30px 36px",
				opacity: k,
				transform: `translateY(${(1 - inK) * 22}px) scale(${(0.96 + 0.04 * inK) * 0.86})`,
				transformOrigin: "center top",
				fontFamily: FONT,
				color: "#fff",
			}}
		>
			{motif && (
				<div style={{position: "absolute", left: 22, top: 20}}>
					<Window size={16} />
				</div>
			)}
			{children}
		</div>
	);
};

/** WhatsApp-like bubble in the brand style. side 'in' = client (left), 'out' = advisor (right). */
export const Bubble: React.FC<{at: number; side: "in" | "out"; text: string; time: string; big?: boolean; muted?: number}> = ({at, side, text, time, big, muted = 1}) => {
	const sp = useSpring(at, {damping: 17, stiffness: 210});
	if (sp <= 0.001) return null;
	const isIn = side === "in";
	return (
		<div style={{display: "flex", justifyContent: isIn ? "flex-start" : "flex-end", marginTop: 14}}>
			<div
				style={{
					maxWidth: 640,
					background: isIn ? "#1C1C1E" : "#2A2A2D",
					borderRadius: isIn ? "6px 26px 26px 26px" : "26px 6px 26px 26px",
					padding: big ? "20px 28px 16px" : "16px 24px 12px",
					fontSize: big ? 42 : 34,
					fontWeight: 600,
					lineHeight: 1.18,
					letterSpacing: -0.4,
					opacity: Math.min(1, sp * 1.4) * muted,
					transform: `translateY(${(1 - sp) * 18}px) scale(${0.94 + 0.06 * sp})`,
					transformOrigin: isIn ? "left top" : "right top",
					borderLeft: isIn ? `3px solid ${RED}` : undefined,
				}}
			>
				{text}
				<div style={{fontSize: big ? 22 : 20, fontWeight: 500, opacity: 0.55, marginTop: 6, textAlign: "right", letterSpacing: 0}}>
					{time}
					{!isIn && <span style={{marginLeft: 8, color: "#7cc4ff"}}>✓✓</span>}
				</div>
			</div>
		</div>
	);
};

/** Hook: the client's reply arrives as a chat message. */
export const HookMessage: React.FC<{from: number; to: number}> = ({from, to}) => (
	<Card from={from} to={to} y={TOP} width={880} motif={false}>
		<div style={{display: "flex", alignItems: "center", gap: 14, fontSize: 24, fontWeight: 600, opacity: 0.7, marginBottom: 2}}>
			<div style={{width: 40, height: 40, borderRadius: 20, background: "#3a3a3c", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20}}>C</div>
			Cliente · ahora
		</div>
		<Bubble at={from + 0.12} side="in" text="Gracias, pero ya separé en otro proyecto." time="" big />
	</Card>
);

/** Domingo → lunes conversation, then the same reply again. */
export const Conversation: React.FC<{from: number; to: number; outAt: number; lostAt: number; replyAt: number}> = ({from, to, outAt, lostAt, replyAt}) => {
	const {t} = useAppear(from, to);
	const lost = useSpring(lostAt, {damping: 12, stiffness: 220});
	const shrink = interpolate(t, [replyAt - 0.2, replyAt + 0.15], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
	return (
		<Card from={from} to={to} y={TOP} width={900}>
			<div style={{height: 10}} />
			<div style={{overflow: "hidden", maxHeight: interpolate(shrink, [0, 1], [0, 180]), opacity: shrink}}>
				<Bubble at={from + 0.05} side="in" text="¿Precio del de dos dormitorios?" time="Dom 10:42 p. m." />
			</div>
			<div style={{position: "relative"}}>
				<Bubble at={outAt} side="out" text="¡Hola! Claro, te cuento…" time="Lun 10:00 a. m." />
				{lost > 0.01 && (
					<div
						style={{
							position: "absolute",
							left: 0,
							top: 30,
							background: RED,
							color: "#fff",
							fontWeight: 700,
							fontSize: 34,
							padding: "8px 18px",
							borderRadius: 14,
							transform: `scale(${0.7 + 0.3 * lost})`,
							opacity: Math.min(1, lost * 1.5),
							letterSpacing: -0.5,
						}}
					>
						+11 h
					</div>
				)}
			</div>
			<Bubble at={replyAt} side="in" text="Gracias, pero ya separé en otro proyecto." time="Lun 10:03 a. m." />
		</Card>
	);
};

/** precio / ubicación / proyecto appear one by one and get struck through. */
export const StrikeWords: React.FC<{from: number; to: number; at: number[]}> = ({from, to, at}) => {
	const {t} = useAppear(from, to);
	const words = ["precio", "ubicación", "proyecto"];
	return (
		<Card from={from} to={to} y={TOP} width={940}>
			<div style={{display: "flex", justifyContent: "center", gap: 34, padding: "6px 0"}}>
				{words.map((w, i) => {
					const a = interpolate(t, [at[i], at[i] + 0.25], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});
					const s = interpolate(t, [at[i] + 0.38, at[i] + 0.68], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic)});
					return (
						<div key={w} style={{position: "relative", fontSize: 56, fontWeight: 700, letterSpacing: -1, opacity: a * (1 - 0.45 * s), transform: `translateY(${(1 - a) * 14}px)`}}>
							{w}
							<div style={{position: "absolute", left: -4, top: "54%", height: 6, width: `${s * 104}%`, background: RED, borderRadius: 3}} />
						</div>
					);
				})}
			</div>
		</Card>
	);
};

/** RESPONDIÓ PRIMERO */
export const BigStatement: React.FC<{from: number; to: number}> = ({from, to}) => {
	const sp = useSpring(from, {damping: 14, stiffness: 230});
	const {t} = useAppear(from, to);
	const line = interpolate(t, [from + 0.15, from + 0.5], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});
	return (
		<Card from={from} to={to} y={TOP} width={900}>
			<div style={{textAlign: "center", transform: `scale(${0.9 + 0.1 * sp})`, padding: "4px 0 6px"}}>
				<div style={{fontSize: 84, fontWeight: 700, letterSpacing: -2, lineHeight: 1}}>RESPONDIÓ</div>
				<div style={{fontSize: 84, fontWeight: 700, letterSpacing: -2, lineHeight: 1.05, color: RED}}>PRIMERO</div>
				<div style={{height: 3, width: `${line * 60}%`, background: "rgba(255,255,255,0.35)", margin: "18px auto 0"}} />
			</div>
		</Card>
	);
};

const IconBox: React.FC<{children: React.ReactNode; at: number; label: string}> = ({children, at, label}) => {
	const sp = useSpring(at, {damping: 14, stiffness: 220});
	return (
		<div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 12, opacity: Math.min(1, sp * 1.5), transform: `translateY(${(1 - sp) * 20}px) scale(${0.85 + 0.15 * sp})`}}>
			<svg width={104} height={104} viewBox="0 0 48 48" fill="none" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
				{children}
			</svg>
			<div style={{fontSize: 24, fontWeight: 600, opacity: 0.75}}>{label}</div>
		</div>
	);
};

/** Instagram, Messenger and WhatsApp as thin line icons. */
export const Channels: React.FC<{from: number; to: number}> = ({from, to}) => (
	<Card from={from} to={to} y={TOP} width={820}>
		<div style={{display: "flex", justifyContent: "space-around", padding: "8px 0 2px"}}>
			<IconBox at={from + 0.05} label="Instagram">
				<rect x="8" y="8" width="32" height="32" rx="9" />
				<circle cx="24" cy="24" r="7.5" />
				<circle cx="33.5" cy="14.5" r="1.4" fill="#fff" />
			</IconBox>
			<IconBox at={from + 0.17} label="Messenger">
				<path d="M24 7C14.6 7 7.5 13.9 7.5 22.8c0 4.8 2.1 9 5.6 11.8V41l6-3.3c1.6.4 3.2.7 4.9.7 9.4 0 16.5-6.9 16.5-15.6S33.4 7 24 7z" />
				<path d="M14.5 27.5l6.2-6.6 4.2 3.5 6.5-6.9-6.2 6.6-4.2-3.5z" />
			</IconBox>
			<IconBox at={from + 0.29} label="WhatsApp">
				<path d="M24 7.5c-9.1 0-16.5 7.2-16.5 16.1 0 3 .9 5.9 2.4 8.3L8 40.5l8.9-2.3c2.2 1.2 4.6 1.8 7.1 1.8 9.1 0 16.5-7.2 16.5-16.1S33.1 7.5 24 7.5z" />
				<path d="M18.2 16.8c.4-.8.8-.8 1.2-.8h.9c.3 0 .6.1.9.7l1.3 3.1c.1.4.1.7-.1 1l-.8 1c-.2.3-.4.6-.1 1 .9 1.6 2.5 3.2 4.3 4.1.4.2.7.1 1-.2l1-1.2c.3-.3.6-.4 1-.2l3 1.4c.4.2.6.4.6.7 0 1.2-.5 2.2-1.5 2.9-1.3.8-2.9.9-5.5-.2-3.3-1.4-5.7-4.6-6.4-5.8-.7-1.2-1.5-3-1.3-4.7.1-1.1.5-2 1.3-2.8z" />
			</IconBox>
		</div>
	</Card>
);

/** 24/7 in a large figure. */
export const AllDay: React.FC<{from: number; to: number}> = ({from, to}) => {
	const sp = useSpring(from, {damping: 13, stiffness: 200});
	return (
		<Card from={from} to={to} y={TOP} width={620}>
			<div style={{textAlign: "center", transform: `scale(${0.85 + 0.15 * sp})`}}>
				<div style={{fontSize: 150, fontWeight: 700, letterSpacing: -6, lineHeight: 1}}>
					24<span style={{color: RED}}>/</span>7
				</div>
				<div style={{fontSize: 28, fontWeight: 500, opacity: 0.7, marginTop: 6, letterSpacing: 1}}>en segundos · a cualquier hora</div>
			</div>
		</Card>
	);
};

/** Mini mockup: budget question → matching units → confirmed visit. */
export const Mockup: React.FC<{from: number; to: number; unitsAt: number; calAt: number}> = ({from, to, unitsAt, calAt}) => {
	const {t} = useAppear(from, to);
	const stage = t < unitsAt ? 0 : t < calAt ? 1 : 2;
	const units = useSpring(unitsAt);
	const cal = useSpring(calAt);
	const check = interpolate(t, [calAt + 0.25, calAt + 0.6], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});
	const unitCard = (name: string, d: number) => (
		<div style={{flex: 1, background: "#1C1C1E", borderRadius: 18, padding: "16px 18px", border: "1px solid rgba(255,255,255,0.07)", opacity: Math.min(1, units * 1.4), transform: `translateY(${(1 - units) * (16 + d)}px)`}}>
			<div style={{height: 64, borderRadius: 10, background: "linear-gradient(135deg,#2c2c2f,#1f1f22)", marginBottom: 12, display: "flex", alignItems: "flex-end", padding: 8}}>
				<Window size={14} />
			</div>
			<div style={{fontSize: 28, fontWeight: 700}}>{name}</div>
			<div style={{fontSize: 22, opacity: 0.6, fontWeight: 500}}>2 dormitorios · disponible</div>
		</div>
	);
	return (
		<Card from={from} to={to} y={TOP} width={900}>
			<div style={{height: 8}} />
			{stage === 0 && <Bubble at={from + 0.08} side="out" text="¿Cuál es tu presupuesto?" time="Asistente KLYP · ahora" />}
			{stage === 1 && (
				<div style={{display: "flex", gap: 18, marginTop: 14}}>
					{unitCard("Unidad A", 0)}
					{unitCard("Unidad B", 10)}
				</div>
			)}
			{stage === 2 && (
				<div style={{display: "flex", alignItems: "center", gap: 26, marginTop: 14, opacity: Math.min(1, cal * 1.4), transform: `scale(${0.92 + 0.08 * cal})`}}>
					<svg width={120} height={120} viewBox="0 0 48 48" fill="none" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
						<rect x="7" y="10" width="34" height="31" rx="5" />
						<path d="M7 18h34M16 6v8M32 6v8" />
						<path d="M17 29l5 5 9-10" stroke={RED} strokeWidth={3.2} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - check} />
					</svg>
					<div>
						<div style={{fontSize: 42, fontWeight: 700, letterSpacing: -0.8}}>Visita confirmada</div>
						<div style={{fontSize: 26, opacity: 0.65, fontWeight: 500, marginTop: 4}}>Agendada por el asistente</div>
					</div>
				</div>
			)}
		</Card>
	);
};

/** comenta DEMO */
export const DemoCTA: React.FC<{from: number; to: number}> = ({from, to}) => {
	const sp = useSpring(from, {damping: 13, stiffness: 210});
	return (
		<Card from={from} to={to} y={TOP} width={760}>
			<div style={{display: "flex", alignItems: "center", justifyContent: "center", gap: 28, transform: `scale(${0.88 + 0.12 * sp})`}}>
				<svg width={110} height={110} viewBox="0 0 48 48" fill="none" stroke="#fff" strokeWidth={2.4} strokeLinejoin="round">
					<path d="M8 10h32a3 3 0 0 1 3 3v19a3 3 0 0 1-3 3H20l-8 7v-7H8a3 3 0 0 1-3-3V13a3 3 0 0 1 3-3z" />
					<path d="M15 21h18M15 27h11" strokeLinecap="round" />
				</svg>
				<div>
					<div style={{fontSize: 30, fontWeight: 600, opacity: 0.75}}>Comenta</div>
					<div style={{fontSize: 118, fontWeight: 700, letterSpacing: -3, lineHeight: 0.95}}>DEMO</div>
					<div style={{height: 7, width: "100%", background: RED, borderRadius: 4, marginTop: 8}} />
				</div>
			</div>
		</Card>
	);
};

export const Fill: React.FC<{children: React.ReactNode}> = ({children}) => <AbsoluteFill style={{pointerEvents: "none"}}>{children}</AbsoluteFill>;
