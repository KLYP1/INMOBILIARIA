import type { ReactNode } from "react";
import { BarraInferior } from "@/components/barra-inferior";
import { Navegacion } from "@/components/navegacion";
import { ProveedorDemo } from "@/features/estado/proveedor-demo";
import { leadsCalientes } from "@/lib/metricas";

/**
 * Las fechas de la demostracion se calculan respecto de hoy. Si Next
 * prerenderizara estas rutas, quedarian congeladas en el momento del build y la
 * demo se veria vieja al dia siguiente.
 */
export const dynamic = "force-dynamic";

export default function PanelLayout({ children }: { children: ReactNode }) {
  return (
    <ProveedorDemo>
      {/* El pb del celular deja pasar la barra inferior sin tapar contenido. */}
      <div className="mx-auto w-full max-w-[1320px] px-4 pb-28 sm:px-6 lg:pb-12">
        <Navegacion avisos={leadsCalientes().length} />
        <main>{children}</main>
      </div>
      <BarraInferior />
    </ProveedorDemo>
  );
}
