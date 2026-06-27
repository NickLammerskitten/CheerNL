create table "public"."routine"
(
    "id"         uuid                     not null default gen_random_uuid(),
    "name"       text                     not null,
    "team_id"    uuid,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."routine"
    enable row level security;

CREATE UNIQUE INDEX routine_pkey ON public.routine USING btree (id);

alter table "public"."routine"
    add constraint "routine_pkey" PRIMARY KEY using index "routine_pkey";

alter table "public"."routine"
    add constraint "routine_team_id_fkey" FOREIGN KEY (team_id) REFERENCES public.team (id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."routine"
    validate constraint "routine_team_id_fkey";

set check_function_bodies = off;

grant all on table "public"."routine" to "authenticated", "service_role";

create policy "Routine-All for Authenticated"
    on "public"."routine"
    as permissive
    for all
    to authenticated
    using (true);