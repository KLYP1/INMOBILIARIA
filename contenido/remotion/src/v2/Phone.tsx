import React from "react";
import {AbsoluteFill, Easing, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {fontFamily} from "./kit";

type P = [number, number];

/** CSS matrix3d mapping the rectangle (0,0)-(w,h) onto the quad tl,tr,br,bl. */
export const quadTransform = (w: number, h: number, [tl, tr, br, bl]: [P, P, P, P]) => {
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
	for (let c = 0; c < 8; c++) {
		let p = c;
		for (let r = c + 1; r < 8; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
		[A[c], A[p]] = [A[p], A[c]]; [b[c], b[p]] = [b[p], b[c]];
		for (let r = 0; r < 8; r++) {
			if (r === c) continue;
			const f = A[r][c] / A[c][c];
			for (let k = c; k < 8; k++) A[r][k] -= f * A[c][k];
			b[r] -= f * b[c];
		}
	}
	const [a, bb, cc, d, e, f, g, hh] = b.map((v, i) => v / A[i][i]);
	return `matrix3d(${a},${d},0,${g},${bb},${e},0,${hh},0,0,1,0,${cc},${f},0,1)`;
};

// Measured on the 1080p "noche" frame (the phone does not move).
const SCREEN: [P, P, P, P] = [[1219, 166], [1509, 131], [1260, 869], [970, 832]];
// The empty notification card that the stock clip already shows (we cover it and slide ours in).
const CARD: [P, P, P, P] = [[1162, 266], [1463, 266], [1437, 358], [1162, 360]];

const WaIcon: React.FC<{size: number}> = ({size}) => (
	<svg width={size} height={size} viewBox="0 0 48 48">
		<circle cx="24" cy="24" r="22" fill="#25D366" />
		<path d="M24 11.5c-6.9 0-12.5 5.5-12.5 12.3 0 2.4.7 4.6 1.9 6.5L11.6 36l5.9-1.8c1.9 1 4 1.6 6.4 1.6 6.9 0 12.5-5.5 12.5-12.3S30.9 11.5 24 11.5z" fill="#fff" />
		<path d="M19.4 18.2c.3-.6.6-.6.9-.6h.7c.2 0 .5 0 .7.6l1 2.4c.1.3.1.6-.1.8l-.6.8c-.2.2-.3.5-.1.8.7 1.3 2 2.6 3.4 3.3.3.2.6.1.8-.1l.8-1c.2-.3.5-.3.8-.2l2.4 1.1c.3.1.5.3.5.6 0 .9-.4 1.8-1.2 2.3-1 .6-2.3.7-4.4-.2-2.6-1.1-4.5-3.6-5.1-4.6-.6-.9-1.2-2.4-1-3.7.1-.9.4-1.6 1-2.3z" fill="#25D366" />
	</svg>
);

/** Opening: the phone lights up in the dark; lock-screen clock and a WhatsApp notification sliding in; slow push-in. */
export const PhoneHook: React.FC<{notiAt: number}> = ({notiAt}) => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();
	const t = frame / fps;
	const push = interpolate(frame, [0, durationInFrames], [1.0, 1.13], {easing: Easing.inOut(Easing.quad)});
	const clock = interpolate(t, [0.0, 0.12], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
	const sp = spring({frame: frame - notiAt * fps, fps, config: {damping: 13, stiffness: 210, mass: 0.7}});
	const soft = "blur(0.3px)";
	return (
		<AbsoluteFill style={{backgroundColor: "#000", overflow: "hidden"}}>
			<AbsoluteFill style={{transform: `scale(${push})`, transformOrigin: "1240px 470px"}}>
				<OffthreadVideo src={staticFile("noche.mp4")} trimBefore={Math.round(1.7 * fps)} muted />
				{/* lock-screen clock */}
				<div style={{position: "absolute", left: 0, top: 0, width: 1000, height: 2160, transformOrigin: "0 0", transform: quadTransform(1000, 2160, SCREEN), opacity: clock * 0.95, filter: soft}}>
					<div style={{position: "absolute", top: 105, width: "100%", textAlign: "center", fontFamily, color: "#1d2326", lineHeight: 1}}>
						<span style={{fontWeight: 300, fontSize: 190, letterSpacing: -4}}>11:40</span>
						<span style={{fontWeight: 500, fontSize: 62, marginLeft: 14}}>p. m.</span>
					</div>
				</div>
				{/* our notification slides in over the stock (empty) card as soon as the screen lights up */}
				<div style={{position: "absolute", left: 0, top: 0, width: 900, height: 270, transformOrigin: "0 0", transform: quadTransform(900, 270, CARD), filter: soft, opacity: clock}}>
					<div
						style={{
							position: "absolute",
							inset: 8,
							borderRadius: 34,
							background: "#ffffff",
							boxShadow: "0 10px 30px rgba(0,40,60,0.18)",
							opacity: Math.min(1, sp * 1.4),
							transform: `translateY(${(1 - sp) * -230}px)`,
							display: "flex",
							alignItems: "center",
							gap: 26,
							padding: "0 34px 0 42px",
						}}
					>
						<div style={{flex: 1, fontFamily, color: "#15191b"}}>
							<div style={{fontSize: 34, fontWeight: 600, opacity: 0.55, marginBottom: 8}}>WhatsApp · ahora</div>
							<div style={{fontSize: 50, fontWeight: 600, lineHeight: 1.1, letterSpacing: -0.6}}>¿Cuánto es la inicial del depa de 2 dormitorios?</div>
						</div>
						<WaIcon size={112} />
					</div>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
