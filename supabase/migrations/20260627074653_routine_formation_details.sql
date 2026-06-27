create table "public"."routine_athlete"
(
    "id"         uuid                     not null default gen_random_uuid(),
    "routine_id" uuid,
    "name"       text,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."routine_athlete"
    enable row level security;


create table "public"."routine_formation"
(
    "id"         uuid                     not null default gen_random_uuid(),
    "routine_id" uuid,
    "sort_index" integer                  not null,
    "name"       text,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."routine_formation"
    enable row level security;


create table "public"."routine_formation_position"
(
    "id"                   uuid                     not null default gen_random_uuid(),
    "routine_athlete_id"   uuid,
    "routine_formation_id" uuid,
    "pos_x"                numeric                  not null,
    "pos_y"                numeric                  not null,
    "created_at"           timestamp with time zone not null default now()
);


alter table "public"."routine_formation_position"
    enable row level security;

CREATE UNIQUE INDEX routine_athlete_pkey ON public.routine_athlete USING btree (id);

CREATE UNIQUE INDEX routine_formation_pkey ON public.routine_formation USING btree (id);

CREATE UNIQUE INDEX routine_formation_position_pkey ON public.routine_formation_position USING btree (id);

alter table "public"."routine_athlete"
    add constraint "routine_athlete_pkey" PRIMARY KEY using index "routine_athlete_pkey";

alter table "public"."routine_formation"
    add constraint "routine_formation_pkey" PRIMARY KEY using index "routine_formation_pkey";

alter table "public"."routine_formation_position"
    add constraint "routine_formation_position_pkey" PRIMARY KEY using index "routine_formation_position_pkey";

alter table "public"."routine_athlete"
    add constraint "routine_athlete_routine_id_fkey" FOREIGN KEY (routine_id) REFERENCES public.routine (id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."routine_athlete"
    validate constraint "routine_athlete_routine_id_fkey";

alter table "public"."routine_formation"
    add constraint "routine_formation_routine_id_fkey" FOREIGN KEY (routine_id) REFERENCES public.routine (id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."routine_formation"
    validate constraint "routine_formation_routine_id_fkey";

alter table "public"."routine_formation_position"
    add constraint "routine_formation_position_routine_athlete_id_fkey" FOREIGN KEY (routine_athlete_id) REFERENCES public.routine_athlete (id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."routine_formation_position"
    validate constraint "routine_formation_position_routine_athlete_id_fkey";

alter table "public"."routine_formation_position"
    add constraint "routine_formation_position_routine_formation_id_fkey" FOREIGN KEY (routine_formation_id) REFERENCES public.routine_formation (id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."routine_formation_position"
    validate constraint "routine_formation_position_routine_formation_id_fkey";

set check_function_bodies = off;

grant all on table "public"."routine_athlete" to "anon", "authenticated", "service_role";

grant all on table "public"."routine_formation" to "anon", "authenticated", "service_role";

grant all on table "public"."routine_formation_position" to "anon", "authenticated", "service_role";

create policy "Routine_Athlete-All for Authenticated"
    on "public"."routine_athlete"
    as permissive
    for all
    to authenticated
    using (true);


create policy "Routine_Formation-All for Authenticated"
    on "public"."routine_formation"
    as permissive
    for all
    to authenticated
    using (true);


create policy "Routine_Formation_Position-All for Authenticated"
    on "public"."routine_formation_position"
    as permissive
    for all
    to authenticated
    using (true);
