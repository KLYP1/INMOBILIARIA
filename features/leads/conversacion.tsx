import type { Mensaje } from "@/lib/types";

const BURBUJA = {
  lead: "bg-elevado border border-borde text-texto",
  asistente: "bg-tinta text-tinta-texto",
  asesor: "bg-aviso-fondo text-aviso",
};

/** Transcripcion de WhatsApp con las tres voces diferenciadas. */
export function Conversacion({
  mensajes,
  asesorNombre,
}: {
  mensajes: Mensaje[];
  /** Ya resuelto por quien lo llama: aca no se puede consultar la base. */
  asesorNombre: string | null;
}) {
  if (mensajes.length === 0) {
    return (
      <p className="text-[13px] text-suave">
        Esta transcripción no está incluida en los datos de demostración.
      </p>
    );
  }

  return (
    <ol className="space-y-2.5">
      {mensajes.map((mensaje, i) => {
        const propio = mensaje.autor !== "lead";
        return (
          <li
            key={i}
            className={`flex flex-col ${propio ? "items-end" : "items-start"}`}
          >
            {mensaje.autor === "asesor" && (
              <span className="mb-1 pr-1 text-[11px] text-tenue">
                {mensaje.propio
                  ? "Entraste a la conversación"
                  : asesorNombre
                    ? `${asesorNombre} entró a la conversación`
                    : "Un asesor entró a la conversación"}
              </span>
            )}
            <div
              className={`max-w-[84%] rounded-[14px] px-3.5 py-2.5 ${BURBUJA[mensaje.autor]}`}
            >
              <p className="text-[13px] leading-relaxed">{mensaje.texto}</p>
              <p
                className={`mt-1 text-[10px] tabular-nums ${
                  mensaje.autor === "asistente" ? "text-tinta-tenue" : "text-tenue"
                }`}
              >
                {mensaje.hora}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
