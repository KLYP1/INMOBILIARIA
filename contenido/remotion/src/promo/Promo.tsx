import React from "react";
import {AbsoluteFill, Audio, Img, interpolate, Sequence, staticFile, useVideoConfig} from "remotion";
import {cond, Pw, thin} from "../reel5/Gala";
import {LogoImg} from "../reel/Reel";
import {toReal, Avatar, CalIcon, Check, glass, IgIcon, k01, K, kOut, Mono, MsgrIcon, Pill, SANS, Typing, useT, WaIcon} from "./ui";

export const PROMO_LEN = 25.6;

/* ───────── background: demo's night photo + veil + drifting glass sphere ───────── */
const Fondo: React.FC = () => {
	const t = useT();
	const end = k01(t, 24.4, 0.6);
	// sphere: corner accent during the UI, centred hero at open and close
	const hero = Math.max(kOut(t, 2.6, 0.5), end);
	const sz = 780 + 220 * (1 - hero);
	const x = interpolate(hero, [0, 1], [640, 150]) + Math.sin(t * 0.35) * 14;
	const y = interpolate(hero, [0, 1], [-170, 600 - 180 * end]) + Math.cos(t * 0.3) * 12;
	return (
		<AbsoluteFill style={{backgroundColor: K.noche}}>
			<Img src={staticFile("k/fondo.jpg")} style={{position: "absolute", width: "100%", height: "100%", objectFit: "cover", opacity: 0.55 * (1 - end), transform: `scale(${1.1 + t * 0.004})`}} />
			<AbsoluteFill style={{background: "linear-gradient(180deg, rgba(14,15,17,0.25), rgba(14,15,17,0.7))"}} />
			<Luces t={t} />
			<Img src={staticFile("k/esfera.png")} style={{position: "absolute", left: x, top: y, width: sz, height: sz, opacity: interpolate(hero, [0, 1], [0.35, 1]), mixBlendMode: "screen", WebkitMaskImage: "radial-gradient(circle closest-side, #000 94%, transparent 100%)", maskImage: "radial-gradient(circle closest-side, #000 94%, transparent 100%)"}} />
		</AbsoluteFill>
	);
};

/** Very faint out-of-focus city lights drifting behind everything, so the black never reads flat. */
const LUCES = Array.from({length: 42}, (_, i) => {
	const r = (n: number) => { const x = Math.sin(i * 127.1 + n * 311.7) * 43758.5453; return x - Math.floor(x); };
	return {x: r(1) * 1080, y: r(2) * 1920, s: 14 + r(3) ** 2 * 90, a: 0.1 + r(4) * 0.2, red: r(5) < 0.22, sp: 4 + r(6) * 10, ph: r(7) * 6.28, tw: 0.4 + r(8) * 0.8};
});
export const Luces: React.FC<{t: number}> = ({t}) => (
	<AbsoluteFill style={{pointerEvents: "none"}}>
		{LUCES.map((l, i) => {
			const y = ((l.y - t * l.sp) % 1980 + 1980) % 1980 - 30;
			const a = l.a * (0.65 + 0.35 * Math.sin(t * l.tw + l.ph));
			const c = l.red ? "242,58,63" : "255,236,214";
			return <div key={i} style={{position: "absolute", left: l.x + Math.sin(t * 0.2 + l.ph) * 10, top: y, width: l.s, height: l.s, borderRadius: 999, background: `radial-gradient(circle, rgba(${c},${a}) 0%, rgba(${c},${a * 0.45}) 40%, rgba(${c},0) 70%)`, filter: `blur(${l.s * 0.08}px)`}} />;
		})}
	</AbsoluteFill>
);

