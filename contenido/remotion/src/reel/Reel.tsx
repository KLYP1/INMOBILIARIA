import React from "react";
import {AbsoluteFill, Audio, Easing, Img, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {BG, FONT, RED, useAppear} from "./brand";

/** The official KLYP logo (client-supplied artwork): red window first, then the letters wipe in. */
export const LogoImg: React.FC<{height: number; reveal: number; windowOn: number}> = ({height, reveal, windowOn}) => {
	const w = (height / 154) * 555;
	return (
		<div style={{position: "relative", width: w, height}}>
			<Img src={staticFile("klyp_logo_window.png")} style={{position: "absolute", inset: 0, width: w, height, opacity: windowOn, transform: `scale(${0.6 + 0.4 * windowOn})`, transformOrigin: "13% 83%"}} />
			<Img src={staticFile("klyp_logo_text.png")} style={{position: "absolute", inset: 0, width: w, height, clipPath: `inset(0 ${100 - reveal * 100}% 0 0)`}} />
		</div>
	);
};
import {AllDay, BigStatement, Channels, Conversation, DemoCTA, HookMessage, Mockup, StrikeWords} from "./Gfx";
import {Subs} from "./Subs";
import {LINES} from "./lines";

export const SPEECH = 38.3;
export const OUTRO = 2.6;

// zoom plan: [time, scale, instant?]  (jump cuts are instant, the rest ease in 300 ms)
const ZOOMS: [number, number, boolean][] = [
	[0, 1.0, true], [2.45, 1.08, true], [5.15, 1.14, false], [6.3, 1.0, true], [9.3, 1.06, false], [11.7, 1.0, true],
	[13.0, 1.08, false], [16.05, 1.0, true], [17.82, 1.12, false], [18.85, 1.04, true], [21.75, 1.0, true], [24.8, 1.07, false],
	[28.75, 1.0, true], [31.2, 1.06, false], [34.22, 1.0, true], [35.95, 1.1, false],
];
const zoomAt = (t: number) => {
	let prev = 1, cur = 1, start = 0, inst = true;
	for (const [a, s, i] of ZOOMS) if (t >= a) { prev = cur; cur = s; start = a; inst = i; }
	if (inst) return cur;
	const d = cur > prev && cur - prev > 0.05 && start === 5.15 ? 0.7 : 0.3; // "te duele": slow push-in
	return prev + (cur - prev) * interpolate(t, [start, start + d], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});
};

const S: React.FC<{at: number; src: string; v?: number}> = ({at, src, v = 0.3}) => {
	const {fps} = useVideoConfig();
	return <Sequence from={Math.round(at * fps)}><Audio src={staticFile(src)} volume={v} /></Sequence>;
};

export const Outro: React.FC<{cta?: React.ReactNode}> = ({cta: ctaNode}) => {
	const t = useCurrentFrame() / useVideoConfig().fps;
	const bg = interpolate(t, [0, 0.3], [0, 1], {extrapolateRight: "clamp"});
	const win = interpolate(t, [0.25, 0.75], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
	const reveal = interpolate(t, [0.75, 1.25], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});
	const {k: cta} = useAppear(1.25, 99, 0.35);
	return (
		<AbsoluteFill style={{backgroundColor: `rgba(10,10,10,${bg})`, justifyContent: "center", alignItems: "center"}}>
			<div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 56}}>
				<LogoImg height={150} reveal={reveal} windowOn={win} />
				<div style={{opacity: cta, transform: `translateY(${(1 - cta) * 16}px)`, display: "flex", alignItems: "center", gap: 18, fontFamily: FONT, color: "#fff", fontSize: 54, fontWeight: 600, letterSpacing: -0.5}}>
					{ctaNode ?? (<>Comenta <span style={{fontWeight: 700, color: "#fff", borderBottom: `6px solid ${RED}`, paddingBottom: 2}}>DEMO</span></>)}
				</div>
			</div>
			{/* thin frame lines that breathe */}
			<div style={{position: "absolute", left: 90, right: 90, top: 760, height: 1, background: `rgba(255,255,255,${0.12 * reveal})`}} />
			<div style={{position: "absolute", left: 90, right: 90, bottom: 700, height: 1, background: `rgba(255,255,255,${0.12 * cta})`}} />
		</AbsoluteFill>
	);
};

export const Reel: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;
	const z = zoomAt(t);
	return (
		<AbsoluteFill style={{backgroundColor: BG}}>
			<AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: "540px 385px" /* pivot on the hairline: zooms grow downward, never toward the graphics */}}>
				<OffthreadVideo src={staticFile("reel_src.mov")} />
			</AbsoluteFill>

			<HookMessage from={0.05} to={2.5} />
			<Conversation from={7.75} to={13.0} outAt={9.85} lostAt={10.75} replyAt={12.0} />
			<StrikeWords from={13.65} to={16.05} at={[13.84, 14.52, 15.32]} />
			<BigStatement from={17.85} to={21.65} />
			<Channels from={25.35} to={27.05} />
			<AllDay from={27.1} to={28.75} />
			<Mockup from={28.85} to={34.3} unitsAt={31.3} calAt={33.4} />
			<DemoCTA from={36.0} to={SPEECH + 0.1} />

			<Subs lines={LINES} hide={[[0, 2.3]]} y={1268} redHold={{words: ["te", "duele"], from: 5.3, to: 6.3}} />

			{/* sound design (sparse, under the voice) */}
			<S at={0.08} src="sfx_noti.wav" v={0.32} />
			<S at={5.3} src="reel_hit.wav" v={0.35} />
			<S at={7.8} src="sfx_noti.wav" v={0.26} />
			<S at={9.85} src="sfx_pop.wav" v={0.2} />
			<S at={12.0} src="sfx_noti.wav" v={0.24} />
			<S at={13.75} src="sfx_whoosh.wav" v={0.16} />
			<S at={17.85} src="reel_hit.wav" v={0.38} />
			<S at={25.35} src="sfx_pop.wav" v={0.2} />
			<S at={27.05} src="sfx_whoosh.wav" v={0.16} />
			<S at={31.3} src="sfx_pop.wav" v={0.18} />
			<S at={33.6} src="sfx_click.wav" v={0.3} />
			<S at={35.95} src="sfx_whoosh.wav" v={0.18} />
			<S at={SPEECH} src="sfx_whoosh.wav" v={0.16} />
			<S at={SPEECH + 0.3} src="sfx_pop.wav" v={0.2} />

			<Sequence from={Math.round(SPEECH * fps)}>
				<Outro />
			</Sequence>
		</AbsoluteFill>
	);
};
