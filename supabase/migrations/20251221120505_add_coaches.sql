create table "public"."coach"
(
    "id"         uuid                     not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "user_id"    uuid                     not null,
    "name"       text                     not null
);

create table "public"."coach_assignment"
(
    "id"         uuid                     not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "coach_id"   uuid                     not null,
    "team_id"    uuid                     not null
);

CREATE UNIQUE INDEX coach_assignment_pkey ON public.coach_assignment USING btree (id);

CREATE UNIQUE INDEX coach_pkey ON public.coach USING btree (id);

CREATE UNIQUE INDEX coach_user_id_key ON public.coach USING btree (user_id);

alter table "public"."coach"
    add constraint "coach_pkey" PRIMARY KEY using index "coach_pkey";

alter table "public"."coach_assignment"
    add constraint "coach_assignment_pkey" PRIMARY KEY using index "coach_assignment_pkey";

alter table "public"."coach"
    add constraint "coach_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users (id)
        ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."coach"
    validate constraint "coach_user_id_fkey";

alter table "public"."coach"
    add constraint "coach_user_id_key" UNIQUE using index "coach_user_id_key";

alter table "public"."coach_assignment"
    add constraint "coach_assignment_coach_id_fkey" FOREIGN KEY (coach_id) REFERENCES public.coach (id)
        ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."coach_assignment"
    validate constraint "coach_assignment_coach_id_fkey";

alter table "public"."coach_assignment"
    add constraint "coach_assignment_team_id_fkey" FOREIGN KEY (team_id) REFERENCES public.team (id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."coach_assignment"
    validate constraint "coach_assignment_team_id_fkey";

grant select on table "public"."coach" to "anon";

grant all on table "public"."coach" to "authenticated", "service_role";

grant select on table "public"."coach_assignment" to "anon";

grant all on table "public"."coach_assignment" to "authenticated", "service_role";


alter table "public"."coach"
    enable row level security;

alter table "public"."coach_assignment"
    enable row level security;

create policy "Coach-All for Authenticated"
    on "public"."coach"
    as permissive
    for all
    to authenticated
    using (true);

create policy "Coach-Read for all"
    on "public"."coach"
    as permissive
    for select
    to public
    using (true);

create policy "CoachAssignment-All for Authenticated"
    on "public"."coach_assignment"
    as permissive
    for all
    to authenticated
    using (true);

create policy "CoachAssignment-Read for all"
    on "public"."coach_assignment"
    as permissive
    for select
    to public
    using (true);