/* ───────── editorial headline (same type system as the reels) ───────── */
type H = {from: number; to: number; a: string; b: string; red?: "a" | "b"; order?: "thin-first" | "cond-first"};
const HEADS: H[] = [
	{from: 0.25, to: 2.75, a: "Llega un mensaje por", b: "Instagram", red: "b", order: "thin-first"},
	{from: 3.05, to: 5.75, a: "Responde", b: "al instante", order: "cond-first"},
	{from: 5.85, to: 10.5, a: "Califica", b: "presupuesto · plazo · financiamiento", order: "cond-first"},
	{from: 10.6, to: 14.3, a: "recomienda de", b: "tu inventario", red: "b", order: "thin-first"},
	{from: 14.4, to: 19.85, a: "agenda la", b: "visita", red: "b", order: "thin-first"},
	{from: 20.05, to: 24.4, a: "todo en un solo", b: "panel", red: "b", order: "thin-first"},
];
const Headline: React.FC = () => {
	const t = useT();
	const h = HEADS.find((x) => t >= x.from && t < x.to);
	if (!h) return null;
	const out = kOut(t, h.to - 0.25, 0.25);
	const thinFirst = h.order === "thin-first";
	const thinTxt = thinFirst ? h.a : h.b, condTxt = thinFirst ? h.b : h.a;
	const condColor = h.red ? K.rojo : K.texto;
	const T = <div key="t" style={thin(60, K.suave)}><Pw t={t} at={h.from}>{thinTxt}</Pw></div>;
	const C = <div key="c" style={{...cond(190, condColor), marginTop: thinFirst ? 10 : 0, marginBottom: thinFirst ? 0 : 14}}><Pw t={t} at={h.from + 0.12} dur={0.22} blur={16}>{condTxt}</Pw></div>;
	return (
		<div style={{position: "absolute", left: 40, right: 40, top: 150, textAlign: "center", opacity: out}}>
			{thinFirst ? [T, C] : [C, T]}
		</div>
	);
};

/* ───────── scene 1: Instagram DM arrives ───────── */
const Notif: React.FC = () => {
	const t = useT();
	if (t > 3.1) return null;
	const k = k01(t, 0.55, 0.45);
	const o = kOut(t, 2.65, 0.4);
	return (
		<div style={{position: "absolute", left: 90, right: 90, top: 1240, ...glass(40), padding: "34px 38px", opacity: k * o, transform: `translateY(${(1 - k) * 60 - (1 - o) * 120}px) scale(${0.96 + 0.04 * k})`}}>
			<div style={{display: "flex", alignItems: "center", gap: 18}}>
				<div style={{width: 64, height: 64, borderRadius: 18, background: K.acero, display: "flex", alignItems: "center", justifyContent: "center"}}><IgIcon size={38} /></div>
				<div style={{flex: 1}}>
					<Mono size={20}>Instagram · ahora</Mono>
					<div style={{fontFamily: SANS, fontWeight: 500, fontSize: 36, color: K.texto, marginTop: 6}}>valeria.torres</div>
				</div>
				<div style={{width: 18, height: 18, borderRadius: 99, background: K.rojo, boxShadow: `0 0 14px ${K.rojo}`}} />
			</div>
			<div style={{fontFamily: SANS, fontSize: 42, color: K.texto, marginTop: 24, lineHeight: 1.25}}>Hola, ¿precio del depa de 2 dormitorios?</div>
		</div>
	);
};

/* ───────── chat thread ───────── */
export const Bubble: React.FC<{who: "c" | "a"; children: React.ReactNode; time?: string}> = ({who, children, time}) => (
	<div style={{display: "flex", justifyContent: who === "c" ? "flex-start" : "flex-end"}}>
		<div style={{maxWidth: 700, background: who === "c" ? K.elevado : "rgba(242,58,63,0.10)", border: `1.5px solid ${who === "c" ? K.borde : "rgba(242,58,63,0.28)"}`, borderRadius: 30, borderBottomLeftRadius: who === "c" ? 8 : 30, borderBottomRightRadius: who === "a" ? 8 : 30, padding: "22px 28px", fontFamily: SANS, fontSize: 36, lineHeight: 1.3, color: K.texto}}>
			{who === "a" && <div style={{fontFamily: SANS, fontWeight: 500, fontSize: 24, color: K.rojo, marginBottom: 6}}>Camila · asistente</div>}
			{children}
			{time && <div style={{fontSize: 22, color: K.tenue, marginTop: 8, textAlign: "right"}}>{time}</div>}
		</div>
	</div>
);

