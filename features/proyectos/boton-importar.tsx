"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import { ModalImportar } from "./modal-importar";

export function BotonImportar() {
  const [abierto, setAbierto] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setAbierto(true)}
        className="inline-flex items-center gap-2 rounded-full border border-borde px-4 py-2.5 text-[13px] transition-colors duration-200 hover:bg-elevado"
      >
        <Upload className="size-4" strokeWidth={1.5} />
        Importar inventario desde Excel
      </button>
      {abierto && <ModalImportar onCerrar={() => setAbierto(false)} />}
    </>
  );
}
