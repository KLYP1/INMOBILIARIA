import React from "react";
import {AbsoluteFill, Audio, Easing, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {BG} from "../reel/brand";
import {AllDay, Channels, DemoCTA} from "../reel/Gfx";
import {Subs} from "../reel/Subs";
import {Outro} from "../reel/Reel";
import {LINES} from "./lines";
import {AdIcon, Answered, HandIcon, Inbox, SeenMessage, Statement, Unanswered} from "./Gfx2";

export const SPEECH2 = 34.83;
export const OUTRO2 = 2.6;

// [time, scale, instant?] — jump cuts instant, the rest ease 300 ms; pivot on the hairline so zooms never push the face up
const ZOOMS: [number, number, boolean][] = [
	[0, 1.0, true], [3.4, 1.08, true], [4.39, 1.0, true], [6.19, 1.06, true], [8.47, 1.05, false],
	[9.99, 1.0, true], [11.72, 1.06, false], [13.1, 1.0, true], [16.67, 1.06, false], [18.2, 1.0, true], [21.67, 1.12, false],
	[23.12, 1.0, true], [26.07, 1.06, false], [27.22, 1.0, false], [30.07, 1.05, false], [32.52, 1.1, false],
];
const zoomAt = (t: number) => {
	let prev = 1, cur = 1, start = 0, inst = true;
	for (const [a, s, i] of ZOOMS) if (t >= a) { prev = cur; cur = s; start = a; inst = i; }
	if (inst) return cur;
	const d = 0.3;
	return prev + (cur - prev) * interpolate(t, [start, start + d], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});
};

const S: React.FC<{at: number; src: string; v?: number}> = ({at, src, v = 0.3}) => {
	const {fps} = useVideoConfig();
	return <Sequence from={Math.round(at * fps)}><Audio src={staticFile(src)} volume={v} /></Sequence>;
};

export const Reel2: React.FC = () => {
	const t = useCurrentFrame() / useVideoConfig().fps;
	const {fps} = useVideoConfig();
	return (
		<AbsoluteFill style={{backgroundColor: BG}}>
			<AbsoluteFill style={{transform: `scale(${zoomAt(t)})`, transformOrigin: "540px 330px"}}>
				<OffthreadVideo src={staticFile("reel2_src.mov")} />
			</AbsoluteFill>

			<SeenMessage from={0.05} to={3.3} />
			<Inbox from={3.57} to={6.32} />
			<Unanswered from={8.47} to={13.07} b2={10.17} countAt={11.82} />
			<AdIcon from={14.77} to={16.67} />
			<HandIcon from={16.72} to={18.67} />
			<Statement from={19.69} to={23.12} redAt={21.69} />
			<Channels from={23.97} to={26.02} />
			<AllDay from={26.07} to={27.17} />
			<Answered from={27.22} to={32.47} second={28.77} calAt={30.02} />
			<DemoCTA from={32.52} to={SPEECH2 + 0.1} />

			<Subs lines={LINES} hide={[[8.47, 11.67], [19.67, 23.12]]} y={1268} />

			<S at={0.1} src="sfx_noti.wav" v={0.32} />
			<S at={3.52} src="sfx_whoosh.wav" v={0.16} />
			<S at={8.52} src="sfx_noti.wav" v={0.24} />
			<S at={10.22} src="sfx_noti.wav" v={0.22} />
			<S at={11.82} src="sfx_click.wav" v={0.22} />
			<S at={12.27} src="sfx_click.wav" v={0.22} />
			<S at={12.72} src="sfx_click.wav" v={0.22} />
			<S at={14.77} src="sfx_pop.wav" v={0.2} />
			<S at={16.72} src="sfx_pop.wav" v={0.2} />
			<S at={19.67} src="sfx_whoosh.wav" v={0.16} />
			<S at={21.69} src="reel_hit.wav" v={0.38} />
			<S at={23.97} src="sfx_pop.wav" v={0.2} />
			<S at={26.07} src="sfx_whoosh.wav" v={0.15} />
			<S at={27.57} src="sfx_pop.wav" v={0.18} />
			<S at={30.27} src="sfx_click.wav" v={0.3} />
			<S at={32.52} src="sfx_whoosh.wav" v={0.18} />
			<S at={SPEECH2} src="sfx_whoosh.wav" v={0.16} />
			<S at={SPEECH2 + 0.3} src="sfx_pop.wav" v={0.2} />

			<Sequence from={Math.round(SPEECH2 * fps)}>
				<Outro />
			</Sequence>
		</AbsoluteFill>
	);
};
