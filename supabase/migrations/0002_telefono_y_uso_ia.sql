-- Dos cosas que habilitan la escritura desde la aplicacion.

-- ---------------------------------------------------------------------------
-- 1. Telefono en una sola forma canonica: solo digitos, sin "+".
--
-- La semilla guardaba "+51987350550" y WhatsApp entrega el JID como
-- "51987350550@s.whatsapp.net", o sea sin el "+". Buscar un lead por telefono
-- con dos formas distintas no encuentra nada, y cada mensaje entrante crearia
-- un lead nuevo en vez de reconocer al que ya existe.
--
-- Se elige la forma sin "+" porque es la que llega del canal: asi el dato
-- entra tal cual y el "+" se agrega solo al mostrarlo.
-- ---------------------------------------------------------------------------

update leads set telefono = regexp_replace(telefono, '[^0-9]', '', 'g');

alter table leads
  add constraint leads_telefono_solo_digitos
  check (telefono ~ '^[0-9]{6,15}$');

-- ---------------------------------------------------------------------------
-- 2. Consumo del modelo de lenguaje, por turno.
--
-- Se mide desde el primer dia porque el precio del producto necesita un piso
-- que cubra este costo variable, y eso no se puede estimar de memoria.
-- ---------------------------------------------------------------------------

create table uso_ia (
  id uuid primary key default gen_random_uuid(),
  inmobiliaria_id uuid not null references inmobiliarias (id) on delete cascade,
  lead_id uuid references leads (id) on delete set null,
  mensaje_id uuid references mensajes (id) on delete set null,
  modelo text not null,
  tokens_entrada integer not null default 0,
  tokens_salida integer not null default 0,
  costo_usd numeric(10, 6) not null default 0,
  creado_en timestamptz not null default now()
);

create index uso_ia_por_fecha on uso_ia (inmobiliaria_id, creado_en desc);

alter table uso_ia enable row level security;
