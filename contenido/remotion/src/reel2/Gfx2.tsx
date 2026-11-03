import React from "react";
import {Easing, interpolate} from "remotion";
import {FONT, RED, useAppear, useSpring, Window} from "../reel/brand";
import {Bubble, Card} from "../reel/Gfx";

/** Hook: a client's message left on "Visto". */
export const SeenMessage: React.FC<{from: number; to: number}> = ({from, to}) => {
	const {t} = useAppear(from, to);
	const seen = interpolate(t, [from + 0.9, from + 1.2], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
	return (
		<Card from={from} to={to} width={860} motif={false}>
			<div style={{display: "flex", alignItems: "center", gap: 14, fontSize: 24, fontWeight: 600, opacity: 0.7}}>
				<div style={{width: 40, height: 40, borderRadius: 20, background: "#3a3a3c", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20}}>C</div>
				Cliente · Instagram
			</div>
			<Bubble at={from + 0.12} side="in" text="Hola, ¿me pueden dar información del proyecto?" time="" big />
			<div style={{marginTop: 10, fontSize: 24, fontWeight: 600, opacity: 0.6 * seen, display: "flex", alignItems: "center", gap: 8}}>
				<span style={{color: "#8e8e93"}}>✓✓</span> Visto
			</div>
		</Card>
	);
};

/** "No ellos a ti. / Tú a ellos." */
export const Twist: React.FC<{from: number; to: number; redAt: number}> = ({from, to, redAt}) => {
	const a = useSpring(from, {damping: 15, stiffness: 220});
	const b = useSpring(redAt, {damping: 12, stiffness: 240});
	return (
		<Card from={from} to={to} width={820}>
			<div style={{textAlign: "center", padding: "6px 0"}}>
				<div style={{fontSize: 76, fontWeight: 700, letterSpacing: -2, lineHeight: 1.02, opacity: a, transform: `translateY(${(1 - a) * 12}px)`}}>No ellos a ti.</div>
				<div style={{fontSize: 76, fontWeight: 700, letterSpacing: -2, lineHeight: 1.08, color: RED, opacity: Math.min(1, b * 1.4), transform: `scale(${0.85 + 0.15 * b})`}}>Tú a ellos.</div>
			</div>
		</Card>
	);
};

/** Instagram inbox with unread chats. */
export const Inbox: React.FC<{from: number; to: number}> = ({from, to}) => {
	const rows = [["María T.", "¿Todavía hay disponibles?", "Sáb"], ["Jorge R.", "¿Aceptan crédito Mivivienda?", "Dom"], ["Ana P.", "Hola, quisiera información…", "Dom"]];
	return (
		<Card from={from} to={to} width={880}>
			<div style={{display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 26, fontWeight: 700, margin: "0 0 10px 28px"}}>
				<span>Mensajes</span>
				<span style={{fontSize: 22, fontWeight: 600, color: RED}}>3 sin leer</span>
			</div>
			{rows.map(([n, m, d], i) => {
				const sp = useSpring(from + 0.1 + i * 0.12);
				return (
					<div key={i} style={{display: "flex", alignItems: "center", gap: 16, padding: "10px 4px", borderTop: "1px solid rgba(255,255,255,0.07)", opacity: Math.min(1, sp * 1.4), transform: `translateX(${(1 - sp) * 24}px)`}}>
						<div style={{width: 46, height: 46, borderRadius: 23, background: "#2c2c2e", flexShrink: 0}} />
						<div style={{flex: 1, minWidth: 0}}>
							<div style={{fontSize: 25, fontWeight: 700}}>{n}</div>
							<div style={{fontSize: 22, fontWeight: 600, opacity: 0.85, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>{m}</div>
						</div>
						<div style={{fontSize: 20, opacity: 0.55}}>{d}</div>
						<div style={{width: 12, height: 12, borderRadius: 6, background: RED}} />
					</div>
				);
			})}
		</Card>
	);
};

/** Weekend messages piling up unanswered, with a red counter of unanswered chats. */
export const Unanswered: React.FC<{from: number; to: number; b2: number; countAt: number}> = ({from, to, b2, countAt}) => {
	const {t} = useAppear(from, to);
	const c = interpolate(t, [countAt, countAt + 0.45, countAt + 0.9], [3, 8, 14], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
	const shown = t < countAt ? 0 : Math.round(c);
	const pop = useSpring(countAt, {damping: 12, stiffness: 240});
	return (
		<Card from={from} to={to} width={880}>
			<div style={{display: "flex", justifyContent: "flex-end", height: 34}}>
				{shown > 0 && (
					<div style={{display: "flex", alignItems: "center", gap: 10, background: RED, borderRadius: 999, padding: "4px 16px", fontSize: 24, fontWeight: 700, transform: `scale(${0.8 + 0.2 * pop})`}}>
						<span style={{fontVariantNumeric: "tabular-nums", minWidth: 30, textAlign: "right"}}>{shown}</span> sin responder
					</div>
				)}
			</div>
			<Bubble at={from + 0.05} side="in" text="¿Todavía hay disponibles?" time="Sáb 9:15 p. m. · sin respuesta" />
			<Bubble at={b2} side="in" text="¿Aceptan crédito Mivivienda?" time="Dom 11:30 a. m. · sin respuesta" />
		</Card>
	);
};

const LineIcon: React.FC<{at: number; label: string; children: React.ReactNode}> = ({at, label, children}) => {
	const sp = useSpring(at, {damping: 13, stiffness: 210});
	return (
		<div style={{display: "flex", alignItems: "center", gap: 26, justifyContent: "center", opacity: Math.min(1, sp * 1.4), transform: `scale(${0.85 + 0.15 * sp})`}}>
			<svg width={120} height={120} viewBox="0 0 48 48" fill="none" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
				{children}
			</svg>
			<div style={{fontSize: 40, fontWeight: 700, letterSpacing: -0.8, maxWidth: 420}}>{label}</div>
		</div>
	);
};

/** Paid ad (S/) */
export const AdIcon: React.FC<{from: number; to: number}> = ({from, to}) => (
	<Card from={from} to={to} width={760}>
		<LineIcon at={from} label="Tu anuncio pagado">
			<rect x="6" y="9" width="36" height="28" rx="4" />
			<path d="M6 16h36" />
			<text x="24" y="31.5" textAnchor="middle" fontFamily={FONT} fontSize="10" fontWeight="700" fill={RED} stroke="none">S/</text>
			<path d="M18 42h12M24 37v5" />
		</LineIcon>
	</Card>
);

/** Raised hand */
export const HandIcon: React.FC<{from: number; to: number}> = ({from, to}) => (
	<Card from={from} to={to} width={760}>
		<LineIcon at={from} label="Levantó la mano">
			<path d="M17 25V12a2.5 2.5 0 0 1 5 0v11M22 23V8.5a2.5 2.5 0 0 1 5 0V23M27 23V10.5a2.5 2.5 0 0 1 5 0V25M32 25v-8.5a2.5 2.5 0 0 1 5 0V30c0 7-5 12-11.5 12h-1.5c-4 0-6.6-1.6-8.7-4.7L10 30.5a2.6 2.6 0 0 1 4-3.2l3 3" />
		</LineIcon>
	</Card>
);

/** No te faltan clientes. Te falta quien les conteste. */
export const Statement: React.FC<{from: number; to: number; redAt: number}> = ({from, to, redAt}) => {
	const {t} = useAppear(from, to);
	const a = useSpring(from, {damping: 15, stiffness: 220});
	const b = useSpring(redAt, {damping: 13, stiffness: 230});
	const line = interpolate(t, [redAt + 0.1, redAt + 0.45], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});
	return (
		<Card from={from} to={to} width={940}>
			<div style={{textAlign: "center", padding: "4px 0"}}>
				<div style={{fontSize: 56, fontWeight: 700, letterSpacing: -1.4, lineHeight: 1.08, opacity: a}}>No te faltan clientes.</div>
				<div style={{fontSize: 56, fontWeight: 700, letterSpacing: -1.4, lineHeight: 1.12, opacity: Math.min(1, b * 1.4), transform: `translateY(${(1 - b) * 10}px)`}}>
					Te falta <span style={{color: RED}}>quien les conteste.</span>
				</div>
				<div style={{height: 3, width: `${line * 50}%`, background: "rgba(255,255,255,0.3)", margin: "14px auto 0"}} />
			</div>
		</Card>
	);
};

/** The unanswered messages now get answered (check), then a confirmed visit. */
export const Answered: React.FC<{from: number; to: number; second: number; calAt: number}> = ({from, to, second, calAt}) => {
	const {t} = useAppear(from, to);
	const stage = t < second ? 0 : t < calAt ? 1 : 2;
	const cal = useSpring(calAt);
	const check = interpolate(t, [calAt + 0.25, calAt + 0.6], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});
	return (
		<Card from={from} to={to} width={880}>
			{stage === 0 && (
				<>
					<Bubble at={from} side="in" text="¿Todavía hay disponibles?" time="Sáb 9:15 p. m." />
					<Bubble at={from + 0.35} side="out" text="¡Hola! Sí, te cuento…" time="Asistente · 9:15 p. m." />
				</>
			)}
			{stage === 1 && (
				<>
					<Bubble at={second} side="in" text="¿Aceptan crédito Mivivienda?" time="Dom 11:30 a. m." />
					<Bubble at={second + 0.35} side="out" text="¡Hola! Sí, te explico…" time="Asistente · 11:30 a. m." />
				</>
			)}
			{stage === 2 && (
				<div style={{display: "flex", alignItems: "center", gap: 26, padding: "6px 0", opacity: Math.min(1, cal * 1.4), transform: `scale(${0.92 + 0.08 * cal})`}}>
					<svg width={120} height={120} viewBox="0 0 48 48" fill="none" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
						<rect x="7" y="10" width="34" height="31" rx="5" />
						<path d="M7 18h34M16 6v8M32 6v8" />
						<path d="M17 29l5 5 9-10" stroke={RED} strokeWidth={3.2} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - check} />
					</svg>
					<div>
						<div style={{fontSize: 42, fontWeight: 700, letterSpacing: -0.8}}>Visita confirmada</div>
						<div style={{fontSize: 26, opacity: 0.65, fontWeight: 500, marginTop: 4}}>Agendada para tu equipo</div>
					</div>
				</div>
			)}
		</Card>
	);
};

export {Window};
