import { Camera, MessageCircle, MessageSquare } from "lucide-react";
import type { Canal } from "@/lib/types";

/**
 * Lucide no trae iconos de marca, asi que se usan formas de trazo distintas y
 * el reconocimiento se apoya en el texto, que es lo que de verdad se lee.
 */
const ICONO = {
  whatsapp: MessageCircle,
  instagram: Camera,
  messenger: MessageSquare,
};

export const NOMBRE_CANAL: Record<Canal, string> = {
  whatsapp: "WhatsApp",
  instagram: "Instagram",
  messenger: "Messenger",
};

export function CanalIcono({
  canal,
  className = "size-3.5",
}: {
  canal: Canal;
  className?: string;
}) {
  const Icono = ICONO[canal];
  return (
    <Icono
      className={`${className} shrink-0 text-tenue`}
      strokeWidth={1.5}
      aria-label={NOMBRE_CANAL[canal]}
    />
  );
}

export function CanalEtiqueta({ canal }: { canal: Canal }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] text-tenue">
      <CanalIcono canal={canal} className="size-3" />
      {NOMBRE_CANAL[canal]}
    </span>
  );
}
