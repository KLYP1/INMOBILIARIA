-- Esquema inicial de KLYP Inmobiliario.
--
-- Dos decisiones que atraviesan todo el archivo:
--
-- 1. Multi-inquilino desde el primer dia. Toda tabla de datos cuelga de
--    inmobiliaria_id. Agregar la tenencia despues, con datos reales adentro,
--    es el error mas caro de este tipo de producto.
--
-- 2. El score NO se guarda. Se calcula al leer, con calcularScore() de
--    lib/scoring.ts, contra el inventario del momento. Un score guardado
--    envejece mal: el lead no cambio, pero se agoto la unidad que le calzaba.

-- ---------------------------------------------------------------------------
-- Tipos. Espejo exacto de las uniones de lib/types.ts, para que la base
-- rechace lo que TypeScript ya rechaza.
-- ---------------------------------------------------------------------------

create type origen_lead as enum ('meta_ads', 'portal', 'web', 'organico', 'referido');
create type canal_mensaje as enum ('whatsapp', 'instagram', 'messenger');
create type forma_pago as enum ('contado', 'credito_hipotecario', 'mivivienda', 'no_definido');
create type plazo_mudanza as enum ('inmediato', '3_6_meses', '6_12_meses', 'solo_explorando');
create type estado_lead as enum ('nuevo', 'en_conversacion', 'calificado', 'visita_agendada', 'frio', 'descartado');
create type objecion_lead as enum ('precio', 'ubicacion', 'financiamiento', 'metraje', 'plazo_entrega');
create type etapa_proyecto as enum ('en_planos', 'en_construccion', 'entrega_inmediata');
create type estado_visita as enum ('confirmada', 'pendiente_confirmacion', 'asistio', 'no_asistio', 'reprogramada');
create type autor_mensaje as enum ('lead', 'asistente', 'asesor');
create type interes_visita as enum ('alto', 'medio', 'bajo');
create type siguiente_paso as enum ('cotizacion', 'segunda_visita', 'separacion', 'seguimiento', 'descartar');
create type plazo_seguimiento as enum ('manana', 'tres_dias', 'semana');
create type rol_usuario as enum ('gerente', 'vendedor');

-- ---------------------------------------------------------------------------
-- Inquilinos y personas
-- ---------------------------------------------------------------------------

create table inmobiliarias (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  creada_en timestamptz not null default now()
);

create table asesores (
  id uuid primary key default gen_random_uuid(),
  inmobiliaria_id uuid not null references inmobiliarias (id) on delete cascade,
  nombre text not null,
  telefono text not null default '',
  activo boolean not null default true,
  creado_en timestamptz not null default now()
);

