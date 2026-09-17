import Link from "next/link";
import { EMPRESA } from "@/lib/data/empresa";

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-[380px]">
        <p className="text-[13px] tracking-[0.14em] text-suave">KLYP</p>
        <h1 className="mt-6 text-[27px] leading-tight font-normal">
          Entra al panel de {EMPRESA.nombre}
        </h1>
        <p className="mt-2 text-[13px] text-suave">
          El asistente atendió a tus leads mientras no estabas.
        </p>

        <form className="mt-8 space-y-3">
          <label className="block">
            <span className="text-[11px] text-tenue">Correo</span>
            <input
              type="email"
              defaultValue="mariana@grupovertiente.pe"
              className="mt-1.5 w-full rounded-[10px] border border-borde bg-elevado px-3.5 py-2.5 text-[13px] outline-none transition-colors duration-200 focus:border-tenue"
            />
          </label>
          <label className="block">
            <span className="text-[11px] text-tenue">Contraseña</span>
            <input
              type="password"
              defaultValue="demostracion"
              className="mt-1.5 w-full rounded-[10px] border border-borde bg-elevado px-3.5 py-2.5 text-[13px] outline-none transition-colors duration-200 focus:border-tenue"
            />
          </label>
          <Link
            href="/inicio"
            className="block rounded-full bg-ambar px-4 py-3 text-center text-[13px] text-tinta transition-colors duration-200 hover:bg-tinta hover:text-tinta-texto"
          >
            Entrar
          </Link>
        </form>

        <p className="mt-6 text-[11px] text-tenue">
          Versión de demostración con datos de muestra.
        </p>
      </div>
    </div>
  );
}
