import React from "react";
import {AbsoluteFill, Img, interpolate, OffthreadVideo, Series, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {BigQuestion, Captions, DownArrow, fontFamily, LowerThird, RED, SideCard} from "./ui";
import {Opening} from "./Opening";
import {Demo} from "./Demo";

const Clip: React.FC<{src: string; children?: React.ReactNode}> = ({src, children}) => (
	<AbsoluteFill style={{backgroundColor: "#000"}}>
		<OffthreadVideo src={staticFile(src)} />
		{children}
	</AbsoluteFill>
);

const EndCard: React.FC = () => {
	const t = useCurrentFrame() / useVideoConfig().fps;
	const black = interpolate(t, [0, 1], [0, 1], {extrapolateRight: "clamp"});
	const logo = interpolate(t, [0.6, 1.2], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
	return (
		<AbsoluteFill style={{backgroundColor: `rgba(0,0,0,${black})`, justifyContent: "center", alignItems: "center"}}>
			<div style={{opacity: logo, display: "flex", flexDirection: "column", alignItems: "center", gap: 18}}>
				<div style={{fontFamily, fontWeight: 700, fontSize: 120, color: "#fff", letterSpacing: 18, marginRight: -18}}>KLYP</div>
				<div style={{width: 72, height: 5, borderRadius: 3, background: RED}} />
			</div>
		</AbsoluteFill>
	);
};

export const Vsl: React.FC = () => {
	const {fps} = useVideoConfig();
	return (
		<AbsoluteFill style={{backgroundColor: "#000"}}>
			<Series>
				<Series.Sequence name="Apertura · noche" durationInFrames={Math.round(5.0 * fps)} premountFor={fps}>
					<Opening screenOn={1.95} screenOff={4.65} />
				</Series.Sequence>

				<Series.Sequence name="1A · El ejemplo" durationInFrames={225} premountFor={fps}>
					<Clip src="c1_1A.mp4">
						<Captions cues={[
							[0.15, 2.2, "Miércoles, once y cuarenta de la noche."],
							[2.2, 4.75, "Un cliente ve el anuncio de tu proyecto y te escribe:"],
						]} />
						<BigQuestion from={4.75} to={7.5} text="«¿Cuánto es la inicial del depa de 2 dormitorios?»" />
					</Clip>
				</Series.Sequence>

				<Series.Sequence name="1B" durationInFrames={225} premountFor={fps}>
					<Clip src="c2_1B.mp4">
						<SideCard from={1.4} to={7.4}>
							11:40 p. m. <span style={{color: RED, margin: "0 10px"}}>→</span> 9:40 a. m.
						</SideCard>
						<Captions cues={[
							[0.15, 3.75, "Tu asesor, al día siguiente, a las 9:40 de la mañana, ve el mensaje"],
							[3.75, 7.45, "y le responde muy entusiasmado, pero ya no obtiene respuesta."],
						]} />
					</Clip>
				</Series.Sequence>

				<Series.Sequence name="1C" durationInFrames={188} premountFor={fps}>
					<Clip src="c3_1C.mp4">
						<Captions cues={[[0.2, 5.4, "El cliente ya sacó una cita con la inmobiliaria que sí le contestó esa misma noche."]]} />
					</Clip>
				</Series.Sequence>

				<Series.Sequence name="1D" durationInFrames={336} premountFor={fps}>
					<Clip src="c4_1D.mp4">
						<Captions cues={[
							[0.0, 4.05, "Si tienes una constructora inmobiliaria en Lima, eso te pasa cada semana."],
							[4.3, 7.45, "Dame tres minutos y te enseño cómo ese mensaje se responde solo,"],
							[7.45, 11.15, "a cualquier hora, funcionando y no en diapositivas."],
						]} />
					</Clip>
				</Series.Sequence>

				<Series.Sequence name="2 · Mira esto" durationInFrames={81} premountFor={fps}>
					<Clip src="c5_b2.mp4">
						<Captions cues={[[0.08, 2.7, "No te voy a pedir que me creas. Mira esto."]]} />
					</Clip>
				</Series.Sequence>

				<Series.Sequence name="Demo" durationInFrames={Math.round(52.4 * fps)} premountFor={fps}>
					<Demo />
				</Series.Sequence>

				<Series.Sequence name="3A" durationInFrames={237} premountFor={fps}>
					<Clip src="c6_3A.mp4">
						<LowerThird from={0.2} to={4.6} />
						<Captions cues={[
							[0.12, 2.05, "Soy Wida, fundadora de KLYP."],
							[2.05, 4.55, "Lo construyo, lo instalo y te acompaño."],
							[4.55, 7.9, "No hay vendedores de por medio. Hablas conmigo de inicio a fin."],
						]} />
					</Clip>
				</Series.Sequence>

				<Series.Sequence name="3B" durationInFrames={297} premountFor={fps}>
					<Clip src="c7_3B.mp4">
						<SideCard from={2.0} to={9.7}>
							Piloto <span style={{color: RED, margin: "0 6px"}}>·</span> 7 días
						</SideCard>
						<Captions cues={[
							[0.12, 1.98, "Y no empezamos con un proyecto grande."],
							[1.98, 6.55, "Empezamos con un piloto acotado de tu proyecto, el alcance por escrito,"],
							[6.55, 9.9, "y en siete días los tienes respondiendo a tus clientes interesados."],
						]} />
					</Clip>
				</Series.Sequence>

				<Series.Sequence name="4A" durationInFrames={233} premountFor={fps}>
					<Clip src="c8_4A.mp4">
						<Captions cues={[
							[0.1, 3.05, "Si quieres verlo con tu proyecto, la llamada es de 30 minutos."],
							[3.05, 6.1, "Reviso cómo te llegan los leads hoy, dónde se están enfriando"],
							[6.1, 7.76, "y si puedo ayudarte con tu proyecto."],
						]} />
					</Clip>
				</Series.Sequence>

				<Series.Sequence name="4B" durationInFrames={87} premountFor={fps}>
					<Clip src="c9_4B.mp4">
						<Captions cues={[[0.08, 2.9, "Y si no puedo ayudarte, te lo digo en esa misma llamada."]]} />
					</Clip>
				</Series.Sequence>

				<Series.Sequence name="5 · Calendario" durationInFrames={191} premountFor={fps}>
					<Clip src="c10_5.mp4">
						<DownArrow from={0.3} />
						<Captions cues={[
							[0.1, 1.95, "Justo debajo tienes el calendario."],
							[1.95, 5.0, "Elige el horario que más se te acomode sin salir de esta página."],
							[5.1, 6.36, "Nos vemos dentro."],
						]} />
					</Clip>
				</Series.Sequence>

				<Series.Sequence name="Cierre · KLYP" durationInFrames={Math.round(2.2 * fps)} premountFor={fps}>
					<AbsoluteFill style={{backgroundColor: "#000"}}>
						<Img src={staticFile("c10_last.png")} />
						<EndCard />
					</AbsoluteFill>
				</Series.Sequence>
			</Series>
		</AbsoluteFill>
	);
};
