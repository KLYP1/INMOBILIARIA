import React from "react";
import {AbsoluteFill, Audio, Easing, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {Captions, CornerLabel, Cue} from "./ui";

// Soft zooms onto the detail being named: [start, end, scale, focusX, focusY] in demo seconds.
const ZOOMS: [number, number, number, number, number][] = [
	[10.0, 19.6, 1.42, 1455, 470], // "Resumen de Camila" column
	[37.0, 44.3, 1.38, 1640, 600], // visit sheet: WhatsApp reminder + "Lo que le llega al asesor…"
];

const zoomAt = (t: number) => {
	for (const [a, b, s, x, y] of ZOOMS) {
		if (t < a - 0.01 || t > b + 0.01) continue;
		const k = Math.min(
			interpolate(t, [a, a + 0.9], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic)}),
			interpolate(t, [b - 0.6, b], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic)}),
		);
		const sc = 1 + (s - 1) * k;
		// keep the zoomed window inside the frame
		const hw = 960 / sc, hh = 540 / sc;
		const cx = Math.min(Math.max(x, hw), 1920 - hw);
		const cy = Math.min(Math.max(y, hh), 1080 - hh);
		const fx = 960 + (cx - 960) * k, fy = 540 + (cy - 540) * k;
		return {sc, fx, fy};
	}
	return {sc: 1, fx: 960, fy: 540};
};

export const DEMO_CUES: Cue[] = [
	[0.35, 2.85, "Este es el panel de un proyecto de ejemplo."],
	[3.0, 4.95, "Entra un mensaje de alguien que vio el anuncio"],
	[4.95, 8.75, "y Camila, la asistente, le contesta en segundos con los precios reales."],
	[9.45, 13.0, "Y no solo responde: pregunta lo que preguntaría tu mejor asesor."],
	[13.9, 17.0, "Presupuesto, dormitorios, zona, forma de pago…"],
	[17.0, 19.95, "y va armando la ficha sola, con su puntaje."],
	[20.25, 24.25, "¿De dónde saca los precios? De tu inventario, que subes desde un Excel."],
	[24.5, 26.75, "Todo lo que escribe se queda aquí, calificado."],
	[26.75, 29.05, "Tu equipo sabe a quién llamar primero."],
	[29.55, 33.75, "Cuando el interesado está listo, Camila le ofrece horarios y agenda la visita."],
	[33.95, 36.2, "Aparece aquí, en la agenda de tu equipo."],
	[37.0, 39.2, "El mismo día le confirma por WhatsApp,"],
	[39.2, 41.55, "y media hora antes tu asesor recibe esto:"],
	[41.6, 44.35, "quién llega, qué busca y qué depa mostrarle."],
	[44.55, 46.2, "Nadie de tu equipo tocó el celular."],
	[46.25, 48.2, "Y no hace falta que te fíes de un video:"],
	[48.2, 52.2, "en la llamada lo abrimos juntos y le escribes tú, con un proyecto tuyo."],
];

export const Demo: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;
	const {sc, fx, fy} = zoomAt(t);
	return (
		<AbsoluteFill style={{backgroundColor: "#fff", overflow: "hidden"}}>
			<AbsoluteFill style={{transformOrigin: "0 0", transform: `translate(${960 - fx * sc}px, ${540 - fy * sc}px) scale(${sc})`}}>
				<OffthreadVideo src={staticFile("demo.mp4")} muted />
			</AbsoluteFill>
			<Audio src={staticFile("demo_vo.wav")} />
			<CornerLabel text="Proyecto de ejemplo" />
			<Captions cues={DEMO_CUES} />
		</AbsoluteFill>
	);
};
