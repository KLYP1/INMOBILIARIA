/** Coordenadas aproximadas del centro de cada distrito de Lima que aparece
 *  en la demostracion, incluidos los que la constructora no atiende. */
export const DISTRITOS: Record<string, { lat: number; lng: number }> = {
  "Santiago de Surco": { lat: -12.135, lng: -76.9917 },
  "Magdalena del Mar": { lat: -12.0917, lng: -77.0717 },
  "Pueblo Libre": { lat: -12.0742, lng: -77.0631 },
  "San Miguel": { lat: -12.0772, lng: -77.0925 },
  Chorrillos: { lat: -12.17, lng: -77.0167 },
  Miraflores: { lat: -12.1211, lng: -77.0297 },
  "San Isidro": { lat: -12.0972, lng: -77.0364 },
  Barranco: { lat: -12.1489, lng: -77.0211 },
  "Jesús María": { lat: -12.0736, lng: -77.0497 },
};

export const NOMBRES_DISTRITOS = Object.keys(DISTRITOS);