export const Unidad: React.FC<{t: number; at: number; tag: string; tagColor: string; name: string; zona: string; m2: string; precio: string; disp: string}> = ({t, at, tag, tagColor, name, zona, m2, precio, disp}) => {
	const k = k01(t, at, 0.45);
	return (
		<div style={{flex: 1, background: K.grafito, border: `1.5px solid ${K.borde}`, borderRadius: 32, padding: "26px 26px 24px", opacity: k, transform: `translateY(${(1 - k) * 50}px)`}}>
			<Pill color={tagColor} size={20}>{tag}</Pill>
			<div style={{fontFamily: SANS, fontWeight: 500, fontSize: 50, color: K.texto, marginTop: 18, letterSpacing: -1}}>{name}</div>
			<div style={{fontFamily: SANS, fontSize: 26, color: K.tenue, marginTop: 2}}>{zona}</div>
			<div style={{display: "flex", justifyContent: "space-between", marginTop: 22, fontFamily: SANS, fontSize: 28, color: K.suave}}>
				<span>2 dorm.</span><span>{m2}</span>
			</div>
			<div style={{fontFamily: SANS, fontWeight: 500, fontSize: 44, color: K.texto, marginTop: 10, letterSpacing: -0.5}}>{precio}</div>
			<div style={{fontFamily: SANS, fontSize: 24, color: K.tenue, marginTop: 6}}>{disp}</div>
		</div>
	);
};

type Msg = {typing?: number; at: number; render: (t: number) => React.ReactNode};
const MSGS: Msg[] = [
	{at: 2.95, render: () => <Bubble who="c" time="23:48">Hola, ¿precio del depa de 2 dormitorios?</Bubble>},
	{typing: 3.45, at: 4.1, render: () => <Bubble who="a">¡Hola Valeria! Soy Camila, de Grupo Vertiente. Tenemos depas de 2 dormitorios desde S/ 385,000.</Bubble>},
	{typing: 5.0, at: 5.85, render: () => <Bubble who="a">Para recomendarte la mejor opción: ¿cuál es tu presupuesto, para cuándo piensas mudarte y cómo lo financiarías?</Bubble>},
	{typing: 7.25, at: 8.0, render: () => <Bubble who="c">Hasta 470 mil, este año y con crédito Mivivienda</Bubble>},
	{at: 8.6, render: (t) => <Datos t={t} />},
	{typing: 10.45, at: 11.0, render: (t) => (
		<Bubble who="a">
			Te recomiendo estas 2 opciones:
			<div style={{display: "flex", gap: 18, marginTop: 20, width: 640}}>
				<Unidad t={t} at={11.35} tag="Entrega inmediata" tagColor={K.exito} name="Alba" zona="San Miguel" m2="63 m²" precio="S/ 385,000" disp="8 disponibles" />
				<Unidad t={t} at={11.65} tag="En construcción" tagColor={K.pendiente} name="Mirador" zona="Magdalena del Mar" m2="65 m²" precio="S/ 462,000" disp="11 disponibles" />
			</div>
		</Bubble>
	)},
	{typing: 13.9, at: 14.45, render: () => <Bubble who="a">¿Te gustaría visitar Alba este sábado a las 11:00?</Bubble>},
	{typing: 15.1, at: 15.6, render: () => <Bubble who="c">¡Sí, perfecto!</Bubble>},
	{typing: 16.05, at: 16.6, render: () => (
		<Bubble who="a">
			<span style={{display: "inline-flex", alignItems: "center", gap: 10}}><Check size={34} />Listo, tu visita quedó confirmada</span>
			<div style={{fontSize: 30, color: K.suave, marginTop: 6}}>Sáb. 24 oct · 11:00 · Alba</div>
		</Bubble>
	)},
];

