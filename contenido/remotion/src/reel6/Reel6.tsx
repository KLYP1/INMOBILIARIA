import React from "react";
import {AbsoluteFill, Audio, Easing, interpolate, OffthreadVideo, Sequence, staticFile, useVideoConfig} from "remotion";
import {RED} from "../reel/brand";
import {LogoImg} from "../reel/Reel";
import {Broll, ColorCard, cond, CREAM, GalaSubs, INK, MAROON, NUM, on, Pw, thin, useT, Venn} from "../reel5/Gala";
import {Bubble} from "../promo/Promo";
import {K} from "../promo/ui";
import {LINES6} from "./lines";

// Editorial style of the Gala references (same kit as reel 5 v2). Her footage is shown untouched:
// full frame, original colour, no zooms or close-ups.
export const SPEECH6 = 43.46;
export const OUTRO6 = 1.45;

// black & white flashes on punch words
const BW: [number, number][] = [[13.82, 14.3], [18.44, 18.9], [35.9, 36.5]];

// caption words that jump to big condensed caps (w = white, r = red)
const KEYS: Record<string, string> = {"ir.": "r", "intuición,": "w", "primero.": "w", "descansando.": "w", "presupuesto.": "w", "inmobiliaria?": "r", "proyecto.": "r"};
// captions step aside whenever a big text, a number or a full-screen card carries the words
const HIDE: [number, number][] = [[0, 3.35], [3.35, 5.05], [6.55, 7.6], [7.85, 9.53], [10.5, 11.56], [11.8, 12.9], [16.78, 18.08], [20.4, 21.68], [22.2, 24.69], [24.9, 28.0], [31.63, 33.13], [34.29, 35.0], [37.0, 38.74], [38.82, 40.9], [42.4, 99]];

const Sfx: React.FC<{at: number; src: string; v?: number}> = ({at, src, v = 0.3}) => {
	const {fps} = useVideoConfig();
	return <Sequence from={Math.max(0, Math.round(at * fps))}><Audio src={staticFile(src)} volume={v} /></Sequence>;
};

