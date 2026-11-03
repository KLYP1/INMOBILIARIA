import React from "react";
import {AbsoluteFill, Composition, Img, staticFile} from "remotion";
import {cond, NUM, thin} from "../reel5/Gala";
import {LogoImg} from "../reel/Reel";
import {Avatar, CalIcon, glass, IgIcon, K, Mono, MsgrIcon, Pill, SANS, WaIcon} from "../promo/ui";
import {Bubble, Datos, Luces, nm, Row, sb, Unidad, Visita} from "../promo/Promo";

// Feed posts 1080x1350 (4:5). Keep content inside x 80–1000 so the 3:4 profile-grid crop never cuts it.
const W = 1080, H = 1350, T = 23; // T: a moment of the promo timeline where every reused element is fully shown

/** Night background shared by a carousel: photo + veil + faint lights laid out as one wide strip so swiping feels continuous. */
const Bg: React.FC<{slide?: number; n?: number; sphere?: {x: number; y: number; s: number; o?: number}}> = ({slide = 0, n = 1, sphere}) => (
	<AbsoluteFill style={{backgroundColor: K.noche, overflow: "hidden"}}>
		<Img src={staticFile("k/fondo.jpg")} style={{position: "absolute", left: -slide * W, top: 0, width: W * n, height: H, objectFit: "cover", opacity: 0.5}} />
		<AbsoluteFill style={{background: "linear-gradient(180deg, rgba(14,15,17,0.35), rgba(14,15,17,0.75))"}} />
		{Array.from({length: n}, (_, k) => (
			<div key={k} style={{position: "absolute", left: (k - slide) * W, top: -200, width: W, height: 1920}}>
				<Luces t={k * 37 + 5} />
			</div>
		))}
		{sphere && (
			<Img src={staticFile("k/esfera.png")} style={{position: "absolute", left: sphere.x - sphere.s / 2, top: sphere.y - sphere.s / 2, width: sphere.s, height: sphere.s, opacity: sphere.o ?? 1, mixBlendMode: "screen", WebkitMaskImage: "radial-gradient(circle closest-side, #000 94%, transparent 100%)", maskImage: "radial-gradient(circle closest-side, #000 94%, transparent 100%)"}} />
		)}
	</AbsoluteFill>
);

const Swipe: React.FC<{label?: string}> = ({label = "Desliza"}) => (
	<div style={{position: "absolute", right: 80, bottom: 70, display: "flex", alignItems: "center", gap: 14}}>
		<Mono size={20} color={K.suave}>{label}</Mono>
		<svg width={44} height={20} viewBox="0 0 44 20" fill="none" stroke={K.rojo} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round"><path d="M2 10h38M32 3l8 7-8 7" /></svg>
	</div>
);
const Page: React.FC<{i: number; n: number}> = ({i, n}) => (
	<div style={{position: "absolute", left: 80, bottom: 70, display: "flex", gap: 8}}>
		{Array.from({length: n}, (_, k) => <div key={k} style={{width: k === i ? 34 : 10, height: 10, borderRadius: 9, background: k === i ? K.rojo : "rgba(255,255,255,0.25)"}} />)}
	</div>
);
const Kicker: React.FC<{children: React.ReactNode; top?: number}> = ({children, top = 80}) => (
	<div style={{position: "absolute", left: 80, right: 80, top, display: "flex", justifyContent: "space-between", alignItems: "center"}}>
		<Mono size={20} color={K.suave}>{children}</Mono>
		<LogoImg height={34} reveal={1} windowOn={1} />
	</div>
);
const Center: React.FC<{top: number; children: React.ReactNode; style?: React.CSSProperties}> = ({top, children, style}) => (
	<div style={{position: "absolute", left: 80, right: 80, top, textAlign: "center", ...style}}>{children}</div>
);
const Notif: React.FC<{hora?: string}> = ({hora = "23:00"}) => (
	<div style={{...glass(40), padding: "32px 36px", textAlign: "left"}}>
		<div style={{display: "flex", alignItems: "center", gap: 18}}>
			<div style={{width: 64, height: 64, borderRadius: 18, background: K.acero, display: "flex", alignItems: "center", justifyContent: "center"}}><IgIcon size={38} /></div>
			<div style={{flex: 1}}>
				<Mono size={19}>Instagram · {hora}</Mono>
				<div style={{fontFamily: SANS, fontWeight: 500, fontSize: 34, color: K.texto, marginTop: 6}}>valeria.torres</div>
			</div>
			<div style={{width: 18, height: 18, borderRadius: 99, background: K.rojo, boxShadow: `0 0 14px ${K.rojo}`}} />
		</div>
		<div style={{fontFamily: SANS, fontSize: 40, color: K.texto, marginTop: 22, lineHeight: 1.25}}>Hola, ¿precio del depa de 2 dormitorios?</div>
	</div>
);