export const Datos: React.FC<{t: number}> = ({t}) => {
	const chips: [string, string, number][] = [["Presupuesto", "S/ 470 mil", 8.75], ["Plazo", "Este año", 9.0], ["Financiamiento", "Mivivienda", 9.25]];
	const q = k01(t, 9.6, 0.4);
	return (
		<div style={{border: `1.5px dashed ${K.borde}`, borderRadius: 28, padding: "20px 22px", background: "rgba(255,255,255,0.02)"}}>
			<div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
				<Mono size={19}>Datos capturados</Mono>
				<span style={{opacity: q, transform: `scale(${0.85 + 0.15 * q})`, display: "inline-block"}}><Pill color={K.exito} size={22}>Lead calificado · 86</Pill></span>
			</div>
			<div style={{display: "flex", gap: 12, marginTop: 16}}>
				{chips.map(([l, v, at], i) => {
					const k = k01(t, at, 0.35);
					return (
						<div key={i} style={{flex: 1, background: K.grafito, border: `1.5px solid ${K.borde}`, borderRadius: 20, padding: "14px 16px", opacity: k, transform: `translateY(${(1 - k) * 20}px)`}}>
							<div style={{fontFamily: SANS, fontSize: 21, color: K.tenue}}>{l}</div>
							<div style={{display: "flex", alignItems: "center", gap: 6, fontFamily: SANS, fontWeight: 500, fontSize: 28, color: K.texto, marginTop: 4}}><Check size={26} />{v}</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

const Chat: React.FC = () => {
	const t = useT();
	if (t < 2.7 || t > 20.4) return null;
	const k = k01(t, 2.75, 0.5);
	const o = kOut(t, 19.85, 0.45);
	const dim = interpolate(t, [17.3, 17.7], [1, 0.35], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
	const first = k01(t, 4.1, 0.4);
	// subtle push-ins on the interface; lean in on the unit cards
	const z = 1 + 0.025 * k01(t, 3, 7) + 0.07 * (k01(t, 11.3, 0.8) - k01(t, 13.6, 0.6));
	return (
		<div style={{position: "absolute", left: 50, right: 50, top: 520, height: 1150, ...glass(48), overflow: "hidden", opacity: k * o * dim, transform: `translateY(${(1 - k) * 80}px) scale(${(0.96 + 0.04 * k) * z * (0.94 + 0.06 * o)})`, transformOrigin: "50% 85%"}}>
			<div style={{display: "flex", alignItems: "center", gap: 20, padding: "30px 34px", borderBottom: `1.5px solid ${K.borde}`}}>
				<Avatar ini="VT" />
				<div style={{flex: 1}}>
					<div style={{fontFamily: SANS, fontWeight: 500, fontSize: 38, color: K.texto}}>Valeria Torres</div>
					<div style={{display: "flex", alignItems: "center", gap: 10, fontFamily: SANS, fontSize: 24, color: K.tenue, marginTop: 4}}>
						<IgIcon size={24} color={K.tenue} />Instagram · Alba
						<span style={{color: K.exito, opacity: first}}>· 1.ª respuesta en 3 s</span>
					</div>
				</div>
				<Pill color={K.rojo} size={22}><span style={{width: 10, height: 10, borderRadius: 9, background: K.rojo, boxShadow: `0 0 10px ${K.rojo}`}} />Camila en línea</Pill>
			</div>
			<div style={{position: "absolute", left: 0, right: 0, top: 136, bottom: 0, padding: "0 30px 30px", display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 20, overflow: "hidden", maskImage: "linear-gradient(180deg, transparent 0, #000 60px)", WebkitMaskImage: "linear-gradient(180deg, transparent 0, #000 60px)"}}>
				{MSGS.map((m, i) => {
					const start = m.typing ?? m.at;
					if (t < start) return null;
					const g = k01(t, start, 0.38);
					const typing = m.typing !== undefined && t < m.at;
					const pop = k01(t, m.at, 0.3);
					const who = i === 0 || i === 3 || i === 7 ? "c" : "a";
					return (
						<div key={i} style={{maxHeight: g * 900, overflow: "visible", opacity: g, transform: `translateY(${(1 - g) * 30}px)`, flexShrink: 0}}>
							{typing ? (
								<div style={{display: "flex", justifyContent: who === "c" ? "flex-start" : "flex-end"}}>
									<div style={{background: who === "c" ? K.elevado : "rgba(242,58,63,0.10)", border: `1.5px solid ${K.borde}`, borderRadius: 30}}><Typing t={t} from={start} /></div>
								</div>
							) : (
								<div style={{opacity: m.typing !== undefined ? pop : 1, transform: `scale(${m.typing !== undefined ? 0.97 + 0.03 * pop : 1})`, transformOrigin: who === "c" ? "left bottom" : "right bottom"}}>{m.render(t)}</div>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
};

/* ───────── agenda: the visit drops in confirmed ───────── */
export const Visita: React.FC<{hora: string; nombre: string; sub: string; estado: string; color: string; hl?: boolean; style?: React.CSSProperties}> = ({hora, nombre, sub, estado, color, hl, style}) => (
	<div style={{background: hl ? "rgba(63,182,139,0.13)" : K.grafito, border: `1.5px solid ${hl ? "rgba(63,182,139,0.45)" : K.borde}`, borderRadius: 32, padding: "26px 30px", display: "flex", alignItems: "center", gap: 24, ...style}}>
		<div style={{fontFamily: SANS, fontWeight: 500, fontSize: 44, color: hl ? K.exito : K.texto, width: 120}}>{hora}</div>
		<div style={{flex: 1}}>
			<div style={{fontFamily: SANS, fontWeight: 500, fontSize: 36, color: hl ? K.exito : K.texto}}>{nombre}</div>
			<div style={{fontFamily: SANS, fontSize: 26, color: hl ? "rgba(63,182,139,0.8)" : K.tenue, marginTop: 4}}>{sub}</div>
		</div>
		<Pill color={color} size={22}>{estado}</Pill>
	</div>
);

const Agenda: React.FC = () => {
	const t = useT();
	if (t < 17.2 || t > 20.4) return null;
	const k = k01(t, 17.3, 0.5);
	const o = kOut(t, 19.85, 0.45);
	const ins = k01(t, 18.0, 0.5);
	const conf = k01(t, 18.55, 0.3);
	return (
		<div style={{position: "absolute", left: 50, right: 50, top: 760, ...glass(48), padding: "36px 34px 40px", opacity: Math.min(1, k * 1.4) * o, transform: `translateY(${(1 - k) * 700}px) scale(${0.94 + 0.06 * o})`}}>
			<div style={{display: "flex", alignItems: "center", gap: 18}}>
				<CalIcon size={44} />
				<div style={{fontFamily: SANS, fontWeight: 500, fontSize: 52, color: K.texto, letterSpacing: -1}}>Agenda</div>
				<div style={{flex: 1}} />
				<Mono size={20}>Sábado 24 de octubre</Mono>
			</div>
			<div style={{fontFamily: SANS, fontSize: 28, color: K.tenue, marginTop: 8}}>Las visitas que el asistente cerró por Instagram y WhatsApp.</div>
			<div style={{display: "flex", flexDirection: "column", gap: 18, marginTop: 30}}>
				<Visita hora="10:00" nombre="Ariana Céspedes" sub="Altavista · Rocío Delgado" estado="Confirmada" color={K.exito} />
				<div style={{maxHeight: ins * 200, opacity: ins, transform: `scale(${0.92 + 0.08 * ins})`}}>
					<Visita hl hora="11:00" nombre="Valeria Torres" sub="Alba · Diego Paredes" estado={conf > 0 ? "✓ Confirmada" : "Nueva"} color={K.exito} style={{boxShadow: `0 0 ${50 * conf}px rgba(63,182,139,${0.35 * conf})`}} />
				</div>
				<Visita hora="12:30" nombre="Bruno Delgado" sub="Nova 48 · Diego Paredes" estado="Por confirmar" color={K.pendiente} />
			</div>
		</div>
	);
};

/* ───────── panel overview ───────── */
export const Row: React.FC<{t: number; at: number; children: React.ReactNode}> = ({t, at, children}) => {
	const k = k01(t, at, 0.35);
	return <div style={{display: "flex", alignItems: "center", gap: 20, padding: "16px 0", borderTop: `1.5px solid ${K.borde}`, opacity: k, transform: `translateX(${(1 - k) * 24}px)`}}>{children}</div>;
};
const Panel: React.FC<{t: number; at: number; top: number; title: string; right?: React.ReactNode; children: React.ReactNode}> = ({t, at, top, title, right, children}) => {
	const k = k01(t, at, 0.5);
	const o = kOut(t, 24.3, 0.4);
	return (
		<div style={{position: "absolute", left: 50, right: 50, top, ...glass(44), padding: "28px 34px 18px", opacity: k * o, transform: `translateY(${(1 - k) * 90}px)`}}>
			<div style={{display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14}}>
				<div style={{fontFamily: SANS, fontWeight: 500, fontSize: 40, color: K.texto, letterSpacing: -0.8}}>{title}</div>
				{right}
			</div>
			{children}
		</div>
	);
};
export const nm = (s: string) => <div style={{fontFamily: SANS, fontWeight: 500, fontSize: 30, color: K.texto}}>{s}</div>;
export const sb = (s: string) => <div style={{fontFamily: SANS, fontSize: 23, color: K.tenue, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 560}}>{s}</div>;

const Overview: React.FC = () => {
	const t = useT();
	if (t < 19.9 || t > 24.8) return null;
	const z = 1 + 0.04 * k01(t, 20.2, 4.2);
	return (
		<AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: "50% 60%"}}>
			<Panel t={t} at={20.1} top={500} title="Conversaciones" right={<div style={{display: "flex", gap: 10}}><Pill color={K.texto} size={20}><IgIcon size={22} />Instagram</Pill><Pill color={K.texto} size={20}><MsgrIcon size={22} />Messenger</Pill><Pill color={K.texto} size={20}><WaIcon size={22} />WhatsApp</Pill></div>}>
				{([["VT", "Valeria Torres", "Visita confirmada · sáb. 11:00", IgIcon], ["AS", "Adrián Sifuentes", "Hola, vi el anuncio de Altavista en Facebook", MsgrIcon], ["BC", "Brenda Casafranca", "Ok, ¿cuánto cuesta? Tengo crédito aprobado con BBVA", WaIcon]] as const).map(([ini, n, s, Ic], i) => (
					<Row key={i} t={t} at={20.4 + i * 0.12}>
						<Avatar ini={ini} size={60} />
						<div style={{flex: 1, minWidth: 0}}>{nm(n)}{sb(s)}</div>
						<Ic size={34} color={K.suave} />
					</Row>
				))}
			</Panel>
			<Panel t={t} at={20.45} top={1000} title="Leads calificados" right={<Mono size={19}>9 esperan contacto</Mono>}>
				{([["Valeria Torres", "S/ 470 mil · Alba", "86"], ["Renzo Barrantes", "S/ 440-480 mil · Mirador", "78"], ["Melissa Ugarte", "S/ 430-470 mil · Mirador", "74"]] as const).map(([n, s, sc], i) => (
					<Row key={i} t={t} at={20.75 + i * 0.12}>
						<div style={{flex: 1}}>{nm(n)}{sb(s)}</div>
						<div style={{fontFamily: "JetBrainsUI", fontSize: 26, color: K.suave, width: 60, textAlign: "right"}}>{sc}</div>
						<Pill color={K.exito} size={21}>Calificado</Pill>
					</Row>
				))}
			</Panel>
			<Panel t={t} at={20.8} top={1440} title="Agenda" right={<Mono size={19}>Esta semana</Mono>}>
				<Row t={t} at={21.1}>
					{([["19", "Visitas"], ["73%", "Confirmación"], ["67%", "Asistencia"]] as const).map(([v, l], i) => (
						<div key={i} style={{flex: 1}}>
							<div style={{fontFamily: SANS, fontWeight: 400, fontSize: 64, color: K.texto, letterSpacing: -2}}>{v}</div>
							<Mono size={17}>{l}</Mono>
						</div>
					))}
				</Row>
			</Panel>
		</AbsoluteFill>
	);
};

/* ───────── close ───────── */
const Cierre: React.FC = () => {
	const t = useT();
	if (t < 24.6) return null;
	const win = interpolate(t, [25.0, 25.4], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
	const rev = interpolate(t, [25.25, 25.75], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_OUT});
	return (
		<AbsoluteFill>
			<div style={{position: "absolute", left: 0, right: 0, top: 1190, display: "flex", justifyContent: "center", opacity: Math.max(win, rev)}}>
				<LogoImg height={150} reveal={rev} windowOn={win} />
			</div>
			<div style={{position: "absolute", left: 0, right: 0, top: 1400, textAlign: "center"}}>
				<div style={thin(62, K.suave)}><Pw t={t} at={25.9}>Tu asistente de ventas</Pw></div>
				<div style={{...cond(230, K.rojo), marginTop: 8}}><Pw t={t} at={26.2} dur={0.25} blur={18}>24/7</Pw></div>
			</div>
		</AbsoluteFill>
	);
};
const EASE_OUT = (x: number) => 1 - Math.pow(1 - x, 3);

const Sfx: React.FC<{at: number; src: string; v?: number}> = ({at, src, v = 0.3}) => {
	const {fps} = useVideoConfig();
	return <Sequence from={Math.max(0, Math.round(toReal(at) * fps))}><Audio src={staticFile(src)} volume={v} /></Sequence>;
};

export const Promo: React.FC<{sfx?: boolean; voz?: boolean}> = ({sfx = true, voz = true}) => (
	<AbsoluteFill style={{backgroundColor: K.noche, fontFamily: SANS}}>
		<Fondo />
		<Notif />
		<Chat />
		<Agenda />
		<Overview />
		<Headline />
		<Cierre />
		{voz && <Audio src={staticFile("promo_voz.wav")} />}
		{sfx && (
			<>
				<Sfx at={0.55} src="sfx_noti.wav" v={0.35} />
				<Sfx at={2.75} src="sfx_whoosh.wav" v={0.18} />
				{[4.1, 5.85, 8.0, 11.0, 14.45, 15.6, 16.6].map((a, i) => <Sfx key={i} at={a} src="sfx_pop.wav" v={0.2} />)}
				{[8.75, 9.0, 9.25, 11.35, 11.65].map((a, i) => <Sfx key={`c${i}`} at={a} src="sfx_click.wav" v={0.2} />)}
				<Sfx at={9.6} src="sfx_pop.wav" v={0.24} />
				<Sfx at={17.3} src="sfx_whoosh.wav" v={0.2} />
				<Sfx at={18.55} src="reel_hit.wav" v={0.28} />
				<Sfx at={20.05} src="sfx_whoosh.wav" v={0.18} />
				{[20.1, 20.45, 20.8].map((a, i) => <Sfx key={`p${i}`} at={a} src="sfx_pop.wav" v={0.16} />)}
				<Sfx at={24.5} src="sfx_whoosh.wav" v={0.2} />
				<Sfx at={26.2} src="reel_hit.wav" v={0.3} />
			</>
		)}
	</AbsoluteFill>
);