/** One big condensed line on the wall above her head (rendered behind her when placed in <Behind>). */
const Line: React.FC<{t: number; from: number; to: number; top: number; size: number; color: string; words: [string, number][]}> = ({t, from, to, top, size, color, words}) => {
	if (!on(t, from, to)) return null;
	const out = interpolate(t, [to - 0.2, to], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
	return (
		<div style={{position: "absolute", left: 40, right: 40, top, textAlign: "center", opacity: out, filter: out < 1 ? `blur(${(1 - out) * 10}px)` : undefined, ...cond(size, color)}}>
			{words.map(([w, a], i) => <React.Fragment key={i}>{i > 0 && " "}<Pw t={t} at={a} dur={0.12}>{w}</Pw></React.Fragment>)}
		</div>
	);
};

/** Text that sits BEHIND her (under the matte layer). */
const Behind: React.FC = () => {
	const t = useT();
	return (
		<AbsoluteFill style={{pointerEvents: "none"}}>
			{/* hook */}
			<Line t={t} from={0} to={3.35} top={110} size={140} color={INK} words={[["Ayer", 0], ["le", 1.04], ["escribí", 1.04], ["a", 1.2]]} />
			<Line t={t} from={1.29} to={3.35} top={240} size={300} color={RED} words={[["10", 1.29], ["inmobiliarias", 1.47]]} />
			{/* midnight */}
			<Line t={t} from={6.39} to={7.85} top={200} size={260} color={INK} words={[["A", 6.39], ["medianoche", 6.63]]} />
			{/* they paid */}
			<Line t={t} from={11.8} to={13.2} top={110} size={140} color={INK} words={[["Las", 11.8], ["10", 11.91]]} />
			<Line t={t} from={12.02} to={13.2} top={240} size={300} color={RED} words={[["pagaron", 12.02]]} />
			{/* first one */}
			<Line t={t} from={16.78} to={18.08} top={110} size={140} color={INK} words={[["la", 16.78], ["que", 17.24], ["me", 17.3], ["contestó", 17.39]]} />
			<Line t={t} from={17.62} to={18.08} top={240} size={300} color={RED} words={[["primero", 17.62]]} />
			{/* solution: what it asked */}
			<Venn from={27.4} to={31.55} items={[["Al instante", 27.58], ["Dormitorios", 28.86], ["Presupuesto", 30.16]]} cy={280} />
			<Line t={t} from={31.63} to={33.13} top={110} size={140} color={INK} words={[["Agendó", 31.63], ["la", 31.85], ["visita", 32.03]]} />
			<Line t={t} from={32.73} to={33.13} top={240} size={300} color={RED} words={[["sábado", 32.73]]} />
			{/* which group */}
			<Line t={t} from={37.0} to={38.74} top={110} size={140} color={INK} words={[["¿En", 37.42], ["qué", 37.52]]} />
			<Line t={t} from={37.6} to={38.74} top={240} size={300} color={RED} words={[["grupo?", 37.6]]} />
		</AbsoluteFill>
	);
};

/** Giant thin red number on the chest (kept under the chin), with her words in thin italics below. */
const Num: React.FC<{t: number; from: number; to: number; n: string; words: [string, number][]}> = ({t, from, to, n, words}) => {
	if (!on(t, from, to)) return null;
	const k = interpolate(t, [from, from + 0.2], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});
	const out = interpolate(t, [to - 0.2, to], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
	return (
		<AbsoluteFill style={{pointerEvents: "none", opacity: out}}>
			<div style={{position: "absolute", left: 0, right: 0, top: 1170, textAlign: "center", fontFamily: NUM, fontWeight: 200, fontSize: 360, lineHeight: 1, color: RED, opacity: k, transform: `scale(${0.95 + 0.05 * k})`, filter: k < 1 ? `blur(${(1 - k) * 12}px)` : undefined}}>{n}</div>
			<div style={{position: "absolute", left: 60, right: 110, top: 1460, display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: 14}}>
				{words.map(([w, a], i) => <Pw key={i} t={t} at={a - 0.03} style={thin(58, "#fff", {fontStyle: "italic", textShadow: "0 2px 16px rgba(0,0,0,0.55)"})}>{w}</Pw>)}
			</div>
		</AbsoluteFill>
	);
};

const Front: React.FC = () => {
	const t = useT();
	const win = interpolate(t, [42.75, 43.15], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
	const rev = interpolate(t, [43.0, 43.5], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});
	return (
		<AbsoluteFill style={{pointerEvents: "none"}}>
			<Num t={t} from={7.87} to={9.53} n="5" words={[["con", 8.27], ["respuestas", 8.49], ["automáticas", 8.85]]} />
			<Num t={t} from={22.22} to={24.69} n="7×" words={[["veces", 22.5], ["más", 22.78], ["probabilidades", 22.94], ["de", 23.48], ["calificar", 23.68], ["al", 24.02], ["cliente", 24.2]]} />
			<Num t={t} from={34.29} to={35.05} n="10" words={[["de", 34.37], ["la", 34.47], ["noche", 34.61]]} />

			{/* the questions she sent */}
			<Broll from={3.35} to={5.05} src="r5_apto.jpg">
				<div style={{position: "absolute", left: 70, right: 110, top: 780, textAlign: "center"}}>
					<div style={thin(66, "#fff", {fontStyle: "italic"})}><Pw t={t} at={3.41}>“¿Aún tienes depas</Pw> <Pw t={t} at={3.97}>de 2 dormitorios?”</Pw></div>
				</div>
			</Broll>
			{/* the rest: next day */}
			<ColorCard from={10.5} to={11.56} bg={CREAM}>
				<div style={thin(60, MAROON)}><Pw t={t} at={10.5}>el resto me contestó</Pw></div>
				<div style={{...cond(250, MAROON), marginTop: 16}}>
					<Pw t={t} at={10.85} dur={0.22} blur={18}>al día</Pw><br />
					<Pw t={t} at={11.0} dur={0.22} blur={18} style={{color: RED}}>siguiente</Pw>
				</div>
			</ColorCard>
			{/* the study */}
			<ColorCard from={20.4} to={21.68} bg={MAROON}>
				<div style={thin(60, CREAM)}><Pw t={t} at={20.4}>si respondes dentro de</Pw></div>
				<div style={{...cond(270, CREAM), marginTop: 16}}>
					<Pw t={t} at={20.9} dur={0.22} blur={18}>la primera</Pw><br />
					<Pw t={t} at={21.22} dur={0.22} blur={18} style={{color: RED}}>hora</Pw>
				</div>
			</ColorCard>
			{/* «ahora mira» on the wall, then the same message answered by KLYP */}
			{on(t, 24.9, 26.04) && (
				<div style={{position: "absolute", left: 40, right: 40, top: 200, textAlign: "center", ...cond(260, INK)}}>
					<Pw t={t} at={24.9}>Ahora</Pw> <Pw t={t} at={25.16} style={{color: RED}}>mira</Pw>
				</div>
			)}
			<ColorCard from={26.04} to={28.0} bg={K.noche}>
				<div style={{width: 900, display: "flex", flexDirection: "column", gap: 22, textAlign: "left"}}>
					<div style={{opacity: interpolate(t, [26.04, 26.3], [0, 1], {extrapolateRight: "clamp"})}}><Bubble who="c" time="22:00">¿Aún tienes depas de 2 dormitorios?</Bubble></div>
					<div style={{opacity: interpolate(t, [26.75, 27.05], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"})}}><Bubble who="a" time="22:00">¡Hola! Sí, tenemos. ¿Para cuántas personas y cuál es tu presupuesto aproximado?</Bubble></div>
				</div>
				<div style={{position: "absolute", left: 0, right: 0, top: 300, textAlign: "center"}}>
					<div style={thin(52, "rgba(255,255,255,0.8)")}><Pw t={t} at={26.1}>respondido por el asistente de</Pw></div>
					<div style={{display: "flex", justifyContent: "center", marginTop: 18, opacity: interpolate(t, [27.2, 27.45], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"})}}><LogoImg height={70} reveal={1} windowOn={1} /></div>
				</div>
			</ColorCard>
			{/* CTA card */}
			<ColorCard from={38.82} to={40.9} bg={MAROON}>
				<div style={thin(60, CREAM)}><Pw t={t} at={38.82}>Agenda tu</Pw></div>
				<div style={{...cond(260, CREAM), marginTop: 16}}>
					<Pw t={t} at={39.16} dur={0.22} blur={18}>diagnóstico</Pw><br />
					<Pw t={t} at={39.6} dur={0.22} blur={18} style={{color: RED}}>gratuito</Pw>
				</div>
				<div style={{...thin(52, CREAM, {fontStyle: "italic"}), marginTop: 24}}><Pw t={t} at={39.98}>y le hago la misma prueba</Pw></div>
			</ColorCard>
			{/* close: logo */}
			<ColorCard from={42.4} to={99} bg={MAROON}>
				<div style={thin(56, CREAM)}><Pw t={t} at={42.45}>Agenda tu diagnóstico</Pw></div>
				<div style={{...cond(220, RED), marginTop: 10}}><Pw t={t} at={42.55} dur={0.22} blur={18}>gratuito</Pw></div>
				<div style={{marginTop: 90, display: "flex", justifyContent: "center", opacity: Math.max(win, rev)}}><LogoImg height={120} reveal={rev} windowOn={win} /></div>
			</ColorCard>
		</AbsoluteFill>
	);
};

export const Reel6: React.FC = () => {
	const t = useT();
	const bw = BW.some(([a, b]) => on(t, a, b));
	const fx: React.CSSProperties = {filter: bw ? "grayscale(1) contrast(1.12)" : undefined};
	return (
		<AbsoluteFill style={{backgroundColor: INK}}>
			<AbsoluteFill style={fx}><OffthreadVideo src={staticFile("reel6_src.mov")} muted /></AbsoluteFill>
			<Behind />
			<AbsoluteFill style={fx}><OffthreadVideo src={staticFile("reel6_alpha.webm")} transparent muted /></AbsoluteFill>
			<GalaSubs lines={LINES6} keys={KEYS} hide={HIDE} y={1250} />
			<Front />
			<Audio src={staticFile("reel6_src.mov")} />

			<Sfx at={0} src="reel_hit.wav" v={0.34} />
			<Sfx at={1.29} src="sfx_whoosh.wav" v={0.16} />
			<Sfx at={3.3} src="sfx_whoosh.wav" v={0.2} />
			<Sfx at={7.87} src="sfx_pop.wav" v={0.2} />
			<Sfx at={10.45} src="sfx_whoosh.wav" v={0.2} />
			<Sfx at={12.02} src="sfx_pop.wav" v={0.18} />
			<Sfx at={13.82} src="sfx_click.wav" v={0.2} />
			<Sfx at={17.62} src="sfx_pop.wav" v={0.18} />
			<Sfx at={20.35} src="reel_hit.wav" v={0.26} />
			<Sfx at={22.22} src="sfx_pop.wav" v={0.2} />
			<Sfx at={26.0} src="sfx_whoosh.wav" v={0.2} />
			<Sfx at={26.75} src="sfx_pop.wav" v={0.16} />
			{[27.58, 28.86, 30.16].map((a, i) => <Sfx key={i} at={a} src="sfx_click.wav" v={0.18} />)}
			<Sfx at={32.73} src="sfx_pop.wav" v={0.18} />
			<Sfx at={34.29} src="sfx_pop.wav" v={0.2} />
			<Sfx at={37.6} src="sfx_pop.wav" v={0.18} />
			<Sfx at={38.78} src="reel_hit.wav" v={0.26} />
			<Sfx at={42.35} src="sfx_whoosh.wav" v={0.18} />
			<Sfx at={42.75} src="reel_hit.wav" v={0.3} />
		</AbsoluteFill>
	);
};
