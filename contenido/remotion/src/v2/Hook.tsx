import React from "react";
import {AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {BigQuote, ClockJump, W, WordCaptions, zoomAtCut} from "./kit";
import {PhoneHook} from "./Phone";
import {Ambient} from "./Ambient";

// What she says in the hook (source = face_main.mp4 seconds, corrected Whisper word timings). "|" ends a caption page.
export const HOOK_WORDS: W[] = [
	["Miércoles,", 0.96, 1.4], ["once", 1.4, 1.62], ["y", 1.62, 1.7], ["cuarenta", 1.7, 1.96], ["de", 1.96, 2.12], ["la", 2.12, 2.26], ["noche,|", 2.26, 2.54],
	["alguien", 2.68, 2.86], ["ve", 2.86, 2.96], ["la", 2.96, 3.1], ["publicidad", 3.1, 3.56], ["de", 3.56, 3.64], ["tu", 3.64, 3.8], ["anuncio", 3.8, 4.08], ["y", 4.08, 4.3], ["escribe:|", 4.3, 4.6],
	["¿Cuánto", 4.6, 5.0], ["es", 5.0, 5.16], ["la", 5.16, 5.3], ["inicial", 5.3, 5.54], ["del", 5.54, 5.68], ["depa", 5.68, 5.92], ["de", 5.92, 6.02], ["dos", 6.02, 6.14], ["dormitorios?|", 6.14, 6.88],
	["Pero", 7.16, 7.26], ["nadie", 7.26, 7.38], ["contesta.|", 7.38, 8.26],
	["Tu", 8.54, 8.62], ["asesor,", 8.62, 8.8], ["a", 8.8, 8.92], ["la", 8.92, 9.04], ["mañana", 9.04, 9.24], ["del", 9.24, 9.38], ["día", 9.38, 9.5], ["siguiente,|", 9.5, 9.88],
	["le", 9.88, 10.1], ["responde", 10.1, 10.44], ["con", 10.44, 10.68], ["muchos", 10.68, 10.94], ["ánimos,|", 10.94, 11.66],
	["pero", 11.88, 12.32], ["ya", 12.32, 12.75], ["el", 13.3, 13.46], ["cliente", 13.46, 13.74], ["no", 13.74, 13.92], ["responde.|", 13.92, 14.58],
	["Esa", 14.78, 14.98], ["misma", 14.98, 15.2], ["noche", 15.2, 15.44], ["agendó", 15.44, 15.86], ["visita|", 15.86, 16.18],
	["con", 16.18, 16.4], ["la", 16.4, 16.52], ["inmobiliaria", 16.52, 16.96], ["que", 16.96, 17.14], ["sí", 17.14, 17.26], ["le", 17.26, 17.48], ["contestó.|", 17.48, 18.0],
];

const SRC0 = 0.86; // first source second used (voice starts 0.1 s into the video)
const PHONE = 2.3; // seconds of the night clip before cutting to her face (mid-sentence)

/** The first ~17 s: phone with her voice from the start, cut to face, big question, clock jump. */
export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;
	const s = (src: number) => src - SRC0; // source second -> local second
	// punch-in cuts (108-112 %), alternating, never the same zoom twice in a row
	const z = zoomAtCut(t, [[0, 1], [s(8.5), 1.1], [s(11.84), 1.0], [s(14.72), 1.12]]);
	return (
		<AbsoluteFill style={{backgroundColor: "#000"}}>
			<AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: "960px 400px"}}>
				<OffthreadVideo src={staticFile("v2_face.mp4")} trimBefore={Math.round(SRC0 * fps)} />
			</AbsoluteFill>
			{/* wall graphics, then her cut-out on top so they sit BEHIND her */}
			<Ambient items={[
				{from: 2.3, to: s(8.4), icon: "moon", x: 1505, y: 130},
				{from: 2.6, to: s(8.4), icon: "chat", x: 185, y: 130},
				{from: s(8.6), to: s(14.6), icon: "clock", x: 1505, y: 130},
				{from: s(14.75), to: 17.3, icon: "calendar", x: 185, y: 130},
				{from: s(14.95), to: 17.3, icon: "building", x: 1505, y: 130},
			]} />
			<AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: "960px 400px"}}>
				<OffthreadVideo src={staticFile("v2_face_alpha.webm")} trimBefore={Math.round(SRC0 * fps)} transparent muted />
			</AbsoluteFill>
			<Sequence durationInFrames={Math.round(PHONE * fps)} name="Celular">
				<PhoneHook notiAt={0.15} />
			</Sequence>
			{/* sound design: buzz + chime under the first word, whoosh on the cut, pops on the graphics */}
			<Sequence from={Math.round(0.02 * fps)}><Audio src={staticFile("sfx_vibra.wav")} volume={0.22} /></Sequence>
			<Sequence from={Math.round(0.2 * fps)}><Audio src={staticFile("sfx_noti.wav")} volume={0.26} /></Sequence>
			<Sequence from={Math.round((PHONE - 0.22) * fps)}><Audio src={staticFile("sfx_whoosh.wav")} volume={0.14} /></Sequence>
			<Sequence from={Math.round(s(4.55) * fps)}><Audio src={staticFile("sfx_pop.wav")} volume={0.16} /></Sequence>
			<Sequence from={Math.round(s(8.9) * fps)}><Audio src={staticFile("sfx_pop.wav")} volume={0.16} /></Sequence>

			<BigQuote from={s(4.55)} to={s(7.12)} text="«¿Cuánto es la inicial del depa de 2 dormitorios?»" />
			<ClockJump from={s(8.9)} to={s(14.6)} />
			<WordCaptions words={HOOK_WORDS} srcAt0={SRC0} hide={[[4.55, 7.12]]} />
		</AbsoluteFill>
	);
};
