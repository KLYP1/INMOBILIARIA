"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { Tarjeta, TituloTarjeta } from "@/components/ui/tarjeta";
import type { Distrito } from "@/lib/metricas";

const COLORES = ["#f0b429", "#1c1c1a", "#a39e90", "#e8e3d6"];

export function DonaDistritos({
  partes,
  total,
}: {
  partes: Distrito[];
  total: number;
}) {
  return (
    <Tarjeta className="min-w-0 p-5">
      <TituloTarjeta>Distritos más pedidos</TituloTarjeta>

      <div className="mt-4 flex items-center gap-5">
        <div className="relative size-[150px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={partes}
                dataKey="leads"
                nameKey="nombre"
                innerRadius={48}
                outerRadius={72}
                startAngle={90}
                endAngle={-270}
                paddingAngle={2}
                stroke="none"
                isAnimationActive={false}
              >
                {partes.map((parte, i) => (
                  <Cell key={parte.nombre} fill={COLORES[i % COLORES.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[26px] leading-none font-normal tabular-nums">
              {total}
            </span>
            <span className="mt-1 text-[11px] text-tenue">leads</span>
          </div>
        </div>

        <ul className="min-w-0 flex-1 space-y-2.5">
          {partes.map((parte, i) => (
            <li key={parte.nombre} className="flex items-center gap-2.5">
              <span
                className="size-2 shrink-0 rounded-full"
                style={{ background: COLORES[i % COLORES.length] }}
              />
              <span className="min-w-0 flex-1 truncate text-[12px] text-suave">
                {parte.nombre}
              </span>
              <span className="text-[12px] tabular-nums">
                {parte.porcentaje}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Tarjeta>
  );
}
