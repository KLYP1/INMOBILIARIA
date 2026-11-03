import React from "react";
import {AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {KeyTag, W, WordCaptions, zoomAtCut} from "./kit";
import {Ambient, Float} from "./Ambient";
import {DownArrow, LowerThird} from "../ui";

export type Tag = {from: number; to: number; text: string};

/** A talking-head stretch of the main take. All times are SOURCE seconds; converted to local inside. */
export const Talk: React.FC<{
	srcStart: number;
	words: W[];
	zooms: [number, number][];
	cards: Float[];
	tags?: Tag[];
	lowerThird?: [number, number];
	arrowAt?: number;
}> = ({srcStart, words, zooms, cards, tags = [], lowerThird, arrowAt}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;
	const L = (src: number) => src - srcStart;
	const z = zoomAtCut(t, zooms.map(([a, s]) => [L(a), s]));
	const trim = Math.round(srcStart * fps);
	const zoomStyle = {transform: `scale(${z})`, transformOrigin: "960px 400px"};
	return (
		<AbsoluteFill style={{backgroundColor: "#000"}}>
			<AbsoluteFill style={zoomStyle}>
				<OffthreadVideo src={staticFile("v2_face.mp4")} trimBefore={trim} />
			</AbsoluteFill>
			<Ambient items={cards.map((c) => ({...c, from: L(c.from), to: L(c.to)}))} />
			<AbsoluteFill style={zoomStyle}>
				<OffthreadVideo src={staticFile("v2_face_alpha.webm")} trimBefore={trim} transparent muted />
			</AbsoluteFill>

			{tags.map((g, i) => (
				<React.Fragment key={i}>
					<KeyTag from={L(g.from)} to={L(g.to)} text={g.text} top={420} />
					<Sequence from={Math.max(0, Math.round(L(g.from) * fps))}>
						<Audio src={staticFile("sfx_pop.wav")} volume={0.15} />
					</Sequence>
				</React.Fragment>
			))}
			{lowerThird && (
				<>
					<LowerThird from={L(lowerThird[0])} to={L(lowerThird[1])} />
					<Sequence from={Math.round(L(lowerThird[0]) * fps)}><Audio src={staticFile("sfx_pop.wav")} volume={0.15} /></Sequence>
				</>
			)}
			{arrowAt !== undefined && (
				<>
					<DownArrow from={L(arrowAt)} />
					<Sequence from={Math.round(L(arrowAt) * fps)}><Audio src={staticFile("sfx_pop.wav")} volume={0.15} /></Sequence>
				</>
			)}
			<WordCaptions words={words} srcAt0={srcStart} />
		</AbsoluteFill>
	);
};
