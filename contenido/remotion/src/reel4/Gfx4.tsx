import React from "react";
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {FONT, RED, useAppear, useSpring, Window} from "../reel/brand";
import {Bubble, Card} from "../reel/Gfx";

export const LOW = 130; // wall above her head (wider framing)

/** Hook: big text in two beats. */
export const HookText: React.FC<{from: number; to: number; secondAt: number}> = ({from, to, secondAt}) => {
	const {t} = useAppear(from, to);
	const a = useSpring(from, {damping: 15, stiffness: 220});
	const b = useSpring(secondAt, {damping: 14, stiffness: 220});
	const first = t < secondAt;
	return (
		<Card from={from} to={to} y={LOW} width={900}>
			{first ? (
				<div style={{textAlign: "center", fontSize: 62, fontWeight: 700, letterSpacing: -1.6, lineHeight: 1.08, transform: `scale(${0.9 + 0.1 * a})`, padding: "6px 0"}}>
					¿Todavía respondes<br />todo <span style={{color: RED}}>a mano?</span>
				</div>
			) : (
				<div style={{textAlign: "center", transform: `scale(${0.9 + 0.1 * b})`, padding: "2px 0"}}>
					<div style={{fontSize: 66, fontWeight: 700, letterSpacing: -1.8, lineHeight: 1.05}}>
						<span style={{color: RED}}>3 cosas</span> para activar hoy
					</div>
					<div style={{display: "flex", justifyContent: "center", gap: 14, marginTop: 14}}>
						{["Gratis", "En 5 minutos"].map((x, i) => (
							<div key={x} style={{fontSize: 30, fontWeight: 600, padding: "6px 20px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.25)", opacity: interpolate(t, [secondAt + 0.9 + i * 0.5, secondAt + 1.2 + i * 0.5], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"})}}>{x}</div>
						))}
					</div>
				</div>
			)}
		</Card>
	);
};

/** Persistent checklist at the very top (above her head). active = 0..3, done = list of checked indices. */
export const Checklist: React.FC<{from: number; to: number; steps: [number, number][]}> = ({from, to, steps}) => {
	const {t, k} = useAppear(from, to);
	if (k <= 0) return null;
	const items = ["Mensaje de ausencia", "Respuestas rápidas", "Preguntas frecuentes"];
	return (
		<div style={{position: "absolute", left: 40, right: 40, top: 34, display: "flex", gap: 10, justifyContent: "center", opacity: k, transform: `translateY(${(1 - k) * -16}px)`, fontFamily: FONT}}>
			{items.map((it, i) => {
				const [on, done] = steps[i];
				const active = t >= on && t < done;
				const isDone = t >= done;
				const ck = interpolate(t, [done, done + 0.3], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
				const show = interpolate(t, [on - 0.05, on + 0.25], [0.45, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
				return (
					<div key={i} style={{display: "flex", alignItems: "center", gap: 10, background: active ? "rgba(10,10,10,0.95)" : "rgba(10,10,10,0.78)", border: `1px solid ${active ? "rgba(225,6,0,0.7)" : "rgba(255,255,255,0.08)"}`, borderRadius: 999, padding: "10px 16px 10px 10px", color: "#fff", opacity: t >= on ? 1 : 0.55 * show}}>
						<div style={{width: 34, height: 34, borderRadius: 17, background: isDone ? RED : "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, fontWeight: 700}}>
							{isDone ? (
								<svg width={20} height={20} viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ck} /></svg>
							) : (
								i + 1
							)}
						</div>
						<div style={{fontSize: 22, fontWeight: 600, whiteSpace: "nowrap"}}>{it}</div>
					</div>
				);
			})}
		</div>
	);
};

/** Big number + title for each point. */
export const PointTitle: React.FC<{from: number; to: number; n: number; title: string; sub: string; icon: React.ReactNode}> = ({from, to, n, title, sub, icon}) => {
	const sp = useSpring(from, {damping: 14, stiffness: 210});
	return (
		<Card from={from} to={to} y={LOW} width={900}>
			<div style={{display: "flex", alignItems: "center", gap: 28}}>
				<div style={{fontSize: 150, fontWeight: 700, color: RED, lineHeight: 0.85, letterSpacing: -6, transform: `scale(${0.8 + 0.2 * sp})`}}>{n}</div>
				<div style={{flex: 1}}>
					<div style={{fontSize: 50, fontWeight: 700, letterSpacing: -1.2, lineHeight: 1.05}}>{title}</div>
					<div style={{fontSize: 28, fontWeight: 500, opacity: 0.65, marginTop: 6}}>{sub}</div>
				</div>
				<svg width={90} height={90} viewBox="0 0 48 48" fill="none" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" style={{opacity: 0.9}}>{icon}</svg>
			</div>
		</Card>
	);
};

export const WA = (
	<>
		<path d="M24 7.5c-9.1 0-16.5 7.2-16.5 16.1 0 3 .9 5.9 2.4 8.3L8 40.5l8.9-2.3c2.2 1.2 4.6 1.8 7.1 1.8 9.1 0 16.5-7.2 16.5-16.1S33.1 7.5 24 7.5z" />
		<path d="M18.2 16.8c.4-.8.8-.8 1.2-.8h.9c.3 0 .6.1.9.7l1.3 3.1c.1.4.1.7-.1 1l-.8 1c-.2.3-.4.6-.1 1 .9 1.6 2.5 3.2 4.3 4.1.4.2.7.1 1-.2l1-1.2c.3-.3.6-.4 1-.2l3 1.4c.4.2.6.4.6.7 0 1.2-.5 2.2-1.5 2.9-1.3.8-2.9.9-5.5-.2-3.3-1.4-5.7-4.6-6.4-5.8-.7-1.2-1.5-3-1.3-4.7.1-1.1.5-2 1.3-2.8z" />
	</>
);
export const BOLT = <path d="M27 4L11 27h12l-3 17 17-24H25z" />;
export const IG = (
	<>
		<rect x="8" y="8" width="32" height="32" rx="9" />
		<circle cx="24" cy="24" r="7.5" />
		<circle cx="33.5" cy="14.5" r="1.4" fill="#fff" />
	</>
);

/** Away message mockup. */
export const AwayMessage: React.FC<{from: number; to: number; replyAt: number}> = ({from, to, replyAt}) => (
	<Card from={from} to={to} y={LOW} width={900}>
		<div style={{height: 4}} />
		<Bubble at={from + 0.05} side="in" text="Hola, ¿qué precio tiene el de 2 dormitorios?" time="Dom 10:42 p. m. · fuera de horario" />
		<Bubble at={replyAt} side="out" text="¡Hola! Mañana a primera hora te enviamos los precios y disponibilidad." time="Respuesta automática" />
	</Card>
);

/** Quick replies saved as shortcuts. */
export const QuickReplies: React.FC<{from: number; to: number; at: number[]; fastAt: number}> = ({from, to, at, fastAt}) => {
	const {t} = useAppear(from, to);
	const items = [["/precio", "Precio"], ["/disponible", "Disponibilidad"], ["/ubicacion", "Ubicación"], ["/inicial", "Inicial del depa"]];
	const fast = interpolate(t, [fastAt, fastAt + 0.3], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
	return (
		<Card from={from} to={to} y={LOW} width={900}>
			<div style={{display: "flex", justifyContent: "space-between", alignItems: "center", margin: "0 0 12px 28px"}}>
				<div style={{fontSize: 26, fontWeight: 700}}>Respuestas rápidas</div>
				<div style={{fontSize: 22, fontWeight: 600, color: RED, opacity: fast}}>Responde en segundos</div>
			</div>
			<div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12}}>
				{items.map(([k, v], i) => {
					const sp = useSpring(at[i], {damping: 15, stiffness: 220});
					return (
						<div key={k} style={{background: "#1C1C1E", borderRadius: 16, padding: "12px 18px", border: "1px solid rgba(255,255,255,0.07)", opacity: Math.min(1, sp * 1.4), transform: `translateY(${(1 - sp) * 16}px)`}}>
							<div style={{fontSize: 28, fontWeight: 700, fontFamily: "monospace", letterSpacing: -0.5}}>{k}</div>
							<div style={{fontSize: 21, opacity: 0.6, fontWeight: 500}}>{v}</div>
						</div>
					);
				})}
			</div>
		</Card>
	);
};

/** Instagram FAQ buttons; one gets tapped and the chat starts. */
export const FaqButtons: React.FC<{from: number; to: number; tapAt: number}> = ({from, to, tapAt}) => {
	const {t} = useAppear(from, to);
	const qs = ["¿Cuál es el precio?", "¿Hay disponibilidad?", "¿Dónde están ubicados?", "¿Cuánto es la inicial?"];
	const tapped = t >= tapAt;
	const sps = [useSpring(from + 0.15), useSpring(from + 0.27), useSpring(from + 0.39), useSpring(from + 0.51)];
	return (
		<Card from={from} to={to} y={LOW} width={900}>
			<div style={{fontSize: 22, fontWeight: 600, opacity: 0.6, margin: "0 0 10px 28px"}}>Instagram · Preguntas frecuentes</div>
			{!tapped && (
				<div style={{display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center"}}>
					{qs.map((q, i) => {
						const sp = sps[i];
						const press = i === 0 ? interpolate(t, [tapAt - 0.25, tapAt - 0.1, tapAt], [1, 0.92, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}) : 1;
						return (
							<div key={q} style={{fontSize: 28, fontWeight: 600, padding: "12px 22px", borderRadius: 999, border: `1.5px solid ${i === 0 && t > tapAt - 0.25 ? RED : "rgba(255,255,255,0.35)"}`, opacity: Math.min(1, sp * 1.4), transform: `scale(${(0.9 + 0.1 * sp) * press})`}}>{q}</div>
						);
					})}
				</div>
			)}
			{tapped && (
				<>
					<Bubble at={tapAt} side="in" text="¿Cuál es el precio?" time="Cliente · ahora" />
					<Bubble at={tapAt + 0.6} side="out" text="¡Hola! Te cuento las opciones…" time="Respuesta automática" />
				</>
			)}
		</Card>
	);
};

/** Big conclusion. */
export const Conclusion: React.FC<{from: number; to: number}> = ({from, to}) => {
	const sp = useSpring(from, {damping: 14, stiffness: 220});
	return (
		<Card from={from} to={to} y={LOW} width={900}>
			<div style={{textAlign: "center", fontSize: 58, fontWeight: 700, letterSpacing: -1.5, lineHeight: 1.08, transform: `scale(${0.9 + 0.1 * sp})`, padding: "6px 0"}}>
				Ya respondes mejor<br /><span style={{color: RED}}>que la mayoría.</span>
			</div>
		</Card>
	);
};

/** Next videos teaser: qualify + schedule on their own. */
export const NextUp: React.FC<{from: number; to: number; at: [number, number]}> = ({from, to, at}) => {
	const a = useSpring(at[0]);
	const b = useSpring(at[1]);
	const chip = (k: number, label: string, icon: React.ReactNode) => (
		<div style={{display: "flex", alignItems: "center", gap: 14, background: "#1C1C1E", borderRadius: 18, padding: "14px 20px", opacity: Math.min(1, k * 1.4), transform: `translateY(${(1 - k) * 16}px)`}}>
			<svg width={52} height={52} viewBox="0 0 48 48" fill="none" stroke="#fff" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
			<div style={{fontSize: 30, fontWeight: 700}}>{label}</div>
		</div>
	);
	return (
		<Card from={from} to={to} y={LOW} width={880}>
			<div style={{fontSize: 22, fontWeight: 600, opacity: 0.6, margin: "0 0 12px 28px"}}>En los siguientes videos</div>
			<div style={{display: "flex", gap: 14, justifyContent: "center"}}>
				{chip(a, "Califica solo", <><circle cx="24" cy="24" r="17" /><path d="M16 24.5l5.5 5.5L32 19" stroke={RED} strokeWidth={3} /></>)}
				{chip(b, "Agenda visitas", <><rect x="8" y="11" width="32" height="29" rx="5" /><path d="M8 19h32M17 7v8M31 7v8" /></>)}
			</div>
		</Card>
	);
};

export {Window};
