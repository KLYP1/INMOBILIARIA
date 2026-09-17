"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Tarjeta, TituloTarjeta } from "@/components/ui/tarjeta";
import type { PuntoSemana } from "@/lib/metricas";

const AMBAR = "#f0b429";
const TINTA = "#1c1c1a";

function Leyenda() {
  return (
    <div className="flex items-center gap-4 text-[11px] text-suave">
      <span className="flex items-center gap-1.5">
        <span className="size-2 rounded-full" style={{ background: AMBAR }} />
        Últimas 4 semanas
      </span>
      <span className="flex items-center gap-1.5">
        <span className="size-2 rounded-full" style={{ background: TINTA }} />
        Periodo anterior
      </span>
    </div>
  );
}

export function GraficoSemanas({ datos }: { datos: PuntoSemana[] }) {
  return (
    <Tarjeta className="min-w-0 p-5">
      <TituloTarjeta accion={<Leyenda />}>Leads por semana</TituloTarjeta>

      <div className="mt-6 h-[196px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={datos} margin={{ top: 4, right: 8, bottom: 0, left: -24 }}>
            <CartesianGrid stroke="#e8e3d6" vertical={false} />
            <XAxis
              dataKey="etiqueta"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#a39e90", fontSize: 11 }}
              dy={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#a39e90", fontSize: 11 }}
              width={48}
            />
            <Tooltip
              cursor={{ stroke: "#e8e3d6" }}
              contentStyle={{
                background: "#fffdf8",
                border: "1px solid #e8e3d6",
                borderRadius: 10,
                fontSize: 12,
                color: "#1c1c1a",
              }}
              labelStyle={{ color: "#6e6a5e" }}
              formatter={(valor, nombre) => [
                `${valor} leads`,
                nombre === "actual" ? "Últimas 4 semanas" : "Periodo anterior",
              ]}
            />
            <Line
              type="linear"
              dataKey="previo"
              stroke={TINTA}
              strokeWidth={1.5}
              strokeDasharray="3 4"
              dot={{ r: 2.5, fill: TINTA, strokeWidth: 0 }}
              activeDot={{ r: 3.5, fill: TINTA, strokeWidth: 0 }}
            />
            <Line
              type="linear"
              dataKey="actual"
              stroke={AMBAR}
              strokeWidth={2}
              dot={{ r: 3, fill: AMBAR, strokeWidth: 0 }}
              activeDot={{ r: 4.5, fill: AMBAR, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Tarjeta>
  );
}
