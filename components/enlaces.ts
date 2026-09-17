import {
  Bot,
  Building2,
  Calendar,
  House,
  MessageCircle,
  Users,
  type LucideIcon,
} from "lucide-react";

export type Enlace = {
  href: string;
  texto: string;
  /** Rotulo corto para la barra inferior del celular, donde no cabe el largo. */
  corto: string;
  icono: LucideIcon;
};

export const ENLACES: Enlace[] = [
  { href: "/inicio", texto: "Inicio", corto: "Inicio", icono: House },
  {
    href: "/conversaciones",
    texto: "Conversaciones",
    corto: "Bandeja",
    icono: MessageCircle,
  },
  { href: "/leads", texto: "Leads", corto: "Leads", icono: Users },
  { href: "/proyectos", texto: "Proyectos", corto: "Proyectos", icono: Building2 },
  { href: "/agenda", texto: "Agenda", corto: "Agenda", icono: Calendar },
  { href: "/asistente", texto: "Asistente", corto: "Asistente", icono: Bot },
];
