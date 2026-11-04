import React from "react";
import {AbsoluteFill, Audio, Easing, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {CameraMotionBlur} from "@remotion/motion-blur";
import {GalaSubs} from "../reel5/Gala";
import {LogoImg} from "../reel/Reel";
import {LINES6} from "./lines";
import {Figure, Head3, IcBed, IcBolt, IcCal, IconList, IcWallet, k01, Msg, Veil} from "./Kit6";
import {cond, thin} from "../reel5/Gala";
import {RED} from "../reel/brand";

const FPS = 30;
export const SPEECH6 = 43.46;
export const OUTRO6 = 1.45;

/* Source edit (seconds of reel6_src.mov, already cut, graded and upscaled 1.5× to 1080×1920). */
// take per output range: [outStart, outEnd, take]
const TAKES: [number, number, number][] = [[0, 6.31, 1], [6.31, 11.56, 2], [11.56, 18.08, 3], [18.08, 24.69, 4], [24.69, 36.69, 5], [36.69, 99, 6]];
// measured in the 720×1280 original: eye x/y and face width per take
const FACE: Record<number, [number, number, number]> = {1: [382, 569, 224], 2: [366, 602, 233], 3: [350, 610, 205], 4: [369, 624, 178], 5: [356, 605, 204], 6: [365, 590, 219]};
type Ang = "M" | "C";
/** crop window (original px) for a take and a virtual angle: M = medium (face 20.5 % of height, eyes at 37 %), C = close (24 %, eyes at 38 %) */
const crop = (take: number, a: Ang) => {
	const [x, y, fw] = FACE[take];
	const r = a === "M" ? 0.205 : 0.24, e = a === "M" ? 0.37 : 0.38;
	const H = Math.min(fw / r, (1280 - y) / (1 - e)), W = (H * 9) / 16;
	return {W, H, L: Math.max(0, Math.min(720 - W, x - W / 2)), T: Math.max(0, Math.min(1280 - H, y - e * H))};
};
// shots: [outStart, angle]; a new phrase/idea = a new virtual angle
const SHOTS: [number, Ang][] = [[0, "M"], [3.35, "C"], [6.31, "M"], [9.53, "C"], [11.56, "M"], [14.47, "C"], [18.08, "M"], [21.68, "C"], [24.69, "M"], [33.13, "C"], [36.69, "M"], [38.74, "C"], [40.9, "M"]];
const CUTS = SHOTS.slice(1).map(([t]) => t);
const OUTF = 7, INF = 9; // robot-arm frames before / after the cut

const shotAt = (t: number) => {
	let i = 0;
	for (let k = 0; k < SHOTS.length; k++) if (t >= SHOTS[k][0]) i = k;
	return i;
};
const takeAt = (t: number) => (TAKES.find(([a, b]) => t >= a && t < b) ?? TAKES[TAKES.length - 1])[2];
// movement direction into each shot: towards a close-up the camera rises; towards a medium it slides sideways (alternating)
const dirInto = (i: number): [number, number] => (SHOTS[i][1] === "C" ? [0, -1] : i % 4 === 0 ? [1, 0] : [-1, 0]);

/** Robot-arm move: outgoing shot accelerates (push 100→115 %, short slide, 2.5° tilt), cut at peak speed, incoming decelerates. */
const arm = (f: number) => {
	for (let i = 1; i < SHOTS.length; i++) {
		const c = Math.round(SHOTS[i][0] * FPS);
		const [dx, dy] = dirInto(i);
		const rot = i % 2 ? 2.5 : -2.5;
		if (f >= c - OUTF && f < c) {
			const p = (f - (c - OUTF) + 1) / OUTF, e = p * p * p; // ease-in
			return {s: 1 + 0.15 * e, x: dx * 60 * e, y: dy * 60 * e, r: rot * e, blur: true};
		}
		if (f >= c && f < c + INF) {
			const q = (f - c) / INF, e = 1 - Math.pow(1 - q, 3); // ease-out, same direction of travel
			return {s: 1.12 - 0.12 * e, x: -dx * 60 * (1 - e), y: -dy * 60 * (1 - e), r: -rot * (1 - e), blur: q < 0.5};
		}
	}
	return {s: 1, x: 0, y: 0, r: 0, blur: false};
};

/** The footage, reframed per take/angle, with a slow 100→104 % creep inside every shot and the robot-arm move at cuts. */
const Footage: React.FC = () => {
	const f = useCurrentFrame();
	const t = f / FPS;
	const i = shotAt(t);
	const start = SHOTS[i][0], end = SHOTS[i + 1]?.[0] ?? SPEECH6 + OUTRO6;
	const {H, L, T} = crop(takeAt(t), SHOTS[i][1]);
	const s = 1920 / (H * 1.5);
	const creep = 1 + 0.04 * interpolate(t, [start, end], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
	const m = arm(f);
	return (
		<AbsoluteFill style={{transform: `translate(${m.x}px, ${m.y}px) rotate(${m.r}deg) scale(${creep * m.s})`, transformOrigin: "540px 720px"}}>
			<div style={{position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transformOrigin: "0 0", transform: `scale(${s}) translate(${-L * 1.5}px, ${-T * 1.5}px)`}}>
				<OffthreadVideo src={staticFile("reel6_src.mov")} muted style={{width: 1080, height: 1920}} />
			</div>
		</AbsoluteFill>
	);
};
const FootageLayer: React.FC = () => {
	const f = useCurrentFrame();
	return arm(f).blur ? (
		<CameraMotionBlur samples={8} shutterAngle={200}>
			<Footage />
		</CameraMotionBlur>
	) : (
		<Footage />
	);
};

// caption keywords that jump to big condensed caps (w = white, r = red)
const KEYS: Record<string, string> = {"mismo.": "w", "automáticas": "r", "siguiente.": "w", "ir.": "r", "primero.": "w", "intuición,": "w", "instante.": "r", "descansando.": "w", "inmobiliaria?": "r"};
// captions step aside while a big text sits on the chest or the veil carries the words
const HIDE: [number, number][] = [[3.35, 6.31], [22.0, 24.69], [26.04, 33.13]];

const Sfx: React.FC<{at: number; src: string; v?: number}> = ({at, src, v = 0.3}) => (
	<Sequence from={Math.max(0, Math.round(at * FPS))}><Audio src={staticFile(src)} volume={v} /></Sequence>
);

const Overlays: React.FC = () => {
	const t = useCurrentFrame() / FPS;
	const win = interpolate(t, [42.6, 43.0], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
	const rev = interpolate(t, [42.85, 43.35], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});
	return (
		<AbsoluteFill style={{pointerEvents: "none"}}>
			{/* 1 · hook */}
			<Head3 t={t} from={0} to={3.3} sup="Ayer por la noche le escribí a" key_="10 inmobiliarias" keyAt={1.29} letters acc="de Lima, preguntando lo mismo" accAt={2.05} />
			{/* 2 · the two questions, as chat bubbles */}
			{t >= 3.35 && t < 6.31 && (
				<div style={{position: "absolute", inset: 0, opacity: 1 - k01(t, 6.0, 0.3)}}>
					<Msg t={t} at={3.41} text="¿Aún tienes depas de 2 dormitorios?" time="21:40" top={110} />
					<Msg t={t} at={5.09} text="¿Cuál es la inicial del depa?" time="21:40" top={265} />
				</div>
			)}
			{/* 3–4 · who answered */}
			<Head3 t={t} from={6.36} to={9.5} sup="A medianoche me habían contestado" key_="5 de 10" keyAt={7.87} letters acc="con respuestas automáticas" accAt={8.49} />
			<Head3 t={t} from={9.6} to={11.53} sup="y el resto me contestó" key_="al día siguiente" keyAt={10.85} />
			{/* 5–6 · they paid for the lead */}
			<Head3 t={t} from={11.8} to={14.44} sup="Las 10 pagaron para que yo les escribiera" key_="me dejó ir" keyAt={13.82} letters acc="pero la mayoría…" accAt={13.24} />
			<Head3 t={t} from={14.6} to={18.05} sup="Si fuera un cliente real, hoy estaría visitando" key_="la que me contestó primero" keyAt={16.78} keySize={96} />
			{/* 7–8 · the study */}
			<Head3 t={t} from={18.18} to={21.65} sup="Y no es intuición:" key_="la primera hora" keyAt={20.4} letters acc="es un estudio" accAt={18.94} />
			<Figure t={t} from={22.12} to={24.66} value={7} pre="" suf="×" top={1190} sub="más probabilidades de calificar" subAt={22.94} />
			{/* 9–10 · the solution: same message, answered by the assistant */}
			<Head3 t={t} from={24.9} to={26.3} sup="Ahora mira" key_="el mismo mensaje" keyAt={25.46} letters />
			<Veil t={t} from={26.04} to={33.3}>
				<Msg t={t} at={26.5} text="¿Aún tienes depas de 2 dormitorios?" time="22:00" top={250} reply="Respondido por el asistente de KLYP" replyAt={26.95} />
				<IconList t={t} from={27.4} to={33.2} top={640} items={[[IcBolt, "Respondió al instante", 27.58], [IcBed, "Preguntó por los dormitorios", 28.86], [IcWallet, "Preguntó por el presupuesto", 30.16], [IcCal, "Agendó la visita del sábado", 31.63]]} />
			</Veil>
			{/* 11 · 10 PM */}
			<Head3 t={t} from={33.2} to={36.66} sup="y todo esto lo hizo a las" key_="10 de la noche" keyAt={34.29} letters acc="mientras sus asesores descansan" accAt={35.05} />
			{/* 12–13 · question + CTA */}
			<Head3 t={t} from={36.86} to={38.71} sup="¿Quieres saber" key_="en qué grupo cae" keyAt={37.42} letters acc="tu inmobiliaria?" accAt={37.92} />
			<Head3 t={t} from={38.82} to={41.75} sup="Agenda tu" key_="diagnóstico gratuito" keyAt={39.16} keySize={130} acc="y le hago la misma prueba" accAt={39.98} />
			{/* 14 · close: brand veil, CTA, logo */}
			<Veil t={t} from={41.7} to={SPEECH6 + OUTRO6 + 1} strong pillOn={false}>
				<div style={{position: "absolute", left: 60, right: 110, top: 470, textAlign: "center"}}>
					<div style={thin(56, "rgba(255,255,255,0.85)")}><span style={{opacity: k01(t, 42.0, 0.3)}}>Agenda tu</span></div>
					<div style={{...cond(170, RED), marginTop: 8, opacity: k01(t, 42.1, 0.35), transform: `scale(${0.95 + 0.05 * k01(t, 42.1, 0.35)})`}}>diagnóstico gratuito</div>
					<div style={{...thin(48, "#fff", {fontStyle: "italic"}), marginTop: 14, opacity: k01(t, 42.35, 0.35)}}>con tu propio proyecto</div>
				</div>
				<div style={{position: "absolute", left: 0, right: 0, top: 1010, display: "flex", justifyContent: "center", opacity: Math.max(win, rev)}}>
					<LogoImg height={120} reveal={rev} windowOn={win} />
				</div>
			</Veil>
		</AbsoluteFill>
	);
};

export const Reel6: React.FC = () => {
	const {fps} = useVideoConfig();
	return (
		<AbsoluteFill style={{backgroundColor: "#0e0f11"}}>
			<FootageLayer />
			<Overlays />
			<GalaSubs lines={LINES6} keys={KEYS} hide={HIDE} y={1185} />

			<Sfx at={0} src="reel_hit.wav" v={0.32} />
			{CUTS.map((c, i) => <Sfx key={i} at={c - 6 / fps} src="sfx_whoosh.wav" v={0.16} />)}
			{[3.41, 5.09].map((a, i) => <Sfx key={`b${i}`} at={a} src="sfx_pop.wav" v={0.14} />)}
			{[27.58, 28.86, 30.16, 31.63].map((a, i) => <Sfx key={`l${i}`} at={a} src="sfx_click.wav" v={0.16} />)}
			<Sfx at={22.12} src="sfx_pop.wav" v={0.16} />
			<Sfx at={34.29} src="sfx_click.wav" v={0.14} />
			<Sfx at={42.6} src="reel_hit.wav" v={0.3} />
			<Audio src={staticFile("reel6_src.mov")} />
		</AbsoluteFill>
	);
};
