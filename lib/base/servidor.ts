import "server-only";

/**
 * La puerta del panel a la base. El guard de arriba es la unica razon de ser
 * de este archivo: impide que un componente de cliente importe por accidente
 * un cliente con la clave de servicio, que acabaria en el navegador.
 *
 * El trabajador de WhatsApp importa de cliente-supabase.ts, sin el guard,
 * porque corre fuera de Next y ese guard lo haria reventar.
 */
export { crearClienteServicio as clienteServidor } from "./cliente-supabase";
