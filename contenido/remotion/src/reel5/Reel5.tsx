import React from "react";
import {AbsoluteFill, Audio, Easing, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {RED} from "../reel/brand";
import {LogoImg} from "../reel/Reel";
import {LINES} from "./lines";
import {BigNum, Broll, ColorCard, cond, CREAM, GalaSubs, INK, MAROON, on, Pw, thin, useT, Venn} from "./Gala";

export const SPEECH5 = 31.35;
export const OUTRO5 = 2.8;

// hard-cut reframes [time, scale]; head kept still (1.0) wherever text sits behind her
const ZOOMS: [number, number][] = [
	[0, 1.0], [3.1, 1.12], [4.08, 1.0], [7.6, 1.1], [8.52, 1.0], [10.92, 1.0], [12.56, 1.12], [14.92, 1.04], [15.56, 1.16], [16.68, 1.0],
	[21.44, 1.1], [23.9, 1.15], [26.05, 1.0], [27.13, 1.1], [28.21, 1.0], [29.55, 1.1], [30.51, 1.0],
];
const zoomAt = (t: number) => {
	let s = 1, a = 0;
	for (const [at, sc] of ZOOMS) if (t >= at) { s = sc; a = at; }
	return s * (1 + 0.01 * Math.min(t - a, 3)); // slow drift inside each shot
};
// black & white flashes on the punch words
const BW: [number, number][] = [[3.4, 3.66], [7.82, 8.34], [15.56, 15.84], [24.18, 24.5]];

// words that jump to big condensed caps in the captions (w = white, r = red)
const KEYS: Record<string, string> = {
	"falta": "w", "incomodar,": "w", "mostrarle": "w", "mismo": "w", "recién": "w", "opciones.": "r",
	"Mivivienda,": "r", "hipotecario,": "r", "ahorros.": "r", "cliente": "w", "necesita": "w", "asesor": "w", "respuestas": "r",
	"Guárdalo": "w", "envíaselo": "r", "ventas.": "r",
};
const HIDE: [number, number][] = [[0, 3.1], [4.08, 5.1], [5.28, 7.5], [9.4, 10.92], [11.02, 12.56], [13.76, 14.92], [16.68, 18.3], [23.02, 23.9], [24.8, 26.05], [27.53, 29.55]];

const Sfx: React.FC<{at: number; src: string; v?: number}> = ({at, src, v = 0.3}) => {
	const {fps} = useVideoConfig();
	return <Sequence from={Math.max(0, Math.round(at * fps))}><Audio src={staticFile(src)} volume={v} /></Sequence>;
};

/** Text that sits BEHIND her (rendered under the matte layer). */
const Behind: React.FC = () => {
	const t = useT();
	return (
		<AbsoluteFill style={{pointerEvents: "none"}}>
			{on(t, 0, 3.1) && (
				<>
					<div style={{position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", ...cond(150, INK)}}>
						<Pw t={t} at={0}>¿Tu</Pw> <Pw t={t} at={0.2}>equipo</Pw> <Pw t={t} at={0.44}>agenda</Pw>
					</div>
					<div style={{position: "absolute", left: 0, right: 0, top: 210, textAlign: "center", ...cond(360, RED)}}>
						<Pw t={t} at={0.66} dur={0.1}>visitas</Pw>
					</div>
				</>
			)}
			{on(t, 28.21, 29.45) && (
				<>
					<div style={{position: "absolute", left: 0, right: 0, top: 80, textAlign: "center", ...cond(150, INK)}}>
						<Pw t={t} at={28.21}>sabiendo</Pw> <Pw t={t} at={28.55}>qué</Pw>
					</div>
					<div style={{position: "absolute", left: 0, right: 0, top: 215, textAlign: "center", ...cond(360, RED)}}>
						<Pw t={t} at={28.73} dur={0.1}>ofrecer</Pw>
					</div>
				</>
			)}
			<Venn from={18.3} to={21.42} items={[["Mivivienda", 18.65], ["Hipotecario", 19.77], ["Ahorros", 20.91]]} />
		</AbsoluteFill>
	);
};

/** Text in front of her (never on the face: top wall or chest). */
const Front: React.FC = () => {
	const t = useT();
	return (
		<AbsoluteFill style={{pointerEvents: "none"}}>
			{on(t, 1.28, 2.0) && (
				<div style={{position: "absolute", left: 0, right: 0, top: 1170, textAlign: "center", ...thin(78, "#fff", {textShadow: "0 2px 14px rgba(0,0,0,0.45)"})}}>
					<Pw t={t} at={1.28}>con gente</Pw><br />
					<Pw t={t} at={1.44}>que al final</Pw>
				</div>
			)}
			{on(t, 2.0, 3.1) && (
				<div style={{position: "absolute", left: 0, right: 0, top: 1130, textAlign: "center", ...cond(200, RED, {textShadow: "0 4px 24px rgba(0,0,0,0.25)"})}}>
					<Pw t={t} at={2.0}>no</Pw> <Pw t={t} at={2.4}>puede</Pw><br /><Pw t={t} at={2.58}>comprar?</Pw>
				</div>
			)}
			{on(t, 4.08, 5.1) && (
				<>
					<div style={{position: "absolute", left: 0, right: 0, top: 1040, textAlign: "center", fontFamily: "OswaldThin", fontWeight: 200, fontSize: 470, lineHeight: 1, color: RED}}>
						<Pw t={t} at={4.08} dur={0.16} blur={14}>3</Pw>
					</div>
					<div style={{position: "absolute", left: 0, right: 0, top: 1420, textAlign: "center", ...thin(124, "#fff", {fontStyle: "italic", textShadow: "0 2px 16px rgba(0,0,0,0.45)"})}}>
						<Pw t={t} at={4.32}>PREGUNTAS</Pw>
					</div>
					<div style={{position: "absolute", left: 0, right: 0, top: 1570, textAlign: "center", ...thin(60, "#fff", {textShadow: "0 2px 14px rgba(0,0,0,0.45)"})}}>
						<Pw t={t} at={4.68}>antes.</Pw>
					</div>
				</>
			)}
			<BigNum from={5.28} to={7.5} n="1" words={[["¿Cuál", 5.8], ["es", 6.0], ["su", 6.1], ["presupuesto", 6.2], ["aproximado?", 6.68]]} />
			<BigNum from={11.02} to={12.56} n="2" words={[["¿Para", 11.38], ["cuándo", 11.64], ["piensas", 11.84], ["mudarte?", 12.16]]} />
			<BigNum from={16.68} to={18.3} n="3" words={[["¿Cómo", 17.12], ["piensas", 17.32], ["financiarlo?", 17.64]]} />
		</AbsoluteFill>
	);
};

/** Full-screen inserts (b-roll and colour cards) — her voice keeps running underneath. */
const Inserts: React.FC = () => {
	const t = useT();
	return (
		<>
			<Broll from={9.4} to={10.92} src="r5_apto.jpg">
				<div style={{position: "absolute", left: 0, right: 0, top: 720, textAlign: "center"}}>
					<div style={thin(64, "#fff")}><Pw t={t} at={9.4}>las</Pw> <Pw t={t} at={9.46}>unidades</Pw></div>
					<div style={{...thin(64, "#fff"), marginTop: 6}}><Pw t={t} at={9.82}>que</Pw> <Pw t={t} at={10.02}>realmente</Pw></div>
					<div style={{...cond(270, RED), marginTop: 18}}><Pw t={t} at={10.38}>le</Pw> <Pw t={t} at={10.56}>calzan</Pw></div>
				</div>
			</Broll>
			<Broll from={13.76} to={14.92} src="r5_mudanza.jpg">
				<div style={{position: "absolute", left: 0, right: 0, top: 760, textAlign: "center"}}>
					<div style={thin(70, "#fff")}><Pw t={t} at={13.76}>que quiere mudarse</Pw></div>
					<div style={{...cond(330, RED), marginTop: 20}}><Pw t={t} at={14.2}>este</Pw> <Pw t={t} at={14.52}>año</Pw></div>
				</div>
			</Broll>
			<ColorCard from={23.02} to={23.9} bg={MAROON}>
				<div style={thin(64, CREAM)}><Pw t={t} at={23.02}>está</Pw></div>
				<div style={{...cond(300, CREAM), marginTop: 20}}>
					<Pw t={t} at={23.16} dur={0.22} blur={18}>listo</Pw><br />
					<Pw t={t} at={23.38} dur={0.22} blur={18}>para</Pw><br />
					<Pw t={t} at={23.56} dur={0.22} blur={18} style={{color: RED}}>comprar</Pw>
				</div>
			</ColorCard>
			<ColorCard from={24.8} to={26.05} bg={CREAM}>
				<div style={thin(64, MAROON)}><Pw t={t} at={24.5}>ser</Pw></div>
				<div style={{...cond(196, MAROON), marginTop: 18}}><Pw t={t} at={24.8} dur={0.3} blur={20}>precalificado</Pw></div>
				<div style={{...thin(64, MAROON), marginTop: 22}}><Pw t={t} at={25.52}>por un</Pw> <Pw t={t} at={25.9} style={{color: RED, fontWeight: 400}}>banco</Pw></div>
			</ColorCard>
			<Broll from={27.53} to={28.21} src="r5_visita.jpg">
				<div style={{position: "absolute", left: 0, right: 0, top: 1180, textAlign: "center"}}>
					<div style={thin(66, "#fff")}><Pw t={t} at={27.53}>llega a la</Pw></div>
					<div style={{...cond(300, "#fff"), marginTop: 12}}><Pw t={t} at={27.91}>visita</Pw></div>
				</div>
			</Broll>
		</>
	);
};

const OutroWida: React.FC = () => {
	const t = useT();
	const win = interpolate(t, [1.0, 1.4], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
	const rev = interpolate(t, [1.25, 1.7], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});
	return (
		<AbsoluteFill style={{backgroundColor: INK, justifyContent: "center", alignItems: "center", textAlign: "center"}}>
			<div style={cond(230, "#fff", {textTransform: "none"})}><Pw t={t} at={0.1} dur={0.3} blur={20}>@wida_ia</Pw></div>
			<div style={{...thin(54, "#fff"), marginTop: 26}}>
				<Pw t={t} at={0.55}>Guárdalo y</Pw> <Pw t={t} at={0.7} style={{color: RED, fontWeight: 400}}>compártelo con tu equipo</Pw>
			</div>
			<div style={{display: "flex", alignItems: "center", gap: 22, marginTop: 110, opacity: Math.max(win, rev)}}>
				<div style={thin(32, "rgba(255,255,255,0.7)")}>Fundadora de</div>
				<LogoImg height={56} reveal={rev} windowOn={win} />
			</div>
		</AbsoluteFill>
	);
};

export const Reel5: React.FC = () => {
	const t = useT();
	const {fps} = useVideoConfig();
	const bw = BW.some(([a, b]) => on(t, a, b));
	const vid: React.CSSProperties = {transform: `scale(${zoomAt(t)})`, transformOrigin: "540px 760px", filter: bw ? "grayscale(1) contrast(1.15)" : undefined};
	return (
		<AbsoluteFill style={{backgroundColor: INK}}>
			<AbsoluteFill style={vid}>
				<OffthreadVideo src={staticFile("reel5_src.mov")} />
			</AbsoluteFill>
			<Behind />
			<AbsoluteFill style={vid}>
				<OffthreadVideo src={staticFile("reel5_alpha.webm")} transparent muted />
			</AbsoluteFill>
			<Front />
			<GalaSubs lines={LINES} keys={KEYS} hide={HIDE} y={1170} />
			<Inserts />

			<Sfx at={0} src="reel_hit.wav" v={0.38} />
			<Sfx at={0.66} src="sfx_whoosh.wav" v={0.2} />
			<Sfx at={2.0} src="sfx_pop.wav" v={0.22} />
			<Sfx at={3.4} src="sfx_click.wav" v={0.24} />
			<Sfx at={4.08} src="reel_hit.wav" v={0.34} />
			<Sfx at={5.28} src="sfx_pop.wav" v={0.26} />
			<Sfx at={7.82} src="sfx_click.wav" v={0.24} />
			<Sfx at={9.4} src="sfx_whoosh.wav" v={0.24} />
			<Sfx at={10.56} src="sfx_pop.wav" v={0.22} />
			<Sfx at={11.02} src="sfx_pop.wav" v={0.26} />
			<Sfx at={13.76} src="sfx_whoosh.wav" v={0.24} />
			<Sfx at={14.2} src="sfx_pop.wav" v={0.22} />
			<Sfx at={15.56} src="sfx_click.wav" v={0.24} />
			<Sfx at={16.68} src="sfx_pop.wav" v={0.26} />
			<Sfx at={18.65} src="sfx_click.wav" v={0.24} />
			<Sfx at={19.77} src="sfx_click.wav" v={0.24} />
			<Sfx at={20.91} src="sfx_click.wav" v={0.24} />
			<Sfx at={23.02} src="reel_hit.wav" v={0.32} />
			<Sfx at={24.8} src="sfx_whoosh.wav" v={0.22} />
			<Sfx at={27.53} src="sfx_whoosh.wav" v={0.22} />
			<Sfx at={28.73} src="reel_hit.wav" v={0.3} />
			<Sfx at={29.55} src="sfx_pop.wav" v={0.22} />
			<Sfx at={30.15} src="sfx_pop.wav" v={0.22} />
			<Sfx at={SPEECH5} src="sfx_whoosh.wav" v={0.18} />

			<Sequence from={Math.round(SPEECH5 * fps)}>
				<OutroWida />
			</Sequence>
		</AbsoluteFill>
	);
};
