import React from "react";
import {AbsoluteFill, Easing, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {fontFamily} from "./ui";

type P = [number, number];

/** CSS matrix3d that maps the rectangle (0,0)-(w,h) onto the quad tl,tr,br,bl (projective / perspective). */
const quadTransform = (w: number, h: number, [tl, tr, br, bl]: [P, P, P, P]) => {
	const src: P[] = [[0, 0], [w, 0], [w, h], [0, h]];
	const dst: P[] = [tl, tr, br, bl];
	const A: number[][] = [];
	const b: number[] = [];
	for (let i = 0; i < 4; i++) {
		const [x, y] = src[i];
		const [u, v] = dst[i];
		A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]); b.push(u);
		A.push([0, 0, 0, x, y, 1, -v * x, -v * y]); b.push(v);
	}
	// Gaussian elimination
	const n = 8;
	for (let c = 0; c < n; c++) {
		let p = c;
		for (let r = c + 1; r < n; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
		[A[c], A[p]] = [A[p], A[c]]; [b[c], b[p]] = [b[p], b[c]];
		for (let r = 0; r < n; r++) {
			if (r === c) continue;
			const f = A[r][c] / A[c][c];
			for (let k = c; k < n; k++) A[r][k] -= f * A[c][k];
			b[r] -= f * b[c];
		}
	}
	const [a, bb, cc, d, e, f, g, hh] = b.map((v, i) => v / A[i][i]);
	return `matrix3d(${a},${d},0,${g},${bb},${e},0,${hh},0,0,1,0,${cc},${f},0,1)`;
};

// Measured on the 1080p frame of the "noche" clip (the phone does not move).
const SCREEN: [P, P, P, P] = [[1219, 166], [1509, 131], [1260, 869], [970, 832]];
// The existing WhatsApp notification card on the lit screen (text area left of the WhatsApp icon).
const CARD: [P, P, P, P] = [[1168, 276], [1390, 276], [1382, 350], [1168, 352]];

export const Opening: React.FC<{screenOn: number; screenOff: number}> = ({screenOn, screenOff}) => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();
	const t = frame / fps;
	const on = Math.min(
		interpolate(t, [screenOn, screenOn + 0.18], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}),
		interpolate(t, [screenOff - 0.12, screenOff], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}),
	);
	const push = interpolate(frame, [0, durationInFrames], [1, 1.16], {easing: Easing.inOut(Easing.quad)});
	const soft: React.CSSProperties = {filter: "blur(0.35px)", opacity: on * 0.94};
	return (
		<AbsoluteFill style={{backgroundColor: "#000", overflow: "hidden"}}>
			<AbsoluteFill style={{transform: `scale(${push})`, transformOrigin: "1240px 500px"}}>
				<OffthreadVideo src={staticFile("noche.mp4")} trimBefore={Math.round(0.6 * fps)} muted />
				{/* lock-screen clock, in the phone's perspective */}
				<div style={{position: "absolute", left: 0, top: 0, width: 1000, height: 2160, transformOrigin: "0 0", transform: quadTransform(1000, 2160, SCREEN), ...soft}}>
					<div style={{position: "absolute", top: 120, width: "100%", textAlign: "center", fontFamily, fontWeight: 300, fontSize: 200, color: "#1d2326", letterSpacing: -4, lineHeight: 1}}>
						11:40
					</div>
				</div>
				{/* message inside the notification card */}
				<div style={{position: "absolute", left: 0, top: 0, width: 640, height: 210, transformOrigin: "0 0", transform: quadTransform(640, 210, CARD), ...soft}}>
					<div style={{position: "absolute", left: 34, top: 40, right: 20, fontFamily, fontWeight: 600, fontSize: 52, lineHeight: 1.12, color: "#15191b", letterSpacing: -0.6}}>
						¿Cuánto es la inicial del depa de 2 dormitorios?
					</div>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