-- Une una cuenta de Supabase Auth con su inmobiliaria y su rol. Sin fila aqui,
-- una cuenta autenticada no alcanza ningun dato: es la base del aislamiento.
create table usuarios (
  id uuid primary key references auth.users (id) on delete cascade,
  inmobiliaria_id uuid not null references inmobiliarias (id) on delete cascade,
  nombre text not null,
  rol rol_usuario not null default 'vendedor',
  -- Un vendedor mira el panel como asesor; un gerente puede no serlo.
  asesor_id uuid references asesores (id) on delete set null,
  creado_en timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Inventario
-- ---------------------------------------------------------------------------

create table proyectos (
  id uuid primary key default gen_random_uuid(),
  inmobiliaria_id uuid not null references inmobiliarias (id) on delete cascade,
  -- Identificador legible para las URLs: /proyectos/altavista.
  slug text not null,
  nombre text not null,
  distrito text not null,
  lat double precision not null,
  lng double precision not null,
  etapa etapa_proyecto not null,
  activo boolean not null default true,
  creado_en timestamptz not null default now(),
  unique (inmobiliaria_id, slug)
);

create table unidades (
  id uuid primary key default gen_random_uuid(),
  proyecto_id uuid not null references proyectos (id) on delete cascade,
  dormitorios smallint not null check (dormitorios >= 0),
  metraje numeric(6, 2) not null check (metraje > 0),
  precio numeric(12, 2) not null check (precio > 0),
  disponibles smallint not null default 0 check (disponibles >= 0)
);

create table asesores_proyectos (
  asesor_id uuid not null references asesores (id) on delete cascade,
  proyecto_id uuid not null references proyectos (id) on delete cascade,
  primary key (asesor_id, proyecto_id)
);

-- ---------------------------------------------------------------------------
-- Leads y conversaciones
-- ---------------------------------------------------------------------------

create table leads (
  id uuid primary key default gen_random_uuid(),
  inmobiliaria_id uuid not null references inmobiliarias (id) on delete cascade,
  nombre text not null,
  -- El numero COMPLETO, en formato internacional. El enmascarado de la demo
  -- era destructivo; ahora se enmascara al mostrar, no al guardar, porque el
  -- bot necesita el numero de verdad para poder escribir.
  telefono text not null,
  origen origen_lead not null,
  canal canal_mensaje not null default 'whatsapp',
  proyecto_id uuid references proyectos (id) on delete set null,
  presupuesto_min numeric(12, 2) not null default 0,
  presupuesto_max numeric(12, 2) not null default 0,
  forma_pago forma_pago not null default 'no_definido',
  dormitorios smallint,
  zona_solicitada text not null default '',
  plazo_mudanza plazo_mudanza not null default 'solo_explorando',
  estado estado_lead not null default 'nuevo',
  objecion objecion_lead,
  asesor_id uuid references asesores (id) on delete set null,
  primera_respuesta_seg integer,
  -- Quien responde toma la conversacion: el asistente se calla.
  bot_pausado boolean not null default false,
  nota_interna text not null default '',
  resumen_ia text not null default '',
  creado_en timestamptz not null default now(),
  ultimo_contacto timestamptz not null default now(),
  -- Un mismo telefono no puede ser dos leads de la misma inmobiliaria: es lo
  -- que permite reconocer a quien vuelve a escribir meses despues.
  unique (inmobiliaria_id, telefono)
);

create table mensajes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads (id) on delete cascade,
  autor autor_mensaje not null,
  texto text not null check (length(btrim(texto)) > 0),
  -- Lo escribio quien esta usando el panel, no un asesor del historico.
  propio boolean not null default false,
  enviado_en timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Agenda y seguimiento
-- ---------------------------------------------------------------------------

create table visitas (
  id uuid primary key default gen_random_uuid(),
  inmobiliaria_id uuid not null references inmobiliarias (id) on delete cascade,
  lead_id uuid not null references leads (id) on delete cascade,
  proyecto_id uuid not null references proyectos (id) on delete cascade,
  asesor_id uuid references asesores (id) on delete set null,
  fecha_hora timestamptz not null,
  estado estado_visita not null default 'pendiente_confirmacion',
  -- Null mientras no se sepa; true o false cuando el asesor lo marca en obra.
  llego boolean,
  interes interes_visita,
  siguiente_paso siguiente_paso,
  nota_resultado text not null default '',
  creada_en timestamptz not null default now()
);

create table seguimientos (
  id uuid primary key default gen_random_uuid(),
  -- Uno activo por lead: programar otro reemplaza al anterior.
  lead_id uuid not null unique references leads (id) on delete cascade,
  plazo plazo_seguimiento not null,
  enviar_en timestamptz not null,
  enviado_en timestamptz,
  creado_en timestamptz not null default now()
);

-- La configuracion se lee y se escribe entera, nunca por campo, y su forma la
-- manda ConfigAsistente en TypeScript. Normalizarla en ocho tablas seria
-- ceremonia sin beneficio.
create table config_asistente (
  inmobiliaria_id uuid primary key references inmobiliarias (id) on delete cascade,
  config jsonb not null,
  actualizada_en timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Indices. Los tres ordenes por los que el panel lee de verdad.
-- ---------------------------------------------------------------------------

create index leads_por_contacto on leads (inmobiliaria_id, ultimo_contacto desc);
create index leads_por_proyecto on leads (proyecto_id);
create index leads_por_asesor on leads (asesor_id);
create index mensajes_por_lead on mensajes (lead_id, enviado_en);
create index visitas_por_fecha on visitas (inmobiliaria_id, fecha_hora);
create index visitas_por_lead on visitas (lead_id);
create index unidades_por_proyecto on unidades (proyecto_id);
create index seguimientos_pendientes on seguimientos (enviar_en) where enviado_en is null;

-- ---------------------------------------------------------------------------
-- Seguridad. Se activa RLS en todo y no se escribe ninguna politica todavia:
-- sin politica, RLS niega. Asi ninguna tabla nace abierta por descuido. El
-- panel lee desde el servidor con service_role, que salta RLS a proposito.
-- Las politicas por inmobiliaria llegan con las cuentas, en la fase 2.
-- ---------------------------------------------------------------------------

alter table inmobiliarias enable row level security;
alter table usuarios enable row level security;
alter table asesores enable row level security;
alter table proyectos enable row level security;
alter table unidades enable row level security;
alter table asesores_proyectos enable row level security;
alter table leads enable row level security;
alter table mensajes enable row level security;
alter table visitas enable row level security;
alter table seguimientos enable row level security;
alter table config_asistente enable row level security;
