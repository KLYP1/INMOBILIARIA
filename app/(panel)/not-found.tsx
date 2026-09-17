import Link from "next/link";

export default function NoEncontrado() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <p className="text-[11px] text-tenue">Error 404</p>
      <h1 className="mt-3 text-[27px] leading-tight font-normal">
        Esta página no existe
      </h1>
      <p className="mt-2 max-w-[380px] text-[13px] text-suave">
        Puede que el proyecto se haya archivado o que la dirección esté mal
        escrita.
      </p>
      <Link
        href="/inicio"
        className="mt-6 rounded-full bg-ambar px-4 py-2.5 text-[13px] text-tinta transition-colors duration-200 hover:bg-tinta hover:text-tinta-texto"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
