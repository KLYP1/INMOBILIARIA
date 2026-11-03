import React from "react";
import {AbsoluteFill, Audio, Easing, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {BG, FONT, RED} from "../reel/brand";
import {Subs} from "../reel/Subs";
import {LogoImg} from "../reel/Reel";
import {useAppear} from "../reel/brand";
import {LINES} from "./lines";
import {AwayMessage, BOLT, Checklist, Conclusion, FaqButtons, HookText, IG, NextUp, PointTitle, QuickReplies, WA} from "./Gfx4";

export const SPEECH4 = 44.95;
export const OUTRO4 = 2.6;

// [time, scale, instant?] — only zooms IN (>= 1.0): the frame can never show anything below her line.
const ZOOMS: [number, number, boolean][] = [
	[0, 1.0, true], [0.05, 1.06, false], [2.8, 1.0, true], [6.1, 1.07, true], [8.34, 1.0, true], [12.0, 1.05, false],
	[15.05, 1.1, false], [16.26, 1.0, true], [19.02, 1.06, true], [22.5, 1.0, true], [25.0, 1.06, false], [27.95, 1.0, true],
	[30.19, 1.06, true], [33.83, 1.0, true], [37.13, 1.1, false], [39.26, 1.0, true], [42.34, 1.06, true],
];
const zoomAt = (t: number) => {
	let prev = 1, cur = 1, start = 0, inst = true;
	for (const [a, s, i] of ZOOMS) if (t >= a) { prev = cur; cur = s; start = a; inst = i; }
	if (inst) return cur;
	const d = start < 1 ? 2.4 : 0.35;
	return prev + (cur - prev) * interpolate(t, [start, start + d], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});
};

const S: React.FC<{at: number; src: string; v?: number}> = ({at, src, v = 0.3}) => {
	const {fps} = useVideoConfig();
	return <Sequence from={Math.round(at * fps)}><Audio src={staticFile(src)} volume={v} /></Sequence>;
};

/** Personal-brand close: @wida_ia first, KLYP as the company (official logo, small). */
const OutroWida: React.FC = () => {
	const t = useCurrentFrame() / useVideoConfig().fps;
	const bg = interpolate(t, [0, 0.3], [0, 1], {extrapolateRight: "clamp"});
	const {k: h} = useAppear(0.25, 99, 0.35);
	const {k: c} = useAppear(0.75, 99, 0.35);
	const win = interpolate(t, [1.1, 1.5], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
	const rev = interpolate(t, [1.35, 1.8], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});
	return (
		<AbsoluteFill style={{backgroundColor: `rgba(10,10,10,${bg})`, justifyContent: "center", alignItems: "center", fontFamily: FONT, color: "#fff"}}>
			<div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
				<div style={{fontSize: 104, fontWeight: 700, letterSpacing: -3, opacity: h, transform: `translateY(${(1 - h) * 18}px)`}}>@wida_ia</div>
				<div style={{fontSize: 50, fontWeight: 600, marginTop: 22, opacity: c, transform: `translateY(${(1 - c) * 14}px)`}}>
					Sígueme <span style={{borderBottom: `6px solid ${RED}`, paddingBottom: 2}}>para más</span>
				</div>
				<div style={{width: 520, height: 1, background: `rgba(255,255,255,${0.15 * win})`, margin: "70px 0 44px"}} />
				<div style={{display: "flex", alignItems: "center", gap: 22, opacity: Math.max(win, rev)}}>
					<div style={{fontSize: 28, fontWeight: 500, opacity: 0.7}}>Fundadora de</div>
					<LogoImg height={56} reveal={rev} windowOn={win} />
				</div>
			</div>
		</AbsoluteFill>
	);
};

export const Reel4: React.FC = () => {
	const t = useCurrentFrame() / useVideoConfig().fps;
	const {fps} = useVideoConfig();
	return (
		<AbsoluteFill style={{backgroundColor: BG}}>
			<AbsoluteFill style={{transform: `scale(${zoomAt(t)})`, transformOrigin: "540px 560px"}}>
				<OffthreadVideo src={staticFile("reel4_src.mov")} />
			</AbsoluteFill>

			<HookText from={0.05} to={6.05} secondAt={2.8} />
			<Checklist from={6.1} to={39.2} steps={[[6.1, 16.0], [16.26, 27.9], [27.95, 37.1]]} />
			<PointTitle from={6.15} to={8.3} n={1} title="Mensaje de ausencia" sub="WhatsApp Business" icon={WA} />
			<AwayMessage from={8.4} to={15.0} replyAt={11.55} />
			<PointTitle from={16.3} to={19.0} n={2} title="Respuestas rápidas" sub="Las preguntas de siempre" icon={BOLT} />
			<QuickReplies from={19.05} to={27.9} at={[19.2, 20.0, 20.6, 21.95]} fastAt={25.1} />
			<PointTitle from={28.0} to={30.15} n={3} title="Preguntas frecuentes" sub="Instagram" icon={IG} />
			<FaqButtons from={30.25} to={37.05} tapAt={35.5} />
			<Conclusion from={37.15} to={39.2} />
			<NextUp from={39.3} to={SPEECH4 + 0.1} at={[39.9, 40.8]} />

			<Subs lines={LINES} hide={[[0, 6.05], [11.56, 14.9], [37.1, 39.2]]} y={1370} />

			<S at={0.05} src="reel_hit.wav" v={0.35} />
			<S at={2.8} src="sfx_whoosh.wav" v={0.18} />
			<S at={4.2} src="sfx_pop.wav" v={0.16} />
			<S at={6.1} src="sfx_pop.wav" v={0.22} />
			<S at={8.45} src="sfx_noti.wav" v={0.26} />
			<S at={11.55} src="sfx_noti.wav" v={0.24} />
			<S at={16.0} src="sfx_click.wav" v={0.26} />
			<S at={16.3} src="sfx_pop.wav" v={0.22} />
			<S at={19.2} src="sfx_click.wav" v={0.18} />
			<S at={20.0} src="sfx_click.wav" v={0.18} />
			<S at={20.6} src="sfx_click.wav" v={0.18} />
			<S at={21.95} src="sfx_click.wav" v={0.18} />
			<S at={27.9} src="sfx_click.wav" v={0.26} />
			<S at={28.0} src="sfx_pop.wav" v={0.22} />
			<S at={30.3} src="sfx_whoosh.wav" v={0.15} />
			<S at={35.5} src="sfx_noti.wav" v={0.24} />
			<S at={37.1} src="sfx_click.wav" v={0.26} />
			<S at={37.15} src="reel_hit.wav" v={0.32} />
			<S at={39.9} src="sfx_pop.wav" v={0.18} />
			<S at={40.8} src="sfx_pop.wav" v={0.18} />
			<S at={SPEECH4} src="sfx_whoosh.wav" v={0.16} />
			<S at={SPEECH4 + 0.3} src="sfx_pop.wav" v={0.2} />

			<Sequence from={Math.round(SPEECH4 * fps)}>
				<OutroWida />
			</Sequence>
		</AbsoluteFill>
	);
};
