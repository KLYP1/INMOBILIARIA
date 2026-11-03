import React from "react";
import {Easing, interpolate} from "remotion";
import {FONT, RED, useAppear, useSpring, Window} from "../reel/brand";
import {Bubble, Card} from "../reel/Gfx";

/** PDF attachment bubble (sent by the team). `xAt` draws a red X over it. */
const PdfFile: React.FC<{at: number; xAt?: number; t: number}> = ({at, xAt, t}) => {
	const sp = useSpring(at, {damping: 17, stiffness: 210});
	const x = xAt === undefined ? 0 : interpolate(t, [xAt, xAt + 0.3], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});
	if (sp <= 0.001) return null;
	return (
		<div style={{display: "flex", justifyContent: "flex-end", marginTop: 14}}>
			<div style={{position: "relative", display: "flex", alignItems: "center", gap: 18, background: "#2A2A2D", borderRadius: "26px 6px 26px 26px", padding: "16px 22px", opacity: Math.min(1, sp * 1.4) * (1 - 0.35 * x), transform: `translateY(${(1 - sp) * 18}px) scale(${0.94 + 0.06 * sp})`, transformOrigin: "right top"}}>
				<svg width={54} height={64} viewBox="0 0 27 32" fill="none" stroke="#fff" strokeWidth={1.6} strokeLinejoin="round">
					<path d="M3 2h14l7 7v21H3z" />
					<path d="M17 2v7h7" />
					<rect x="6" y="18" width="15" height="7" rx="1.5" fill={RED} stroke="none" />
					<text x="13.5" y="23.4" textAnchor="middle" fontFamily={FONT} fontSize="5.2" fontWeight="700" fill="#fff" stroke="none">PDF</text>
				</svg>
				<div>
					<div style={{fontSize: 30, fontWeight: 700, letterSpacing: -0.3}}>Brochure_Proyecto.pdf</div>
					<div style={{fontSize: 22, fontWeight: 500, opacity: 0.6}}>20 págs. · 14 MB</div>
				</div>
				{x > 0 && (
					<svg style={{position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible"}} viewBox="0 0 100 100" preserveAspectRatio="none">
						<path d="M8 12 L92 88" stroke={RED} strokeWidth={5} strokeLinecap="round" vectorEffect="non-scaling-stroke" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.min(1, x * 2)} style={{strokeWidth: 7}} />
						<path d="M92 12 L8 88" stroke={RED} strokeWidth={5} strokeLinecap="round" vectorEffect="non-scaling-stroke" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.max(0, x * 2 - 1)} style={{strokeWidth: 7}} />
					</svg>
				)}
			</div>
		</div>
	);
};

/** Hook: «¿Precio?» → brochure PDF → red X. */
export const HookPdf: React.FC<{from: number; to: number; pdfAt: number; xAt: number}> = ({from, to, pdfAt, xAt}) => {
	const {t} = useAppear(from, to);
	return (
		<Card from={from} to={to} width={820} motif={false}>
			<Bubble at={from + 0.05} side="in" text="¿Precio?" time="Cliente · ahora" big />
			<PdfFile at={pdfAt} xAt={xAt} t={t} />
		</Card>
	);
};

/** Client message. */
export const ClientAsk: React.FC<{from: number; to: number}> = ({from, to}) => (
	<Card from={from} to={to} width={880}>
		<div style={{height: 6}} />
		<Bubble at={from + 0.05} side="in" text="Busco un depa de dos dormitorios para moverme el próximo año. ¿Precio?" time="Cliente · 8:12 p. m." />
	</Card>
);

/** Three generic replies falling one after another. */
export const GenericReplies: React.FC<{from: number; to: number; at: [number, number, number]}> = ({from, to, at}) => {
	const {t} = useAppear(from, to);
	return (
		<Card from={from} to={to} width={880}>
			<div style={{height: 2}} />
			<PdfFile at={at[0]} t={t} />
			<Bubble at={at[1]} side="out" text="Precios desde S/ …" time="Equipo de ventas" />
			<Bubble at={at[2]} side="out" text="Cualquier consulta, me avisa." time="Equipo de ventas" />
		</Card>
	);
};

/** 10-second timer that runs fast and turns red; then the chat slides away. */
export const Timer: React.FC<{from: number; to: number; runAt: number; leaveAt: number}> = ({from, to, runAt, leaveAt}) => {
	const {t} = useAppear(from, to, 0.3, 0.05);
	const p = interpolate(t, [runAt, runAt + 1.1], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
	const secs = Math.ceil(10 * (1 - p));
	const done = p >= 1;
	const leave = interpolate(t, [leaveAt, leaveAt + 0.45], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic)});
	const R = 46, C = 2 * Math.PI * R;
	const col = done ? RED : "#fff";
	return (
		<div style={{transform: `translateX(${-leave * 1200}px)`, opacity: 1 - leave * 0.6}}>
			<Card from={from} to={to} width={760}>
				<div style={{display: "flex", alignItems: "center", gap: 30, padding: "4px 6px"}}>
					<svg width={120} height={120} viewBox="0 0 120 120">
						<circle cx="60" cy="60" r={R} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={7} />
						<circle cx="60" cy="60" r={R} fill="none" stroke={col} strokeWidth={7} strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * p} transform="rotate(-90 60 60)" />
						<text x="60" y="73" textAnchor="middle" fontFamily={FONT} fontSize="38" fontWeight="700" fill={col}>{secs}</text>
					</svg>
					<div>
						<div style={{fontSize: 40, fontWeight: 700, letterSpacing: -0.8, color: done ? RED : "#fff"}}>{done ? "Sin respuesta" : "Buscando su respuesta…"}</div>
						<div style={{fontSize: 26, fontWeight: 500, opacity: 0.65, marginTop: 4}}>Brochure_Proyecto.pdf · 20 págs.</div>
					</div>
				</div>
			</Card>
		</div>
	);
};

