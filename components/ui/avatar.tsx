import { iniciales } from "@/lib/formato";

export function Avatar({
  nombre,
  className = "size-7",
}: {
  nombre: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-elevado border border-borde text-[10px] text-suave ${className}`}
      aria-hidden
    >
      {iniciales(nombre)}
    </span>
  );
}
