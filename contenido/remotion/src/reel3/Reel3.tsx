import React from "react";
import {AbsoluteFill, Audio, Easing, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {BG} from "../reel/brand";
import {DemoCTA} from "../reel/Gfx";
import {Subs} from "../reel/Subs";
import {Outro} from "../reel/Reel";
import {LINES} from "./lines";
import {ClientAsk, GenericReplies, HookPdf, Questions, Statement3, Timer, Units, Visit} from "./Gfx3";

export const SPEECH3 = 43.92;
export const OUTRO3 = 2.6;

// [time, scale, instant?] — jump cuts instant (disguise the cut), the rest ease; pivot on the hairline
const ZOOMS: [number, number, boolean][] = [
	[0, 1.0, true], [4.32, 1.13, false], [5.25, 1.0, true], [8.0, 1.05, false], [10.6, 1.0, true], [12.55, 1.06, true],
	[14.0, 1.0, true], [15.45, 1.06, true], [18.6, 1.0, false], [21.25, 1.06, true], [24.6, 1.0, true], [26.45, 1.1, false],
	[28.5, 1.03, false], [30.6, 1.0, true], [34.15, 1.06, true], [38.2, 1.0, true], [40.67, 1.08, true],
];
const zoomAt = (t: number) => {
	let prev = 1, cur = 1, start = 0, inst = true;
	for (const [a, s, i] of ZOOMS) if (t >= a) { prev = cur; cur = s; start = a; inst = i; }
	if (inst) return cur;
	const d = start === 4.32 ? 0.5 : 0.3;
	return prev + (cur - prev) * interpolate(t, [start, start + d], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});
};

const S: React.FC<{at: number; src: string; v?: number}> = ({at, src, v = 0.3}) => {
	const {fps} = useVideoConfig();
	return <Sequence from={Math.round(at * fps)}><Audio src={staticFile(src)} volume={v} /></Sequence>;
};

export const Reel3: React.FC = () => {
	const t = useCurrentFrame() / useVideoConfig().fps;
	const {fps} = useVideoConfig();
	return (
		<AbsoluteFill style={{backgroundColor: BG}}>
			<AbsoluteFill style={{transform: `scale(${zoomAt(t)})`, transformOrigin: "540px 330px"}}>
				<OffthreadVideo src={staticFile("reel3_src.mov")} />
			</AbsoluteFill>

			<HookPdf from={1.3} to={5.15} pdfAt={2.85} xAt={4.38} />
			<ClientAsk from={7.3} to={10.55} />
			<GenericReplies from={10.75} to={15.45} at={[11.05, 13.0, 14.2]} />
			<Timer from={21.3} to={24.45} runAt={22.15} leaveAt={23.95} />
			<Statement3 from={24.6} to={27.85} redAt={26.49} />
			<Questions from={30.6} to={34.12} at={[30.9, 32.08, 32.8]} />
			<Units from={34.45} to={38.15} at={[34.5, 34.9, 35.3]} />
			<Visit from={39.2} to={40.65} />
			<DemoCTA from={40.7} to={SPEECH3 + 0.1} />

			<Subs lines={LINES} hide={[[7.38, 10.6], [12.65, 15.5], [24.55, 27.85]]} y={1268} redHold={{words: ["perdiendo", "ventas."], from: 4.38, to: 5.2}} />

			<S at={1.35} src="sfx_noti.wav" v={0.3} />
			<S at={2.9} src="sfx_pop.wav" v={0.2} />
			<S at={4.38} src="reel_hit.wav" v={0.38} />
			<S at={7.35} src="sfx_noti.wav" v={0.24} />
			<S at={11.05} src="sfx_pop.wav" v={0.18} />
			<S at={13.0} src="sfx_pop.wav" v={0.16} />
			<S at={14.2} src="sfx_pop.wav" v={0.16} />
			<S at={22.15} src="sfx_click.wav" v={0.2} />
			<S at={22.5} src="sfx_click.wav" v={0.2} />
			<S at={22.85} src="sfx_click.wav" v={0.2} />
			<S at={23.95} src="sfx_whoosh.wav" v={0.2} />
			<S at={26.49} src="reel_hit.wav" v={0.36} />
			<S at={30.9} src="sfx_pop.wav" v={0.16} />
			<S at={34.6} src="sfx_click.wav" v={0.22} />
			<S at={35.0} src="sfx_click.wav" v={0.22} />
			<S at={35.4} src="sfx_click.wav" v={0.22} />
			<S at={39.4} src="sfx_click.wav" v={0.3} />
			<S at={40.7} src="sfx_whoosh.wav" v={0.18} />
			<S at={SPEECH3} src="sfx_whoosh.wav" v={0.16} />
			<S at={SPEECH3 + 0.3} src="sfx_pop.wav" v={0.2} />

			<Sequence from={Math.round(SPEECH3 * fps)}>
				<Outro />
			</Sequence>
		</AbsoluteFill>
	);
};