/* ───────── 1 · brand image ───────── */
export const PostMarca: React.FC = () => (
	<AbsoluteFill>
		<Bg sphere={{x: 540, y: 410, s: 640}} />
		<div style={{position: "absolute", left: 0, right: 0, top: 770, display: "flex", justifyContent: "center"}}><LogoImg height={110} reveal={1} windowOn={1} /></div>
		<Center top={925}>
			<div style={thin(58, K.suave)}>Tu asistente de ventas</div>
			<div style={{...cond(180, K.rojo), marginTop: 6}}>24/7</div>
		</Center>
		<Center top={1225}><Mono size={20} color={K.tenue}>Para constructoras e inmobiliarias</Mono></Center>
	</AbsoluteFill>
);

/* ───────── 2 · carousel "Qué es KLYP" ───────── */
const N2 = 5;
export const QueEs: React.FC<{s: number}> = ({s}) => (
	<AbsoluteFill>
		<Bg slide={s} n={N2} sphere={s === 0 ? {x: 900, y: 180, s: 520, o: 0.45} : s === 4 ? {x: 540, y: 380, s: 520} : undefined} />
		{s === 0 && (
			<>
				<Kicker>Para constructoras e inmobiliarias</Kicker>
				<Center top={250}>
					<div style={thin(66, K.texto)}>Tus leads escriben a las</div>
					<div style={{...cond(300, K.texto), marginTop: 8}}>11 PM</div>
					<div style={{...cond(118, K.rojo), marginTop: 10}}>¿Quién les responde?</div>
				</Center>
				<div style={{position: "absolute", left: 100, right: 100, top: 900}}><Notif /></div>
				<Swipe />
			</>
		)}
		{s === 1 && (
			<>
				<Kicker>El problema</Kicker>
				<Center top={210}>
					<div style={thin(62, K.suave)}>Cada hora sin respuesta,</div>
					<div style={{...cond(170, K.texto), marginTop: 8}}>el cliente se <span style={{color: K.rojo}}>enfría</span></div>
				</Center>
				<div style={{position: "absolute", left: 90, right: 90, top: 640, ...glass(44), padding: "34px 30px", display: "flex", flexDirection: "column", gap: 22}}>
					<Bubble who="c" time="23:00">Hola, ¿precio del depa de 2 dormitorios?</Bubble>
					<Bubble who="c" time="09:12">¿Hola? ¿Siguen ahí?</Bubble>
					<div style={{textAlign: "right", fontFamily: SANS, fontSize: 26, color: K.tenue}}>Visto · sin respuesta hace 9 h</div>
				</div>
				<Page i={1} n={N2} />
			</>
		)}
		{s === 2 && (
			<>
				<Kicker>La solución</Kicker>
				<Center top={230}>
					<div style={thin(62, K.suave)}>KLYP es un asistente de IA</div>
					<div style={thin(62, K.suave)}>que atiende tus redes</div>
					<div style={{...cond(330, K.rojo), marginTop: 14}}>24/7</div>
				</Center>
				<div style={{position: "absolute", left: 80, right: 80, top: 880, display: "flex", flexDirection: "column", gap: 18}}>
					{([[IgIcon, "Instagram"], [MsgrIcon, "Messenger"], [WaIcon, "WhatsApp"]] as const).map(([Ic, l], i) => (
						<div key={i} style={{...glass(30), padding: "22px 30px", display: "flex", alignItems: "center", gap: 22}}>
							<Ic size={42} />
							<div style={{flex: 1, fontFamily: SANS, fontWeight: 500, fontSize: 36, color: K.texto}}>{l}</div>
							<Pill color={K.exito} size={22}>Conectado</Pill>
						</div>
					))}
				</div>
				<Page i={2} n={N2} />
			</>
		)}
		{s === 3 && (
			<>
				<Kicker>Qué hace por tu equipo</Kicker>
				<Center top={190}><div style={cond(132, K.texto)}>Atiende como tu <span style={{color: K.rojo}}>mejor asesor</span></div></Center>
				<div style={{position: "absolute", left: 80, right: 80, top: 560, display: "flex", flexDirection: "column", gap: 18}}>
					{([["Responde al instante", "En Instagram, Messenger y WhatsApp, a cualquier hora."], ["Califica a cada lead", "Presupuesto, plazo de mudanza y financiamiento."], ["Recomienda unidades", "Las de tu inventario que sí le calzan al cliente."], ["Agenda la visita", "Confirmada en tu agenda y asignada a tu asesor."]] as const).map(([a, b], i) => (
						<div key={i} style={{...glass(30), padding: "24px 30px", display: "flex", alignItems: "center", gap: 26}}>
							<div style={{fontFamily: NUM, fontWeight: 200, fontSize: 92, lineHeight: 1, color: K.rojo, width: 90, textAlign: "center"}}>{i + 1}</div>
							<div>
								<div style={{fontFamily: SANS, fontWeight: 500, fontSize: 38, color: K.texto}}>{a}</div>
								<div style={{fontFamily: SANS, fontSize: 27, color: K.tenue, marginTop: 4}}>{b}</div>
							</div>
						</div>
					))}
				</div>
				<Page i={3} n={N2} />
			</>
		)}
		{s === 4 && (
			<>
				<Center top={650}>
					<div style={thin(58, K.suave)}>¿Lo probamos con tu proyecto?</div>
					<div style={{...cond(210, K.texto), marginTop: 10}}>Comenta <span style={{color: K.rojo}}>DEMO</span></div>
				</Center>
				<div style={{position: "absolute", left: 0, right: 0, top: 1180, display: "flex", justifyContent: "center"}}><LogoImg height={60} reveal={1} windowOn={1} /></div>
			</>
		)}
	</AbsoluteFill>
);

