import React from "react";
import {AbsoluteFill, Img, staticFile} from "remotion";
import {RED} from "../reel/brand";
import {cond, thin} from "./Gala";

/** Reel cover 1080x1920 in the editorial style: big condensed title partly behind her head (matte layer), text inside the 3:4 grid crop (y 240–1680). */
export const Cover5: React.FC = () => (
	<AbsoluteFill>
		<Img src={staticFile("cover5_bg.png")} />
		<div style={{position: "absolute", left: 0, right: 0, top: 262, textAlign: "center", ...cond(230, RED)}}>3 preguntas</div>
		<Img src={staticFile("cover5_fg.png")} style={{position: "absolute", left: 0, top: 0}} />
		<div style={{position: "absolute", left: 0, right: 0, top: 1240, textAlign: "center", ...thin(84, "#fff", {textShadow: "0 2px 16px rgba(0,0,0,0.5)"})}}>
			antes de agendar
			<br />
			una <span style={{...cond(190, "#fff"), display: "inline-block", marginTop: 8}}>visita</span>
		</div>
		<div style={{position: "absolute", left: 0, right: 0, top: 1600, textAlign: "center", ...thin(36, "rgba(255,255,255,0.85)", {fontWeight: 400})}}>@wida_ia</div>
	</AbsoluteFill>
);
