import React from "react";
import {AbsoluteFill, Img, staticFile} from "remotion";
import {FONT, RED, Window} from "../reel/brand";

/** Reel cover 1080x1920. Text kept inside the 3:4 grid crop (y 240–1680) and off her face. */
export const Cover4: React.FC = () => (
	<AbsoluteFill style={{fontFamily: FONT}}>
		<Img src={staticFile("cover4_bg.png")} />
		{/* soft top shade so the title reads on the white wall without a hard box */}
		<AbsoluteFill style={{background: "linear-gradient(180deg, rgba(10,10,10,0.0) 0%, rgba(10,10,10,0) 100%)"}} />
		<div style={{position: "absolute", left: 60, right: 60, top: 262, display: "flex", flexDirection: "column", alignItems: "center"}}>
			<div style={{background: "rgba(10,10,10,0.94)", borderRadius: 34, padding: "26px 42px 30px", boxShadow: "0 20px 50px rgba(0,0,0,0.25)", position: "relative"}}>
				<div style={{position: "absolute", left: 24, top: 22}}><Window size={18} /></div>
				<div style={{color: "#fff", fontWeight: 700, fontSize: 86, lineHeight: 1.0, letterSpacing: -2.6, textAlign: "center"}}>
					<span style={{color: RED}}>3 cosas</span> para dejar
					<br />de responder a mano
				</div>
			</div>
		</div>
		<div style={{position: "absolute", left: 0, right: 0, top: 1480, display: "flex", flexDirection: "column", alignItems: "center", gap: 18}}>
			<div style={{background: "#fff", color: "#0A0A0A", fontWeight: 700, fontSize: 40, padding: "12px 30px", borderRadius: 999, boxShadow: "0 10px 30px rgba(0,0,0,0.25)", letterSpacing: -0.5}}>
				Gratis · <span style={{color: RED}}>en 5 minutos</span>
			</div>
			<div style={{color: "#fff", fontWeight: 600, fontSize: 30, textShadow: "0 2px 10px rgba(0,0,0,0.6)"}}>@wida_ia</div>
		</div>
	</AbsoluteFill>
);
