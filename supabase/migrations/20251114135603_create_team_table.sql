create table "public"."team"
(
    "id"         uuid                     not null default gen_random_uuid(),
    "name"       text                     not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone
);

alter table "public"."team"
    enable row level security;

CREATE UNIQUE INDEX team_name_key ON public.team USING btree (name);

CREATE UNIQUE INDEX team_pkey ON public.team USING btree (id);

alter table "public"."team"
    add constraint "team_pkey" PRIMARY KEY using index "team_pkey";

alter table "public"."team"
    add constraint "team_name_key" UNIQUE using index "team_name_key";

grant ALL on table "public"."team" to "anon", "authenticated", "service_role";

create policy "Team-All for Authenticated"
    on "public"."team"
    as permissive
    for all
    to authenticated
    using (true);

create policy "Team-Read for all"
    on "public"."team"
    as permissive
    for all
    to public
    using (true);