/** Responder no es mandar información. Es ayudarle a decidir. */
export const Statement3: React.FC<{from: number; to: number; redAt: number}> = ({from, to, redAt}) => {
	const {t} = useAppear(from, to);
	const a = useSpring(from, {damping: 15, stiffness: 220});
	const b = useSpring(redAt, {damping: 13, stiffness: 230});
	const line = interpolate(t, [redAt + 0.1, redAt + 0.45], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});
	return (
		<Card from={from} to={to} width={940}>
			<div style={{textAlign: "center", padding: "4px 0"}}>
				<div style={{fontSize: 52, fontWeight: 700, letterSpacing: -1.3, lineHeight: 1.08, opacity: a}}>Responder no es mandar información.</div>
				<div style={{fontSize: 52, fontWeight: 700, letterSpacing: -1.3, lineHeight: 1.12, opacity: Math.min(1, b * 1.4), transform: `translateY(${(1 - b) * 10}px)`}}>
					Es <span style={{color: RED}}>ayudarle a decidir.</span>
				</div>
				<div style={{height: 3, width: `${line * 50}%`, background: "rgba(255,255,255,0.3)", margin: "14px auto 0"}} />
			</div>
		</Card>
	);
};

/** Assistant asks three questions; each gets a check. */
export const Questions: React.FC<{from: number; to: number; at: [number, number, number]}> = ({from, to, at}) => {
	const {t} = useAppear(from, to);
	const qs = ["¿Cuál es tu presupuesto?", "¿Cuántas personas son?", "¿Para cuándo buscas mudarte?"];
	return (
		<Card from={from} to={to} width={820}>
			<div style={{fontSize: 22, fontWeight: 600, opacity: 0.6, margin: "0 0 6px 28px"}}>Asistente KLYP</div>
			{qs.map((q, i) => {
				const sp = useSpring(at[i]);
				const ck = interpolate(t, [at[i] + 0.25, at[i] + 0.5], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
				return (
					<div key={i} style={{display: "flex", alignItems: "center", gap: 16, padding: "10px 6px", borderTop: i ? "1px solid rgba(255,255,255,0.07)" : undefined, opacity: Math.min(1, sp * 1.4), transform: `translateY(${(1 - sp) * 14}px)`}}>
						<svg width={34} height={34} viewBox="0 0 24 24">
							<circle cx="12" cy="12" r="11" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={1.6} />
							<path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke={RED} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ck} />
						</svg>
						<div style={{fontSize: 32, fontWeight: 600, letterSpacing: -0.4}}>{q}</div>
					</div>
				);
			})}
		</Card>
	);
};

/** Two or three unit cards in cascade. */
export const Units: React.FC<{from: number; to: number; at: number[]}> = ({from, to, at}) => {
	const units = [["Dpto. 702", "2 dorm · 68 m² · piso 7"], ["Dpto. 504", "2 dorm · 72 m² · piso 5"], ["Dpto. 1103", "2 dorm · 65 m² · piso 11"]];
	return (
		<Card from={from} to={to} width={940}>
			<div style={{display: "flex", gap: 14, marginTop: 8}}>
				{units.map(([n, d], i) => {
					const sp = useSpring(at[i], {damping: 15, stiffness: 200});
					return (
						<div key={i} style={{flex: 1, background: "#1C1C1E", borderRadius: 18, padding: "14px 16px", border: "1px solid rgba(255,255,255,0.07)", opacity: Math.min(1, sp * 1.4), transform: `translateY(${(1 - sp) * 26}px)`}}>
							<div style={{height: 54, borderRadius: 10, background: "linear-gradient(135deg,#2c2c2f,#1f1f22)", marginBottom: 10, display: "flex", alignItems: "flex-end", padding: 7}}>
								<Window size={12} />
							</div>
							<div style={{fontSize: 27, fontWeight: 700}}>{n}</div>
							<div style={{fontSize: 20, opacity: 0.65, fontWeight: 500}}>{d}</div>
						</div>
					);
				})}
			</div>
		</Card>
	);
};

/** Confirmed visit. */
export const Visit: React.FC<{from: number; to: number}> = ({from, to}) => {
	const {t} = useAppear(from, to);
	const sp = useSpring(from);
	const check = interpolate(t, [from + 0.25, from + 0.6], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});
	return (
		<Card from={from} to={to} width={820}>
			<div style={{display: "flex", alignItems: "center", gap: 26, padding: "4px 0", transform: `scale(${0.92 + 0.08 * sp})`}}>
				<svg width={110} height={110} viewBox="0 0 48 48" fill="none" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
					<rect x="7" y="10" width="34" height="31" rx="5" />
					<path d="M7 18h34M16 6v8M32 6v8" />
					<path d="M17 29l5 5 9-10" stroke={RED} strokeWidth={3.2} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - check} />
				</svg>
				<div>
					<div style={{fontSize: 40, fontWeight: 700, letterSpacing: -0.8}}>Visita confirmada</div>
					<div style={{fontSize: 26, opacity: 0.65, fontWeight: 500, marginTop: 4}}>Depa piloto · Sáb 11:00 a. m.</div>
				</div>
			</div>
		</Card>
	);
};