/* ───────── 3 · carousel "Cómo funciona" ───────── */
const N3 = 6;
const Step: React.FC<{n: string; a: string; b: string}> = ({n, a, b}) => (
	<div style={{position: "absolute", left: 80, right: 80, top: 150, display: "flex", alignItems: "flex-end", gap: 34}}>
		<div style={{fontFamily: NUM, fontWeight: 200, fontSize: 280, lineHeight: 0.8, color: K.rojo}}>{n}</div>
		<div style={{paddingBottom: 6}}>
			<div style={thin(52, K.suave)}>{a}</div>
			<div style={{...cond(150, K.texto), marginTop: 4}}>{b}</div>
		</div>
	</div>
);
export const Como: React.FC<{s: number}> = ({s}) => (
	<AbsoluteFill>
		<Bg slide={s} n={N3} sphere={s === 5 ? {x: 540, y: 360, s: 500} : {x: 960 - s * 60, y: 120, s: 460, o: 0.3}} />
		{s < 5 && <Kicker top={70}>Cómo funciona KLYP</Kicker>}
		{s === 0 && (
			<>
				<Step n="01" a="Llega el" b="mensaje" />
				<div style={{position: "absolute", left: 100, right: 100, top: 560}}><Notif /></div>
				<Center top={1010}><div style={thin(44, K.suave)}>Un cliente pregunta por tu proyecto,<br />a la hora que sea.</div></Center>
				<Swipe />
			</>
		)}
		{s === 1 && (
			<>
				<Step n="02" a="Responde y" b="califica" />
				<div style={{position: "absolute", left: 80, right: 80, top: 520, ...glass(44), padding: 30, display: "flex", flexDirection: "column", gap: 22}}>
					<Bubble who="a">Para recomendarte la mejor opción: ¿cuál es tu presupuesto, para cuándo piensas mudarte y cómo lo financiarías?</Bubble>
					<Bubble who="c">Hasta 470 mil, este año y con crédito Mivivienda</Bubble>
					<Datos t={T} />
				</div>
				<Page i={1} n={N3} />
			</>
		)}
		{s === 2 && (
			<>
				<Step n="03" a="Recomienda de tu" b="inventario" />
				<div style={{position: "absolute", left: 80, right: 80, top: 540, ...glass(44), padding: 30}}>
					<Bubble who="a">
						Te recomiendo estas 2 opciones:
						<div style={{display: "flex", gap: 18, marginTop: 20, width: 640}}>
							<Unidad t={T} at={0} tag="Entrega inmediata" tagColor={K.exito} name="Alba" zona="San Miguel" m2="63 m²" precio="S/ 385,000" disp="8 disponibles" />
							<Unidad t={T} at={0} tag="En construcción" tagColor={K.pendiente} name="Mirador" zona="Magdalena del Mar" m2="65 m²" precio="S/ 462,000" disp="11 disponibles" />
						</div>
					</Bubble>
				</div>
				<Page i={2} n={N3} />
			</>
		)}
		{s === 3 && (
			<>
				<Step n="04" a="Agenda la" b="visita" />
				<div style={{position: "absolute", left: 80, right: 80, top: 540, ...glass(44), padding: "32px 30px 34px"}}>
					<div style={{display: "flex", alignItems: "center", gap: 16, marginBottom: 24}}>
						<CalIcon size={40} />
						<div style={{fontFamily: SANS, fontWeight: 500, fontSize: 44, color: K.texto}}>Agenda</div>
						<div style={{flex: 1}} />
						<Mono size={18}>Sábado 24 de octubre</Mono>
					</div>
					<div style={{display: "flex", flexDirection: "column", gap: 16}}>
						<Visita hora="10:00" nombre="Ariana Céspedes" sub="Altavista · Rocío Delgado" estado="Confirmada" color={K.exito} />
						<Visita hl hora="11:00" nombre="Valeria Torres" sub="Alba · Diego Paredes" estado="✓ Confirmada" color={K.exito} style={{boxShadow: "0 0 50px rgba(63,182,139,0.3)"}} />
						<Visita hora="12:30" nombre="Bruno Delgado" sub="Nova 48 · Diego Paredes" estado="Por confirmar" color={K.pendiente} />
					</div>
				</div>
				<Page i={3} n={N3} />
			</>
		)}
		{s === 4 && (
			<>
				<Step n="05" a="Todo en un" b="solo panel" />
				<div style={{position: "absolute", left: 80, right: 80, top: 520, ...glass(40), padding: "26px 30px 12px"}}>
					<div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10}}>
						<div style={{fontFamily: SANS, fontWeight: 500, fontSize: 36, color: K.texto}}>Conversaciones</div>
						<div style={{display: "flex", gap: 14}}><IgIcon size={30} color={K.suave} /><MsgrIcon size={30} color={K.suave} /><WaIcon size={30} color={K.suave} /></div>
					</div>
					{([["VT", "Valeria Torres", "Visita confirmada · sáb. 11:00", IgIcon], ["AS", "Adrián Sifuentes", "Hola, vi el anuncio de Altavista", MsgrIcon], ["BC", "Brenda Casafranca", "Tengo crédito aprobado con BBVA", WaIcon]] as const).map(([ini, n, sub, Ic], i) => (
						<Row key={i} t={T} at={0}><Avatar ini={ini} size={56} /><div style={{flex: 1, minWidth: 0}}>{nm(n)}{sb(sub)}</div><Ic size={32} color={K.suave} /></Row>
					))}
				</div>
				<div style={{position: "absolute", left: 80, right: 80, top: 945, ...glass(40), padding: "26px 30px 12px"}}>
					<div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10}}>
						<div style={{fontFamily: SANS, fontWeight: 500, fontSize: 36, color: K.texto}}>Leads calificados</div>
						<Mono size={18}>Listos para tu asesor</Mono>
					</div>
					{([["Valeria Torres", "S/ 470 mil · Alba", "86"], ["Renzo Barrantes", "S/ 440-480 mil · Mirador", "78"]] as const).map(([n, sub, sc], i) => (
						<Row key={i} t={T} at={0}><div style={{flex: 1}}>{nm(n)}{sb(sub)}</div><div style={{fontFamily: "JetBrainsUI", fontSize: 26, color: K.suave}}>{sc}</div><Pill color={K.exito} size={21}>Calificado</Pill></Row>
					))}
				</div>
				<Page i={4} n={N3} />
			</>
		)}
		{s === 5 && (
			<>
				<Center top={680}>
					<div style={thin(58, K.suave)}>Tu equipo solo llega a</div>
					<div style={{...cond(260, K.rojo), marginTop: 8}}>cerrar</div>
				</Center>
				<Center top={1050}><Pill color={K.rojo} size={34}>Comenta DEMO 👇</Pill></Center>
				<div style={{position: "absolute", left: 0, right: 0, top: 1200, display: "flex", justifyContent: "center"}}><LogoImg height={56} reveal={1} windowOn={1} /></div>
			</>
		)}
	</AbsoluteFill>
);

export const PostComps: React.FC = () => (
	<>
		<Composition id="PostMarca" component={PostMarca} durationInFrames={1} fps={30} width={W} height={H} />
		{Array.from({length: N2}, (_, s) => <Composition key={`q${s}`} id={`QueEs${s + 1}`} component={QueEs} durationInFrames={1} fps={30} width={W} height={H} defaultProps={{s}} />)}
		{Array.from({length: N3}, (_, s) => <Composition key={`c${s}`} id={`Como${s + 1}`} component={Como} durationInFrames={1} fps={30} width={W} height={H} defaultProps={{s}} />)}
	</>
);
