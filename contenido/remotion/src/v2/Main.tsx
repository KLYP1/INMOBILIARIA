import React from "react";
import {AbsoluteFill, Audio, Img, interpolate, Sequence, Series, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {Hook} from "./Hook";
import {Talk} from "./Talk";
import {Demo2, DEMO_LEN} from "./Demo2";
import {MAIN_WORDS} from "./words";
import {fontFamily, RED} from "./kit";

const Outro: React.FC = () => {
	const t = useCurrentFrame() / useVideoConfig().fps;
	const black = interpolate(t, [0, 0.9], [0, 1], {extrapolateRight: "clamp"});
	const logo = interpolate(t, [0.6, 1.2], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
	return (
		<AbsoluteFill>
			<Img src={staticFile("v2_last.png")} />
			<AbsoluteFill style={{backgroundColor: `rgba(0,0,0,${black})`, justifyContent: "center", alignItems: "center"}}>
				<div style={{opacity: logo, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, transform: `scale(${0.96 + 0.04 * logo})`}}>
					<div style={{fontFamily, fontWeight: 700, fontSize: 124, color: "#fff", letterSpacing: 18, marginRight: -18}}>KLYP</div>
					<div style={{width: 76, height: 5, borderRadius: 3, background: RED}} />
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

export const A_LEN = 18.16 + 0; // hook covers src 0.86-18.16
const fps = 30;
export const SEG = {
	hook: Math.round(17.3 * fps),
	talkA: Math.round((32.25 - 18.16) * fps),
	demo: Math.round(DEMO_LEN * fps),
	talkC: Math.round((69.1 - 32.35) * fps),
	outro: Math.round(2.2 * fps),
};
export const TOTAL = Object.values(SEG).reduce((a, b) => a + b, 0);

export const Main: React.FC = () => (
	<AbsoluteFill style={{backgroundColor: "#000"}}>
		<Series>
			<Series.Sequence name="Gancho" durationInFrames={SEG.hook} premountFor={30}>
				<Hook />
			</Series.Sequence>
			<Series.Sequence name="Problema y transición" durationInFrames={SEG.talkA} premountFor={30}>
				<Talk
					srcStart={18.16}
					words={MAIN_WORDS}
					zooms={[[18.16, 1.0], [22.88, 1.1], [26.9, 1.0], [29.36, 1.12]]}
					cards={[
						{from: 18.3, to: 22.4, icon: "building", x: 185, y: 130},
						{from: 18.5, to: 22.4, icon: "calendar", x: 1505, y: 130},
						{from: 22.9, to: 28.7, icon: "clock", x: 1505, y: 130},
						{from: 29.4, to: 32.25, icon: "phone", x: 185, y: 130},
						{from: 29.55, to: 32.25, icon: "bolt", x: 1505, y: 130},
					]}
					tags={[
						{from: 25.85, to: 27.0, text: "A cualquier hora"},
						{from: 26.9, to: 29.2, text: "Funcionando, no en diapositivas"},
					]}
				/>
			</Series.Sequence>
			<Series.Sequence name="Demo" durationInFrames={SEG.demo} premountFor={30}>
				<Demo2 />
			</Series.Sequence>
			<Series.Sequence name="Wida, piloto, llamada y cierre" durationInFrames={SEG.talkC} premountFor={30}>
				<Talk
					srcStart={32.35}
					words={MAIN_WORDS}
					zooms={[[32.35, 1.0], [37.0, 1.1], [40.14, 1.0], [45.56, 1.12], [48.58, 1.0], [51.82, 1.08], [55.7, 1.0], [60.94, 1.1], [63.2, 1.0]]}
					lowerThird={[32.45, 36.7]}
					cards={[
						{from: 32.5, to: 36.8, icon: "user", x: 185, y: 130},
						{from: 32.7, to: 36.8, icon: "star", x: 1505, y: 130},
						{from: 37.1, to: 40.0, icon: "chat", x: 1505, y: 130},
						{from: 40.2, to: 45.4, icon: "check", x: 1505, y: 130},
						{from: 45.5, to: 48.5, icon: "calendar", x: 1505, y: 130},
						{from: 48.6, to: 51.4, icon: "bolt", x: 1505, y: 130},
						{from: 48.75, to: 51.4, icon: "star", x: 185, y: 130},
						{from: 51.9, to: 55.6, icon: "phone", x: 1505, y: 130},
						{from: 55.75, to: 60.9, icon: "user", x: 185, y: 130},
						{from: 55.9, to: 60.9, icon: "chat", x: 1505, y: 130},
						{from: 60.95, to: 62.9, icon: "check", x: 1505, y: 130},
						{from: 63.3, to: 69.05, icon: "calendar", x: 1505, y: 130},
					]}
					tags={[
						{from: 37.05, to: 40.0, text: "Sin vendedores de por medio"},
						{from: 42.4, to: 48.5, text: "Piloto · 7 días"},
						{from: 53.6, to: 56.0, text: "30 minutos"},
					]}
					arrowAt={63.3}
				/>
			</Series.Sequence>
			<Series.Sequence name="Logo" durationInFrames={SEG.outro}>
				<Outro />
				<Sequence from={0}><Audio src={staticFile("sfx_whoosh.wav")} volume={0.1} /></Sequence>
			</Series.Sequence>
		</Series>
	</AbsoluteFill>
);
